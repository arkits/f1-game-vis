import eventlet
from flask import Flask
from flask_socketio import SocketIO

# Need to monkey patch eventlet because of issues when emitting from a background thread
eventlet.monkey_patch()

sio_app = SocketIO()


def create_app(debug=False):

    # Create the Flask app
    flask_app = Flask(__name__)
    flask_app.debug = debug

    # Import and register the blueprint/routes
    from .server import blueprint
    flask_app.register_blueprint(blueprint)

    sio_app.init_app(flask_app)

    return flask_app
