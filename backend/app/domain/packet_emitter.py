import socket
import eventlet
from loguru import logger
from f1_2020_telemetry import packets as f1_packets

from .. import sio_app


def telemetry_emitter():

    logger.info("Started telemetry_emitter")

    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    udp_socket.bind(("", 20777))

    while True:

        # Receive the packet
        udp_packet = udp_socket.recv(2048)

        # Parse the packet
        unpacked_packet = f1_packets.unpack_udp_packet(udp_packet)

        eventlet.spawn(parse_and_emit, unpacked_packet)


def parse_and_emit(unpacked_packet):

    parsed_packet, packet_type = parse_packet(unpacked_packet)

    if packet_type is None:
        # The packet was one we didn't care about
        return

    # Emit it!
    sio_app.emit(
        packet_type,
        parsed_packet,
    )

    logger.debug("Emitted type={} packet={}", packet_type, parsed_packet)


def parse_packet(unpacked_packet: f1_packets.PackedLittleEndianStructure):

    player_car_idx = unpacked_packet.header.playerCarIndex

    # Handle player_car_telemetry
    if type(unpacked_packet) is f1_packets.PacketCarTelemetryData_V1:

        player_car_telemetry = parse_packet_to_dict(
            unpacked_packet.carTelemetryData[player_car_idx]
        )

        return player_car_telemetry, "player_car_telemetry"

    # Handle car_motion_data
    if type(unpacked_packet) is f1_packets.PacketMotionData_V1:

        motion_data = {}

        motion_data["player_motion"] = parse_packet_to_dict(
            unpacked_packet.carMotionData[player_car_idx]
        )

        motion_data["npc_motion"] = parse_ncp_motion(
            unpacked_packet.carMotionData, player_car_idx
        )

        return motion_data, "motion_data"

    return None, None


def parse_packet_to_dict(packet: f1_packets.PackedLittleEndianStructure):

    parsed_packet = {}

    # Iterate through all the fields
    for field in packet._fields_:

        field_name_str = field[0]

        # Get the value for the field
        field_value = getattr(packet, field_name_str)

        # If the value is an Array...
        if isinstance(field_value, f1_packets.ctypes.Array):

            all_values = []

            for value in field_value:
                all_values.append(value)

            field_value = all_values

        parsed_packet[field_name_str] = field_value

    return parsed_packet


def parse_ncp_motion(car_motion_data_v1: f1_packets.CarMotionData_V1, player_car_idx):

    npc_motion = []

    idx = 0

    for car_motion in car_motion_data_v1:

        # We only care about the motion data for the NPCs
        if idx == player_car_idx:
            continue

        motion_data = {}
        motion_data["worldPositionX"] = car_motion.worldPositionX
        motion_data["worldPositionY"] = car_motion.worldPositionY
        motion_data["worldPositionZ"] = car_motion.worldPositionZ

        npc_motion.append(motion_data)

        idx += 1

    return npc_motion