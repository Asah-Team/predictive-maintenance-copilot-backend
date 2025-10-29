export interface SensorReading {
  udi: number;
  machineId: string;
  timestamp: Date;
  airTemp: number;
  processTemp: number;
  rotationalSpeed: number;
  torque: number;
  toolWear: number;
}

export interface SensorAnomalyThresholds {
  airTempMin: number;
  airTempMax: number;
  processTempMax: number;
  rotationalSpeedMax: number;
  toolWearMax: number;
  torqueMin: number;
  torqueMax: number;
}

export const DEFAULT_THRESHOLDS: SensorAnomalyThresholds = {
  airTempMin: 295,
  airTempMax: 310,
  processTempMax: 320,
  rotationalSpeedMax: 3000,
  toolWearMax: 200,
  torqueMin: 20,
  torqueMax: 70,
};
