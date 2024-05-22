from sqlalchemy.orm import Session
from ..models import User


def get_user_by_id(session: Session, user_id: int):
    return session.query(User).filter_by(user_id=user_id).first()
