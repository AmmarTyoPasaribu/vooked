from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from ..config import Session
from ..models import User
from ..auth import generate_token

user_bp = Blueprint('user', __name__)


@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(
        nama=data['nama'],
        email=data['email'],
        nomor_telepon=data['nomor_telepon'],
        alamat=data['alamat'],
        password=hashed_password
    )
    session = Session()
    session.add(new_user)
    session.commit()
    return jsonify({'message': 'User created successfully!'}), 201


@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    session = Session()
    user = session.query(User).filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = generate_token(user.user_id)
        return jsonify({'token': token})
    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})
