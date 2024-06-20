from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from .config import Session
from .models import User, Restaurant

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
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token is expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        return f(current_user, *args, **kwargs)

    return decorated


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    session = Session()
    new_user = User(
        nama=data['name'],
        email=data['email'],
        nomor_telepon=data['phone'],
        alamat=data['address'],
        password=hashed_password,
        role=data['role']
    )
    try:
        session.add(new_user)
        session.commit()
        # Create a restaurant for the new admin user
        if new_user.role == 'admin':
            new_restaurant = Restaurant(
                user_id=new_user.user_id,
                jam_operasional=data['jam_operasional']
            )
            session.add(new_restaurant)
            session.commit()

        session.close()
        return jsonify({'message': 'New user created!'})
    except Exception as e:
        session.rollback()
        return jsonify({'message': f'Error: {str(e)}'}), 500
    finally:
        session.close()


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
    return jsonify({'token': token.decode('utf-8')})


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    session.pop('user_id', None)  # Hapus user_id dari session
    return jsonify({'message': 'Successfully logged out.'}), 200
