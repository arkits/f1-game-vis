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

    if type(unpacked_packet) is f1_packets.PacketCarTelemetryData_V1:

        car_telemetry = parse_car_telemetry_data(unpacked_packet.carTelemetryData[0])

        # Emit it!
        sio_app.emit(
            "telemetry",
            car_telemetry,
        )


def parse_car_telemetry_data(data: f1_packets.CarTelemetryData_V1):

    car_telemetry = {}

    # Iterate through all the fields
    for field_name in f1_packets.CarTelemetryData_V1._fields_:

        field_name_str = field_name[0]

        # Get the value for the field
        field_value = getattr(data, field_name_str)

        # If the value is an Array...
        if isinstance(field_value, f1_packets.ctypes.Array):

            all_values = []

            for value in field_value:
                all_values.append(value)

            field_value = all_values

        car_telemetry[field_name_str] = field_value

    return car_telemetry
