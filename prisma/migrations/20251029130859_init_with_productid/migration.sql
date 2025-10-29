-- CreateTable
CREATE TABLE "machines" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_readings" (
    "udi" SERIAL NOT NULL,
    "machine_id" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "air_temp" DOUBLE PRECISION NOT NULL,
    "process_temp" DOUBLE PRECISION NOT NULL,
    "rotational_speed" INTEGER NOT NULL,
    "torque" DOUBLE PRECISION NOT NULL,
    "tool_wear" INTEGER NOT NULL,

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("udi")
);

-- CreateIndex
CREATE UNIQUE INDEX "machines_product_id_key" ON "machines"("product_id");

-- CreateIndex
CREATE INDEX "sensor_readings_machine_id_timestamp_idx" ON "sensor_readings"("machine_id", "timestamp");

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
