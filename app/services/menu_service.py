from sqlalchemy.orm import Session
from ..models import Menu


def get_menu_by_restaurant(session: Session, restaurant_id: int):
    return session.query(Menu).filter_by(restaurant_id=restaurant_id).all()
