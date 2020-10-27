# `motion_data`

-   `motion_data` is one of the Socket IO events published by the Backend.
-   This model encapsulates positional information of the player and NPCs.
-   The object is a JSON representation of `CarMotionData_V1` - https://gitlab.com/gparent/f1-2020-telemetry/-/blob/master/f1_2020_telemetry/packets.py#L135

## Sample Model

```json
{
    "player_motion": {
        "worldPositionX": -250.6400909423828,
        "worldPositionY": 2.6114730834960938,
        "worldPositionZ": 147.947998046875
    },
    "npc_motion": [
        {
            "worldPositionX": -148.0697479248047,
            "worldPositionY": 3.5857884883880615,
            "worldPositionZ": 107.111572265625
        },
        {
            "worldPositionX": -229.46119689941406,
            "worldPositionY": 2.3404951095581055,
            "worldPositionZ": 82.07406616210938
        },
        {
            "worldPositionX": 21.507442474365234,
            "worldPositionY": 6.347572326660156,
            "worldPositionZ": 33.36832809448242
        },
        {
            "worldPositionX": -83.72505187988281,
            "worldPositionY": 5.004010200500488,
            "worldPositionZ": 78.30706024169922
        },
        {
            "worldPositionX": -158.59417724609375,
            "worldPositionY": 3.4222447872161865,
            "worldPositionZ": 107.56078338623047
        },
        {
            "worldPositionX": -169.1190643310547,
            "worldPositionY": 3.3680481910705566,
            "worldPositionZ": 105.21893310546875
        },
        {
            "worldPositionX": -112.54804992675781,
            "worldPositionY": 4.364667892456055,
            "worldPositionZ": 93.30223083496094
        },
        {
            "worldPositionX": -170.3975067138672,
            "worldPositionY": 3.375859022140503,
            "worldPositionZ": 107.3274154663086
        },
        {
            "worldPositionX": -120.62701416015625,
            "worldPositionY": 4.1806321144104,
            "worldPositionZ": 97.07411193847656
        },
        {
            "worldPositionX": -237.5461883544922,
            "worldPositionY": 2.360743999481201,
            "worldPositionZ": 86.56831359863281
        },
        {
            "worldPositionX": -214.51873779296875,
            "worldPositionY": 2.4788947105407715,
            "worldPositionZ": 80.04399108886719
        },
        {
            "worldPositionX": -199.61679077148438,
            "worldPositionY": 2.946566104888916,
            "worldPositionZ": 84.9427719116211
        },
        {
            "worldPositionX": -38.7694206237793,
            "worldPositionY": 6.253708362579346,
            "worldPositionZ": 56.93212890625
        },
        {
            "worldPositionX": -97.48492431640625,
            "worldPositionY": 4.670758247375488,
            "worldPositionZ": 85.32176971435547
        },
        {
            "worldPositionX": -1.0556846857070923,
            "worldPositionY": 6.564920902252197,
            "worldPositionZ": 40.78436279296875
        },
        {
            "worldPositionX": 44.081298828125,
            "worldPositionY": 5.89452600479126,
            "worldPositionZ": 26.333179473876953
        },
        {
            "worldPositionX": -137.84158325195312,
            "worldPositionY": 3.780658483505249,
            "worldPositionZ": 104.58466339111328
        },
        {
            "worldPositionX": -73.91252136230469,
            "worldPositionY": 5.2809624671936035,
            "worldPositionZ": 73.40011596679688
        },
        {
            "worldPositionX": -29.58452033996582,
            "worldPositionY": 6.398814678192139,
            "worldPositionZ": 52.10834503173828
        }
    ]
}
```
