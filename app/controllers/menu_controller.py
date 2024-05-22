from flask import Blueprint, request, jsonify
from ..config import Session
from ..services.menu_service import get_menu_by_restaurant
from ..auth import token_required

menu_bp = Blueprint('menu', __name__)


@menu_bp.route('/menu', methods=['GET'])
@token_required
def get_menu(current_user):
    session = Session()
    restaurant_id = request.args.get('restaurant_id')
    menu_items = get_menu_by_restaurant(session, restaurant_id)
    return jsonify([{
        'menu_id': item.menu_id,
        'restaurant_id': item.restaurant_id,
        'nama_menu': item.nama_menu,
        'deskripsi': item.deskripsi,
        'harga': item.harga
    } for item in menu_items])
