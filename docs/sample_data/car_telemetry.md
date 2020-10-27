# `car_telemetry`

-   `car_telemetry` is one of the Socket IO events published by the Backend.
-   This model encapsulates information about the player's car.
-   The object is a JSON representation of `CarTelemetryData_V1` - https://gitlab.com/gparent/f1-2020-telemetry/-/blob/master/f1_2020_telemetry/packets.py#L573

## Sample Model

```json
{
    "speed": 289,
    "throttle": 1,
    "steer": 0,
    "brake": 0,
    "clutch": 0,
    "gear": 7,
    "engineRPM": 11615,
    "drs": 1,
    "revLightsPercent": 70,
    "brakesTemperature": [34, 34, 34, 34],
    "tyresSurfaceTemperature": [100, 100, 100, 100],
    "tyresInnerTemperature": [100, 100, 100, 100],
    "engineTemperature": 90,
    "tyresPressure": [21.940994262695312, 21.940994262695312, 23.47176170349121, 23.47176170349121],
    "surfaceType": [0, 0, 0, 0]
}
```
