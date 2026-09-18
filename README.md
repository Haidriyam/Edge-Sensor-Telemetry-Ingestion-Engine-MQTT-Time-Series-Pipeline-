![IoT Telemetry CI](https://github.com/Haidriyam/iot-telemetry-pipeline/actions/workflows/ci.yml/badge.svg)

# Edge Sensor Telemetry & Stream Ingestion Engine

A low-latency, event-driven stream processing pipeline designed to ingest simulated IoT device telemetry, perform real-time threshold scoring, and detect edge-state anomalies.

```text
[ Edge Sensor Nodes ] ──► [ Ingestion Worker ] ──► [ Event Filter ] ──► (Anomaly Alerts)
                                                                 └──► (Clean Telemetry Sink)