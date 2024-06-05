from flask import Blueprint, request, jsonify
from .config import Session
from .models import Menu
from .auth import token_required

menu_bp = Blueprint('menu', __name__)


def get_menu_by_restaurant(session, restaurant_id):
    return session.query(Menu).filter_by(restaurant_id=restaurant_id).all()


@menu_bp.route('/menu', methods=['GET'])
@token_required
def get_menu(current_user):
    session = Session()
    restaurant_id = request.args.get('restaurant_id')
    menu_items = get_menu_by_restaurant(session, restaurant_id)
    session.close()
    return jsonify([{
        'menu_id': item.menu_id,
        'restaurant_id': item.restaurant_id,
        'nama_menu': item.nama_menu,
        'deskripsi': item.deskripsi,
        'harga': item.harga
    } for item in menu_items])


@menu_bp.route('/menu', methods=['POST'])
@token_required
def add_menu(current_user):
    data = request.get_json()
    session = Session()
    new_menu = Menu(
        restaurant_id=data['restaurant_id'],
        nama_menu=data['nama_menu'],
        deskripsi=data['deskripsi'],
        harga=data['harga']
    )
    session.add(new_menu)
    session.commit()
    session.close()
    return jsonify({'message': 'New menu item added!'})


@menu_bp.route('/menu/<int:menu_id>', methods=['PUT'])
@token_required
def update_menu(current_user, menu_id):
    data = request.get_json()
    session = Session()
    menu_item = session.query(Menu).filter_by(menu_id=menu_id).first()
    if not menu_item:
        session.close()
        return jsonify({'message': 'Menu item not found!'}), 404
    menu_item.nama_menu = data['nama_menu']
    menu_item.deskripsi = data['deskripsi']
    menu_item.harga = data['harga']
    session.commit()
    session.close()
    return jsonify({'message': 'Menu item updated!'})


@menu_bp.route('/menu/<int:menu_id>', methods=['DELETE'])
@token_required
def delete_menu(current_user, menu_id):
    session = Session()
    menu_item = session.query(Menu).filter_by(menu_id=menu_id).first()
    if not menu_item:
        session.close()
        return jsonify({'message': 'Menu item not found!'}), 404
    session.delete(menu_item)
    session.commit()
    session.close()
    return jsonify({'message': 'Menu item deleted!'})
