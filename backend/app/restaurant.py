from flask import Blueprint, request, jsonify
from .config import Session
from .models import Restaurant, User
from .auth import token_required

restaurant_bp = Blueprint('restaurant', __name__)

@restaurant_bp.route('/restaurant', methods=['POST'])
@token_required
def add_restaurant(current_user):
    data = request.get_json()
    session = Session()
    new_restaurant = Restaurant(
        user_id=current_user.user_id,
        jam_operasional=data['jam_operasional']
    )
    session.add(new_restaurant)
    session.commit()
    session.close()
    return jsonify({'message': 'New restaurant added!'})

@restaurant_bp.route('/restaurant/<int:restaurant_id>', methods=['PUT'])
@token_required
def update_restaurant(current_user, restaurant_id):
    data = request.get_json()
    session = Session()
    restaurant = session.query(Restaurant).filter_by(restaurant_id=restaurant_id).first()
    if not restaurant:
        session.close()
        return jsonify({'message': 'Restaurant not found!'}), 404
    if restaurant.user_id != current_user.user_id:
        session.close()
        return jsonify({'message': 'Unauthorized to update this restaurant!'}), 403
    restaurant.jam_operasional = data['jam_operasional']
    session.commit()
    session.close()
    return jsonify({'message': 'Restaurant updated!'})

@restaurant_bp.route('/restaurant/<int:restaurant_id>', methods=['DELETE'])
@token_required
def delete_restaurant(current_user, restaurant_id):
    session = Session()
    restaurant = session.query(Restaurant).filter_by(restaurant_id=restaurant_id).first()
    if not restaurant:
        session.close()
        return jsonify({'message': 'Restaurant not found!'}), 404
    if restaurant.user_id != current_user.user_id:
        session.close()
        return jsonify({'message': 'Unauthorized to delete this restaurant!'}), 403
    session.delete(restaurant)
    session.commit()
    session.close()
    return jsonify({'message': 'Restaurant deleted!'})

@restaurant_bp.route('/restaurant', methods=['GET'])
def get_restaurants():
    session = Session()
    restaurants = session.query(Restaurant).all()
    result = [{
        'restaurant_id': res.restaurant_id,
        'nama_restoran': res.user.nama,
        'alamat': res.user.alamat,
        'nomor_telepon': res.user.nomor_telepon,
        'jam_operasional': res.jam_operasional
    } for res in restaurants]
    session.close()
    return jsonify(result)

@restaurant_bp.route('/restaurant/<int:user_id>', methods=['GET'])
def get_restaurant(user_id):
    session = Session()
    res= session.query(Restaurant).filter_by(user_id=user_id).first()
    result = {
        'restaurant_id': res.restaurant_id,
        'nama_restoran': res.user.nama,
        'alamat': res.user.alamat,
        'nomor_telepon': res.user.nomor_telepon,
        'jam_operasional': res.jam_operasional
    }
    session.close()
    return jsonify(result)
