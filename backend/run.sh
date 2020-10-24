set -e

gunicorn --worker-class eventlet -w 1 src.server:flask_app
