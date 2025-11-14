import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private model: ChatGoogleGenerativeAI;
  private systemPrompt: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.initializeModel();
  }

  private initializeModel() {
    // Initialize Gemini model
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey,
      temperature: 0.7,
      maxRetries: 2,
    });

    this.systemPrompt = `You are an expert AI assistant for Predictive Maintenance system. Your role is to:

1. Monitor and analyze machine conditions
2. Provide insights about sensor readings and predictions
3. Alert users about potential failures
4. Recommend maintenance actions
5. Answer questions about machine health and history

Response Guidelines:
- Be concise and professional
- Use technical terminology appropriately
- Provide actionable insights
- Cite specific data when available
- Alert users about high-risk situations
- Format responses in a clear, easy-to-read manner
- Use markdown formatting for better readability

When analyzing machines:
- Risk Score ≥ 0.7 = HIGH RISK (immediate attention needed) ⚠️
- Risk Score 0.4-0.7 = MODERATE RISK (schedule maintenance) ⚡
- Risk Score < 0.4 = LOW RISK (normal operation) ✅

Machine Types:
- L (Low quality variant) - Lower performance, more prone to tool wear
- M (Medium quality variant) - Balanced performance
- H (High quality variant) - Higher performance, more stable

Failure Types:
- Heat Dissipation Failure - Overheating issues
- Power Failure - Electrical system issues
- Overstrain Failure - Excessive load or stress
- Tool Wear Failure - Tool degradation over time
- Random Failures - Unpredictable failures

When given Context Data about machines, use that information to provide accurate insights.`;

    this.logger.log('AI Model initialized with Gemini');
  }

  private async enrichMessageWithData(message: string): Promise<string> {
    // Always fetch all machines data for comprehensive context
    // This allows AI to answer any question about machines without keyword detection

    // Check if message mentions specific machine IDs
    const machineKeywords = message.match(/\b(L|M|H)\d{5}\b/gi);

    if (machineKeywords && machineKeywords.length > 0) {
      // If specific machines mentioned, fetch detailed data for those machines
      return await this.getSpecificMachinesContext(message, machineKeywords);
    }

    // For all other questions, fetch all machines summary
    // This gives AI full context to answer any question intelligently
    return await this.getAllMachinesContext(message);
  }

  private async getSpecificMachinesContext(
    message: string,
    machineIds: string[],
  ): Promise<string> {
    const enrichedData: string[] = [];
    const uniqueProductIds = [
      ...new Set(machineIds.map((id) => id.toUpperCase())),
    ];

    for (const productId of uniqueProductIds) {
      try {
        const machine = await this.prisma.machine.findFirst({
          where: { productId },
          include: {
            _count: {
              select: {
                sensorReadings: true,
                predictions: true,
              },
            },
          },
        });

        if (machine) {
          // Get latest prediction
          const latestPrediction = await this.prisma.predictionResult.findFirst(
            {
              where: { machineId: machine.id },
              orderBy: { timestamp: 'desc' },
            });

          // Get recent sensor data
          const recentSensors = await this.prisma.sensorData.findMany({
            where: { machineId: machine.id },
            orderBy: { timestamp: 'desc' },
            take: 5,
          });

          // Calculate average sensor values
          let avgAirTemp = 0;
          let avgProcessTemp = 0;
          let avgRotSpeed = 0;
          let avgTorque = 0;
          let avgToolWear = 0;

          if (recentSensors.length > 0) {
            avgAirTemp =
              recentSensors.reduce((sum, s) => sum + s.airTemp, 0) /
              recentSensors.length;
            avgProcessTemp =
              recentSensors.reduce((sum, s) => sum + s.processTemp, 0) /
              recentSensors.length;
            avgRotSpeed =
              recentSensors.reduce((sum, s) => sum + s.rotationalSpeed, 0) /
              recentSensors.length;
            avgTorque =
              recentSensors.reduce((sum, s) => sum + s.torque, 0) /
              recentSensors.length;
            avgToolWear =
              recentSensors.reduce((sum, s) => sum + s.toolWear, 0) /
              recentSensors.length;
          }

          // Get prediction statistics
          const recentPredictions = await this.prisma.predictionResult.findMany(
            {
              where: { machineId: machine.id },
              orderBy: { timestamp: 'desc' },
              take: 10,
            },
          );

          const avgRisk =
            recentPredictions.length > 0
              ? recentPredictions.reduce((sum, p) => sum + p.riskScore, 0) /
                recentPredictions.length
              : 0;
          const failureCount = recentPredictions.filter(
            (p) => p.failurePredicted,
          ).length;

          enrichedData.push(`
=== Machine ${productId} Data ===
Basic Info:
- Type: ${machine.type}
- Status: ${machine.status}
- Location: ${machine.location || 'N/A'}
- Installation: ${machine.installationDate ? new Date(machine.installationDate).toLocaleDateString() : 'N/A'}
- Last Maintenance: ${machine.lastMaintenanceDate ? new Date(machine.lastMaintenanceDate).toLocaleDateString() : 'N/A'}

Statistics:
- Total Sensor Readings: ${machine._count.sensorReadings}
- Total Predictions: ${machine._count.predictions}

${
  latestPrediction
    ? `Latest Prediction (${new Date(latestPrediction.timestamp).toLocaleString()}):
- Risk Score: ${latestPrediction.riskScore.toFixed(3)}
- Failure Predicted: ${latestPrediction.failurePredicted ? 'YES ⚠️' : 'NO ✅'}
- Failure Type: ${latestPrediction.failureType || 'None'}
- Confidence: ${latestPrediction.confidence ? (latestPrediction.confidence * 100).toFixed(1) + '%' : 'N/A'}
- Predicted Failure Time: ${latestPrediction.predictedFailureTime ? new Date(latestPrediction.predictedFailureTime).toLocaleString() : 'N/A'}`
    : 'No predictions available'
}

${
  recentPredictions.length > 0
    ? `Recent Predictions (Last 10):
- Average Risk Score: ${avgRisk.toFixed(3)}
- Failures Predicted: ${failureCount}/${recentPredictions.length}`
    : ''
}

${
  recentSensors.length > 0
    ? `Latest Sensor Readings (Average of last 5):
- Air Temperature: ${avgAirTemp.toFixed(1)} K
- Process Temperature: ${avgProcessTemp.toFixed(1)} K
- Rotational Speed: ${avgRotSpeed.toFixed(0)} RPM
- Torque: ${avgTorque.toFixed(1)} Nm
- Tool Wear: ${avgToolWear.toFixed(0)} minutes`
    : 'No sensor data available'
}
          `);
        } else {
          enrichedData.push(`Machine ${productId} not found in database.`);
        }
      } catch (error) {
        this.logger.error(`Error fetching data for ${productId}:`, error);
        enrichedData.push(`Error fetching data for Machine ${productId}.`);
      }
    }

    if (enrichedData.length > 0) {
      return `${message}\n\n--- Context Data from Database ---\n${enrichedData.join('\n')}`;
    }

    return message;
  }

  private async getAllMachinesContext(message: string): Promise<string> {
    try {
      const machines = await this.prisma.machine.findMany({
        include: {
          _count: {
            select: {
              sensorReadings: true,
              predictions: true,
            },
          },
        },
        orderBy: { productId: 'asc' },
      });

      if (machines.length === 0) {
        return `${message}\n\nNo machines found in database.`;
      }

      const machinesSummary: string[] = [];

      for (const machine of machines) {
        const latestPrediction = await this.prisma.predictionResult.findFirst({
          where: { machineId: machine.id },
          orderBy: { timestamp: 'desc' },
        });

        machinesSummary.push(`
${machine.productId} (${machine.type}):
- Status: ${machine.status}
- Location: ${machine.location || 'N/A'}
- Risk Score: ${latestPrediction ? latestPrediction.riskScore.toFixed(3) : 'N/A'}
- Failure Predicted: ${latestPrediction?.failurePredicted ? 'YES ⚠️' : 'NO ✅'}
- Total Readings: ${machine._count.sensorReadings}
        `);
      }

      return `${message}\n\n--- All Machines Summary ---\n${machinesSummary.join('\n')}`;
    } catch (error) {
      this.logger.error('Error fetching all machines:', error);
      return message;
    }
  }

  async chat(
    message: string,
    conversationHistory: any[] = [],
  ): Promise<string> {
    try {
      this.logger.log(
        `Processing chat message: ${message.substring(0, 50)}...`,
      );

      // Enrich message with real-time data
      const enrichedMessage = await this.enrichMessageWithData(message);

      // Build message array for LangChain
      const messages: any[] = [new SystemMessage(this.systemPrompt)];

      // Add conversation history
      for (const msg of conversationHistory.slice(-10)) {
        // Last 10 messages
        if (msg.role === 'user') {
          messages.push(new HumanMessage(msg.content));
        } else if (msg.role === 'assistant') {
          messages.push(new AIMessage(msg.content));
        }
      }

      // Add current message
      messages.push(new HumanMessage(enrichedMessage));

      // Get AI response
      const response = await this.model.invoke(messages);

      this.logger.log('Chat response generated successfully');
      return response.content as string;
    } catch (error) {
      this.logger.error('Error in chat:', error);
      throw new Error('Failed to process chat message. Please try again.');
    }
  }
}
