const EventEmitter = require('events');

class TelemetryEngine extends EventEmitter {
    constructor(threshold = 30.0) {
        super();
        this.threshold = threshold;
        this.recordsProcessed = 0;
        this.anomaliesDetected = 0;
    }

    processPacket(packet) {
        if (!packet.deviceId || typeof packet.temperature !== 'number') {
            throw new Error('Malformed telemetry payload: missing required fields');
        }

        this.recordsProcessed++;
        const isAnomaly = packet.temperature > this.threshold;

        if (isAnomaly) {
            this.anomaliesDetected++;
            this.emit('anomaly', {
                deviceId: packet.deviceId,
                temperature: packet.temperature,
                timestamp: packet.timestamp || new Date().toISOString()
            });
        }

        return {
            status: isAnomaly ? 'FLAGGED_ANOMALY' : 'INGESTED_OK',
            deviceId: packet.deviceId,
            temperature: packet.temperature
        };
    }
}

// Self-test runner for CI & local execution
if (require.main === module) {
    const engine = new TelemetryEngine(28.0);

    engine.on('anomaly', (alert) => {
        console.log(`[ALERT] High-temp anomaly detected on node ${alert.deviceId}: ${alert.temperature}°C`);
    });

    console.log('[*] Initializing telemetry stream simulation...');

    const sampleStream = [
        { deviceId: 'node-01', temperature: 24.5, timestamp: new Date().toISOString() },
        { deviceId: 'node-02', temperature: 29.2, timestamp: new Date().toISOString() },
        { deviceId: 'node-01', temperature: 25.1, timestamp: new Date().toISOString() },
        { deviceId: 'node-03', temperature: 31.8, timestamp: new Date().toISOString() }
    ];

    sampleStream.forEach(packet => {
        const result = engine.processPacket(packet);
        console.log(`[INGEST] Device: ${result.deviceId} | Result: ${result.status}`);
    });

    console.log(`[+] Complete. Processed: ${engine.recordsProcessed}, Anomalies: ${engine.anomaliesDetected}`);

    if (engine.recordsProcessed !== 4 || engine.anomaliesDetected !== 2) {
        console.error('[!] Test validation failed.');
        process.exit(1);
    }
    console.log('[+] Verification passed successfully.');
}

module.exports = TelemetryEngine;