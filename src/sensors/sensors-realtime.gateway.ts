import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/sensors',
})
export class SensorsRealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SensorsRealtimeGateway');

  afterInit(_server: Server) {
    this.logger.log('WebSocket Gateway initialized for sensors');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Send welcome message
    client.emit('connection', {
      message: 'Connected to sensor realtime feed',
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitNewReading(data: any) {
    this.server.emit('sensor-reading', {
      event: 'new-reading',
      data,
      timestamp: new Date(),
    });
    this.logger.log(`Emitted new reading for machine: ${data.machineId}`);
  }

  emitAnomalyDetected(data: any) {
    this.server.emit('sensor-anomaly', {
      event: 'anomaly-detected',
      data,
      timestamp: new Date(),
    });
    this.logger.warn(`Anomaly detected for machine: ${data.machineId}`);
  }
}
