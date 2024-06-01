from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .config import Base


class User(Base):
    __tablename__ = 'user'
    user_id = Column(Integer, primary_key=True)
    nama = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    nomor_telepon = Column(String(15), nullable=False)
    alamat = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)

    reservations = relationship('Reservation', back_populates='user')


class Restaurant(Base):
    __tablename__ = 'restaurant'
    restaurant_id = Column(Integer, primary_key=True)
    nama_restoran = Column(String(100), nullable=False)
    alamat = Column(String(255), nullable=False)
    nomor_telepon = Column(String(15), nullable=False)
    jam_operasional = Column(String(50), nullable=False)

    tables = relationship('Table', back_populates='restaurant')
    menus = relationship('Menu', back_populates='restaurant')
    reservations = relationship('Reservation', back_populates='restaurant')


class Table(Base):
    __tablename__ = 'table'
    table_id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey('restaurant.restaurant_id'), nullable=False)
    nomor_meja = Column(Integer, nullable=False)
    kapasitas = Column(Integer, nullable=False)

    restaurant = relationship('Restaurant', back_populates='tables')
    reservations = relationship('Reservation', back_populates='table')


class Reservation(Base):
    __tablename__ = 'reservation'
    reservation_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    restaurant_id = Column(Integer, ForeignKey('restaurant.restaurant_id'), nullable=False)
    table_id = Column(Integer, ForeignKey('table.table_id'), nullable=False)
    tanggal_reservasi = Column(DateTime, nullable=False)
    waktu_reservasi = Column(DateTime, nullable=False)
    jumlah_orang = Column(Integer, nullable=False)

    user = relationship('User', back_populates='reservations')
    restaurant = relationship('Restaurant', back_populates='reservations')
    table = relationship('Table', back_populates='reservations')


class Menu(Base):
    __tablename__ = 'menu'
    menu_id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey('restaurant.restaurant_id'), nullable=False)
    nama_menu = Column(String(100), nullable=False)
    deskripsi = Column(String(255), nullable=False)
    harga = Column(Integer, nullable=False)

    restaurant = relationship('Restaurant', back_populates='menus')
