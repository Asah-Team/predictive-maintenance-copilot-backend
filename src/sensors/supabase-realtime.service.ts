import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  SupabaseClient,
  RealtimeChannel,
  REALTIME_SUBSCRIBE_STATES,
} from '@supabase/supabase-js';
import { SensorsRealtimeGateway } from './sensors-realtime.gateway';
import { DEFAULT_THRESHOLDS } from './interfaces/sensor-reading.interface';

@Injectable()
export class SupabaseRealtimeService implements OnModuleInit, OnModuleDestroy {
  private supabase: SupabaseClient;
  private channel: RealtimeChannel;
  private logger = new Logger('SupabaseRealtimeService');

  constructor(
    private configService: ConfigService,
    private wsGateway: SensorsRealtimeGateway,
  ) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn(
        'Supabase credentials not configured. Realtime disabled.',
      );
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);

    // Subscribe to INSERT events on sensor_readings table
    this.channel = this.supabase
      .channel('sensor-readings-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_readings',
        },
        (payload) => {
          this.logger.log('New sensor reading inserted:', payload.new);
          this.handleNewReading(payload.new);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sensor_readings',
        },
        (payload) => {
          this.logger.log('Sensor reading updated:', payload.new);
          this.handleNewReading(payload.new);
        },
      )
      .subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          this.logger.log('✅ Supabase Realtime subscription active');
        } else {
          this.logger.warn(`Subscription status: ${status}`);
        }
      });
  }

  private handleNewReading(reading: any) {
    // Emit to WebSocket clients
    this.wsGateway.emitNewReading(reading);

    // Check for anomalies
    const anomalies = this.detectAnomalies(reading);
    if (anomalies.length > 0) {
      this.wsGateway.emitAnomalyDetected({
        ...reading,
        anomalies,
      });
    }
  }

  private detectAnomalies(reading: any): string[] {
    const anomalies: string[] = [];

    if (reading.air_temp < DEFAULT_THRESHOLDS.airTempMin) {
      anomalies.push(
        `Air temperature too low: ${reading.air_temp}K (min: ${DEFAULT_THRESHOLDS.airTempMin}K)`,
      );
    }
    if (reading.air_temp > DEFAULT_THRESHOLDS.airTempMax) {
      anomalies.push(
        `Air temperature too high: ${reading.air_temp}K (max: ${DEFAULT_THRESHOLDS.airTempMax}K)`,
      );
    }
    if (reading.process_temp > DEFAULT_THRESHOLDS.processTempMax) {
      anomalies.push(
        `Process temperature too high: ${reading.process_temp}K (max: ${DEFAULT_THRESHOLDS.processTempMax}K)`,
      );
    }
    if (reading.rotational_speed > DEFAULT_THRESHOLDS.rotationalSpeedMax) {
      anomalies.push(
        `Rotational speed too high: ${reading.rotational_speed} RPM (max: ${DEFAULT_THRESHOLDS.rotationalSpeedMax} RPM)`,
      );
    }
    if (reading.tool_wear > DEFAULT_THRESHOLDS.toolWearMax) {
      anomalies.push(
        `Tool wear critical: ${reading.tool_wear} min (max: ${DEFAULT_THRESHOLDS.toolWearMax} min)`,
      );
    }
    if (reading.torque < DEFAULT_THRESHOLDS.torqueMin) {
      anomalies.push(
        `Torque too low: ${reading.torque} Nm (min: ${DEFAULT_THRESHOLDS.torqueMin} Nm)`,
      );
    }
    if (reading.torque > DEFAULT_THRESHOLDS.torqueMax) {
      anomalies.push(
        `Torque too high: ${reading.torque} Nm (max: ${DEFAULT_THRESHOLDS.torqueMax} Nm)`,
      );
    }

    return anomalies;
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.supabase.removeChannel(this.channel);
      this.logger.log('Supabase Realtime subscription closed');
    }
  }
}
