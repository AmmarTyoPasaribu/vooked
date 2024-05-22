from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Text
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


# Definisi Tabel Restaurant
class Restaurant(Base):
    __tablename__ = 'restaurant'
    restaurant_id = Column(Integer, primary_key=True)
    nama_restoran = Column(String(100), nullable=False)
    alamat = Column(String(255), nullable=False)
    nomor_telepon = Column(String(15), nullable=False)
    jam_operasional = Column(String(50), nullable=False)


class Table(Base):
    __tablename__ = 'table'
    table_id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey('restaurant.restaurant_id'), nullable=False)
    nomor_meja = Column(Integer, nullable=False)
    kapasitas = Column(Integer, nullable=False)
    status = Column(String(10), nullable=False)  # 'tersedia' atau 'dipesan'

    restaurant = relationship('Restaurant', back_populates='tables')


class Reservation(Base):
    __tablename__ = 'reservation'
    reservation_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    restaurant_id = Column(Integer, ForeignKey('restaurant.restaurant_id'), nullable=False)
    table_id = Column(Integer, ForeignKey('table.table_id'), nullable=False)
    tanggal_reservasi = Column(DateTime, nullable=False)
    waktu_reservasi = Column(DateTime, nullable=False)
    jumlah_orang = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default='menunggu')  # 'menunggu', 'dikonfirmasi', 'dibatalkan'

    user = relationship('User', back_populates='reservations')
    restaurant = relationship('Restaurant', back_populates='reservations')
    table = relationship('Table', back_populates='reservations')


# Definisi Tabel Menu
class Menu(Base):
    __tablename__ = 'menu'
    menu_id = Column(Integer, primary_key=True)
    restaurant_id = Column(Integer, ForeignKey('restaurant.restaurant_id'), nullable=False)
    nama_menu = Column(String(100), nullable=False)
    deskripsi = Column(String(255), nullable=False)
    harga = Column(Float, nullable=False)

    restaurant = relationship('Restaurant', back_populates='menus')


# Definisi Tabel Order
class Order(Base):
    __tablename__ = 'order'
    order_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    restaurant_id = Column(Integer, ForeignKey('restaurant.restaurant_id'), nullable=False)
    items = Column(Text, nullable=False)  # Daftar item dalam format JSON
    status = Column(String(20), nullable=False, default='diproses')  # 'diproses', 'selesai', 'dibatalkan'
    total_harga = Column(Float, nullable=False)

    user = relationship('User', back_populates='orders')
    restaurant = relationship('Restaurant', back_populates='orders')


# Menambahkan hubungan back_populates untuk tabel yang relevan
User.reservations = relationship('Reservation', order_by=Reservation.reservation_id, back_populates='user')
User.orders = relationship('Order', order_by=Order.order_id, back_populates='user')
Restaurant.tables = relationship('Table', order_by=Table.table_id, back_populates='restaurant')
Restaurant.reservations = relationship('Reservation', order_by=Reservation.reservation_id, back_populates='restaurant')
Restaurant.menus = relationship('Menu', order_by=Menu.menu_id, back_populates='restaurant')
Restaurant.orders = relationship('Order', order_by=Order.order_id, back_populates='restaurant')
Table.reservations = relationship('Reservation', order_by=Reservation.reservation_id, back_populates='table')
