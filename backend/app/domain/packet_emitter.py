import socket
from loguru import logger
from f1_2020_telemetry.packets import unpack_udp_packet, PacketCarTelemetryData_V1
from .. import sio_app


def telemetry_emitter():

    logger.info("Started telemetry_emitter")

    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    udp_socket.bind(("", 20777))

    while True:

        # Receive the packet
        udp_packet = udp_socket.recv(2048)

        # Parse the packet
        unpacked_packet = unpack_udp_packet(udp_packet)

        if type(unpacked_packet) is PacketCarTelemetryData_V1:

            speed = unpacked_packet.carTelemetryData[0].speed

            # Emit it!
            sio_app.emit(
                "telemetry",
                {"speed": speed},
            )
