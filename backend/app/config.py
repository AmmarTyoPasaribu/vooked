from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

DATABASE_USER = os.getenv('DATABASE_USER', 'root')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', '')
DATABASE_HOST = os.getenv('DATABASE_HOST', 'localhost')
DATABASE_PORTS = [os.getenv('DATABASE_PORT', '3307'), '3306']
DATABASE_NAME = os.getenv('DATABASE_NAME', 'db_vooked')

def create_engine_with_fallback():
    for port in DATABASE_PORTS:
        try:
            DATABASE_URI = f'mysql+pymysql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{port}/{DATABASE_NAME}'
            engine = create_engine(DATABASE_URI)
            # Test connection
            connection = engine.connect()
            connection.close()
            return engine
        except Exception as e:
            print(f"Failed to connect to port {port}: {e}")
    raise Exception("Failed to connect to any specified ports")

engine = create_engine_with_fallback()
Session = sessionmaker(bind=engine)
Base = declarative_base()