from app.routes import create_app
from app.config import Base, engine

Base.metadata.create_all(engine)

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
