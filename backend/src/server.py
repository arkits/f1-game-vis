from flask import Flask
from flask_socketio import SocketIO
import configparser

# Parse the config
config = configparser.ConfigParser()
config.read("config.ini")

# Init Flask and SIO
flask_app = Flask(__name__)
sio_app = SocketIO(flask_app, async_mode=config["SERVER"]["ASYNC_MODE"])

# Import the routes
from src.routes import flask_routes
from src.routes import sio_routes