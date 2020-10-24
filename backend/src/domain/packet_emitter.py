import socket
from loguru import logger
from f1_2020_telemetry.packets import unpack_udp_packet
from src.server import sio_app


def telemetry_emitter():

    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    udp_socket.bind(("", 20777))

    packet_number = 0

    while True:

        # Receive the packet
        udp_packet = udp_socket.recv(2048)

        # Parse the packet
        unpacked_packet = unpack_udp_packet(udp_packet)
        logger.debug("[unpacked] number={} packet={}", packet_number, unpacked_packet)

        # Emit it!
        sio_app.emit(
            "telemetry",
            unpacked_packet,
        )

        packet_number += 1
