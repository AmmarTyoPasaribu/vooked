from flask import Flask
from .config import engine, Base
from .auth import auth_bp
from .menu import menu_bp
from .reservation import reservation_bp
from .restaurant import restaurant_bp
from .table import table_bp
from .user import user_bp

from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(menu_bp, url_prefix='/api')
    app.register_blueprint(reservation_bp, url_prefix='/api')
    app.register_blueprint(restaurant_bp, url_prefix='/api')
    app.register_blueprint(table_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')

    # Create tables
    Base.metadata.create_all(engine)

    return app
