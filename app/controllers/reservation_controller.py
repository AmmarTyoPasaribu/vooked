from flask import Blueprint, request, jsonify
from ..config import Session
from ..services.reservation_service import create_reservation, get_reservations, get_available_tables
from ..auth import token_required

reservation_bp = Blueprint('reservation', __name__)


@reservation_bp.route('/reservations', methods=['POST'])
@token_required
def add_reservation(current_user):
    session = Session()
    data = request.get_json()
    new_reservation = create_reservation(
        session=session,
        user_id=current_user,
        restaurant_id=data['restaurant_id'],
        table_id=data['table_id'],
        tanggal_reservasi=data['tanggal_reservasi'],
        waktu_reservasi=data['waktu_reservasi'],
        jumlah_orang=data['jumlah_orang']
    )
    return jsonify({'reservation_id': new_reservation.reservation_id}), 201


@reservation_bp.route('/reservations', methods=['GET'])
@token_required
def list_reservations(current_user):
    session = Session()
    reservations = get_reservations(session)
    return jsonify([{
        'reservation_id': res.reservation_id,
        'user_id': res.user_id,
        'restaurant_id': res.restaurant_id,
        'table_id': res.table_id,
        'tanggal_reservasi': res.tanggal_reservasi.isoformat(),
        'waktu_reservasi': res.waktu_reservasi.isoformat(),
        'jumlah_orang': res.jumlah_orang,
        'status': res.status
    } for res in reservations])


@reservation_bp.route('/tables', methods=['GET'])
@token_required
def available_tables(current_user):
    session = Session()
    restaurant_id = request.args.get('restaurant_id')
    tables = get_available_tables(session, restaurant_id)
    return jsonify([{
        'table_id': table.table_id,
        'restaurant_id': table.restaurant_id,
        'nomor_meja': table.nomor_meja,
        'kapasitas': table.kapasitas,
        'status': table.status
    } for table in tables])
