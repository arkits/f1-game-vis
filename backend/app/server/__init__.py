from flask import Blueprint

blueprint = Blueprint('main', __name__)

from . import flask_routes, sio_events
