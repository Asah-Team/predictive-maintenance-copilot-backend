/**
 * Machine Entity
 * Represents a physical machine being monitored for predictive maintenance
 *
 * @interface Machine
 * @description Core machine entity with UUID identifier and type classification from dataset
 */
export interface Machine {
  /** Unique identifier (UUID v4) */
  id: string;

  /** Product ID from dataset (e.g., M23839, L56160, H38406) */
  productId: string;

  /** Machine type: L (Low), M (Medium), H (High) */
  type: 'L' | 'M' | 'H';
}

/**
 * Machine with Statistics
 * Extended machine entity including sensor reading aggregations
 *
 * @interface MachineWithStats
 * @extends Machine
 */
export interface MachineWithStats extends Machine {
  /** Aggregated sensor reading counts */
  _count?: {
    sensorReadings: number;
  };

  /** Latest sensor readings (most recent 10) */
  latestReadings?: Array<{
    id: number;
    timestamp: Date;
    airTemp: number;
    processTemp: number;
    rotationalSpeed: number;
    torque: number;
    toolWear: number;
  }>;
}
