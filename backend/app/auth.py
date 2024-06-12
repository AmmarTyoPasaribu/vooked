from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from .config import Session
from .models import User

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = "super_secret"


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            session = Session()
            current_user = session.query(User).filter_by(user_id=data['user_id']).first()
            session.close()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)

    return decorated


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    session = Session()
    new_user = User(
        nama=data['name'],
        email=data['email'],
        nomor_telepon=data['phone'],
        alamat=data['address'],
        password=hashed_password
    )
    session.add(new_user)
    session.commit()
    session.close()
    return jsonify({'message': 'New user created!'})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    session = Session()
    user = session.query(User).filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        session.close()
        return jsonify({'message': 'Login failed!'}), 401
    token = jwt.encode({'user_id': user.user_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
                       SECRET_KEY, algorithm="HS256")
    session.close()
    print(token)
    return jsonify({'token': token})