from flask import Blueprint, request, jsonify
from .config import Session
from .models import User
from .auth import token_required

user_bp = Blueprint('user', __name__)


@user_bp.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
    session = Session()
    user = session.query(User).filter_by(user_id=current_user.user_id).first()
    session.close()
    if not user:
        return jsonify({'message': 'User not found!'}), 404
    user_data = {
        'user_id': user.user_id,
        'name': user.nama,
        'email': user.email,
        'phone': user.nomor_telepon,
        'address': user.alamat,
        'role': user.role
    }
    print(user_data)
    return jsonify({'user': user_data})


@user_bp.route('/user', methods=['PUT'])
@token_required
def update_user(current_user):
    data = request.get_json()
    session = Session()
    user = session.query(User).filter_by(user_id=current_user.user_id).first()
    if not user:
        session.close()
        return jsonify({'message': 'User not found!'}), 404
    user.nama = data.get('name', user.nama)
    user.email = data.get('email', user.email)
    user.nomor_telepon = data.get('phone', user.nomor_telepon)
    user.alamat = data.get('address', user.alamat)
    user.role = data.get('role', user.role)
    session.commit()
    session.close()
    return jsonify({'message': 'User updated!'})
