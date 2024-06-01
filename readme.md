# Dokumentasi

## 1. Register User
- **Endpoint:** `POST /api/register`
- **Deskripsi:** Mendaftarkan pengguna baru.
- **Body:**
    ```json
    {
        "nama": "John Doe",
        "email": "john.doe@example.com",
        "nomor_telepon": "123456789",
        "alamat": "123 Street Name",
        "password": "password123"
    }
    ```
- **Respon:**
    ```json
    {
        "message": "New user created!"
    }
    ```

## 2. Login User
- **Endpoint:** `POST /api/login`
- **Deskripsi:** Login pengguna dan mendapatkan token JWT.
- **Body:**
    ```json
    {
        "email": "john.doe@example.com",
        "password": "password123"
    }
    ```
- **Respon:**
    ```json
    {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
    ```

## 3. Tambah Restoran
- **Endpoint:** `POST /api/restaurant`
- **Deskripsi:** Menambahkan restoran baru.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Body:**
    ```json
    {
        "nama_restoran": "Restoran ABC",
        "alamat": "456 Another Street",
        "nomor_telepon": "987654321",
        "jam_operasional": "09:00 - 21:00"
    }
    ```
- **Respon:**
    ```json
    {
        "message": "New restaurant added!"
    }
    ```

## 4. Lihat Semua Restoran
- **Endpoint:** `GET /api/restaurants`
- **Deskripsi:** Mendapatkan daftar semua restoran.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Respon:**
    ```json
    [
        {
            "restaurant_id": 1,
            "nama_restoran": "Restoran ABC",
            "alamat": "456 Another Street",
            "nomor_telepon": "987654321",
            "jam_operasional": "09:00 - 21:00"
        }
    ]
    ```

## 5. Tambah Meja
- **Endpoint:** `POST /api/table`
- **Deskripsi:** Menambahkan meja baru ke restoran.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Body:**
    ```json
    {
        "restaurant_id": 1,
        "nomor_meja": 5,
        "kapasitas": 4
    }
    ```
- **Respon:**
    ```json
    {
        "message": "New table added!"
    }
    ```

## 6. Lihat Semua Meja
- **Endpoint:** `GET /api/tables`
- **Deskripsi:** Mendapatkan daftar semua meja.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Respon:**
    ```json
    [
        {
            "table_id": 1,
            "restaurant_id": 1,
            "nomor_meja": 5,
            "kapasitas": 4
        }
    ]
    ```

## 7. Tambah Menu
- **Endpoint:** `POST /api/menu`
- **Deskripsi:** Menambahkan item menu baru ke restoran.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Body:**
    ```json
    {
        "restaurant_id": 1,
        "nama_menu": "Nasi Goreng",
        "deskripsi": "Nasi goreng dengan telur dan ayam",
        "harga": 25000
    }
    ```
- **Respon:**
    ```json
    {
        "message": "New menu item added!"
    }
    ```

## 8. Lihat Menu Restoran
- **Endpoint:** `GET /api/menu`
- **Deskripsi:** Mendapatkan daftar menu dari restoran tertentu.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Query Params:** `restaurant_id=1`
- **Respon:**
    ```json
    [
        {
            "menu_id": 1,
            "restaurant_id": 1,
            "nama_menu": "Nasi Goreng",
            "deskripsi": "Nasi goreng dengan telur dan ayam",
            "harga": 25000
        }
    ]
    ```

## 9. Reservasi Meja
- **Endpoint:** `POST /api/reservation`
- **Deskripsi:** Membuat reservasi meja.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Body:**
    ```json
    {
        "restaurant_id": 1,
        "table_id": 1,
        "tanggal_reservasi": "2024-06-15",
        "waktu_reservasi": "19:00:00",
        "jumlah_orang": 2
    }
    ```
- **Respon:**
    ```json
    {
        "message": "Reservation made!"
    }
    ```

## 10. Lihat Reservasi
- **Endpoint:** `GET /api/reservation`
- **Deskripsi:** Mendapatkan daftar reservasi pengguna saat ini.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Respon:**
    ```json
    [
        {
            "reservation_id": 1,
            "restaurant_id": 1,
            "table_id": 1,
            "tanggal_reservasi": "2024-06-15",
            "waktu_reservasi": "19:00:00",
            "jumlah_orang": 2
        }
    ]
    ```

## 11. Hapus Reservasi
- **Endpoint:** `DELETE /api/reservation/<reservation_id>`
- **Deskripsi:** Menghapus reservasi tertentu.
- **Headers:** 
  - `x-access-token`: `your_jwt_token`
- **Respon:**
    ```json
    {
        "message": "Reservation deleted!"
    }
    ```

### Penggunaan Token JWT
- Setiap endpoint yang membutuhkan otentikasi dilindungi oleh `token_required`.
- Token JWT harus disertakan dalam header request sebagai `x-access-token`.

### Contoh Penggunaan di Postman
1. **Register:** 
   - Pilih metode `POST`.
   - Masukkan URL `http://localhost:5000/api/register`.
   - Pada tab Body, pilih raw dan masukkan JSON body seperti pada dokumentasi.

2. **Login:** 
   - Pilih metode `POST`.
   - Masukkan URL `http://localhost:5000/api/login`.
   - Pada tab Body, pilih raw
