from flask import Blueprint, request, jsonify
from .config import Session
from .models import Table
from .models import Reservation
from .auth import token_required

table_bp = Blueprint('table', __name__)


@table_bp.route('/table', methods=['POST'])
@token_required
def add_table(current_user):
    data = request.get_json()
    session = Session()
    new_table = Table(
        restaurant_id=data['restaurant_id'],
        nomor_meja=data['nomor_meja'],
        kapasitas=data['kapasitas']
    )
    session.add(new_table)
    session.commit()
    session.close()
    return jsonify({'message': 'New table added!'})


@table_bp.route('/table/<int:table_id>', methods=['PUT'])
@token_required
def update_table(current_user, table_id):
    data = request.get_json()
    session = Session()
    table = session.query(Table).filter_by(table_id=table_id).first()
    if not table:
        session.close()
        return jsonify({'message': 'Table not found!'}), 404
    table.nomor_meja = data['nomor_meja']
    table.kapasitas = data['kapasitas']
    session.commit()
    session.close()
    return jsonify({'message': 'Table updated!'})


@table_bp.route('/table/<int:table_id>', methods=['DELETE'])
@token_required
def delete_table(current_user, table_id):
    session = Session()
    table = session.query(Table).filter_by(table_id=table_id).first()
    if not table:
        session.close()
        return jsonify({'message': 'Table not found!'}), 404
    session.delete(table)
    session.commit()
    session.close()
    return jsonify({'message': 'Table deleted!'})


@table_bp.route('/table/<int:table_id>', methods=['GET'])
@token_required
def get_table(current_user, table_id):
    session = Session()
    table = session.query(Table).filter_by(table_id=table_id).first()
    session.close()
    if not table:
        return jsonify({'message': 'Table not found!'}), 404
    return jsonify({
        'table_id': table.table_id,
        'restaurant_id': table.restaurant_id,
        'nomor_meja': table.nomor_meja,
        'kapasitas': table.kapasitas
    })


@table_bp.route('/tables', methods=['GET'])
@token_required
def get_tables(current_user):
    session = Session()
    tables = session.query(Table).all()
    session.close()
    return jsonify([{
        'table_id': table.table_id,
        'restaurant_id': table.restaurant_id,
        'nomor_meja': table.nomor_meja,
        'kapasitas': table.kapasitas
    } for table in tables])


@table_bp.route('/tableresto/<int:restaurant_id>', methods=['GET'])
@token_required
def get_tables_by_restaurant(current_user, restaurant_id):
    session = Session()
    tables = session.query(Table).filter_by(restaurant_id=restaurant_id).all()
    session.close()
    return jsonify([{
        'table_id': table.table_id,
        'restaurant_id': table.restaurant_id,
        'nomor_meja': table.nomor_meja,
        'kapasitas': table.kapasitas
    } for table in tables])


@table_bp.route('/table/<int:restaurant_id>/<int:table_id>', methods=['GET'])
@token_required
def get_table_detail(current_user, restaurant_id, table_id):
    session = Session()
    table = session.query(Table).filter_by(restaurant_id=restaurant_id, table_id=table_id).first()
    session.close()
    return jsonify({
        'table_id': table.table_id,
        'restaurant_id': table.restaurant_id,
        'nomor_meja': table.nomor_meja,
        'kapasitas': table.kapasitas
    })


@table_bp.route('tablestatus/<int:restaurant_id>/<int:table_id>', methods=['GET'])
@token_required
def get_table_status(current_user, restaurant_id, table_id):
    session = Session()
    table = session.query(Reservation).filter_by(restaurant_id=restaurant_id, table_id=table_id).all()
    print(table)
    session.close()
    if len(table) == 0:
        return '0'
    else:
        return '1'
