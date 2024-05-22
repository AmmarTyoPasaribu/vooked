from flask import Blueprint, request, jsonify
from ..config import Session
from ..services.order_service import create_order
from ..auth import token_required

order_bp = Blueprint('order', __name__)


@order_bp.route('/orders', methods=['POST'])
@token_required
def add_order(current_user):
    session = Session()
    data = request.get_json()
    new_order = create_order(
        session=session,
        user_id=current_user,
        restaurant_id=data['restaurant_id'],
        items=data['items'],
        total_harga=data['total_harga']
    )
    return jsonify({'order_id': new_order.order_id}), 201
