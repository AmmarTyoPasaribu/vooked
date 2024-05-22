from flask import Flask
from .controllers.reservation_controller import reservation_bp
from .controllers.menu_controller import menu_bp
from .controllers.order_controller import order_bp
from .controllers.user_controller import user_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(reservation_bp, url_prefix='/api')
    app.register_blueprint(menu_bp, url_prefix='/api')
    app.register_blueprint(order_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    return app
