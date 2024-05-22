from datetime import datetime
from sqlalchemy.orm import Session
from ..models import Reservation, Table


def create_reservation(session: Session, user_id: int, restaurant_id: int, table_id: int, tanggal_reservasi: datetime,
                       waktu_reservasi: datetime, jumlah_orang: int):
    reservation = Reservation(
        user_id=user_id,
        restaurant_id=restaurant_id,
        table_id=table_id,
        tanggal_reservasi=tanggal_reservasi,
        waktu_reservasi=waktu_reservasi,
        jumlah_orang=jumlah_orang,
        status='menunggu'
    )
    session.add(reservation)
    session.commit()
    return reservation


def get_available_tables(session: Session, restaurant_id: int):
    return session.query(Table).filter_by(restaurant_id=restaurant_id, status='tersedia').all()


def get_reservations(session: Session):
    return session.query(Reservation).all()
