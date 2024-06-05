from flask import Blueprint, request, jsonify
from .config import Session
from .models import Restaurant
from .auth import token_required

restaurant_bp = Blueprint('restaurant', __name__)


@restaurant_bp.route('/restaurant', methods=['POST'])
@token_required
def add_restaurant(current_user):
    data = request.get_json()
    session = Session()
    new_restaurant = Restaurant(
        nama_restoran=data['nama_restoran'],
        alamat=data['alamat'],
        nomor_telepon=data['nomor_telepon'],
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
    restaurant.nama_restoran = data['nama_restoran']
    restaurant.alamat = data['alamat']
    restaurant.nomor_telepon = data['nomor_telepon']
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
    session.delete(restaurant)
    session.commit()
    session.close()
    return jsonify({'message': 'Restaurant deleted!'})


@restaurant_bp.route('/restaurant', methods=['GET'])
@token_required
def get_restaurants(curent_user):
    session = Session()
    restaurants = session.query(Restaurant).all()
    result = [{
        'restaurant_id': res.restaurant_id,
        'nama_restoran': res.nama_restoran,
        'alamat': res.alamat,
        'nomor_telepon': res.nomor_telepon,
        'jam_operasional': res.jam_operasional
    } for res in restaurants]
    session.close()
    return jsonify(result)
