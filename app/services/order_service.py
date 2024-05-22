from sqlalchemy.orm import Session
from ..models import Order


def create_order(session: Session, user_id: int, restaurant_id: int, items: str, total_harga: float):
    order = Order(
        user_id=user_id,
        restaurant_id=restaurant_id,
        items=items,
        total_harga=total_harga,
        status='diproses'
    )
    session.add(order)
    session.commit()
    return order
