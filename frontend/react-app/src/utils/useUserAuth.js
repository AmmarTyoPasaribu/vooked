import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useUserAuth = () => {
  const [userRole, setUserRole] = useState(null); // State untuk menyimpan role pengguna
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/user', {
        headers: {
          'x-access-token': localStorage.getItem('jwtToken'),
        }
      });

      if (response.status === 200) {
        setUserRole(response.data.user.role); // Simpan role pengguna di state
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/signin');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/signin');
    } else {
      fetchUser(); // Panggil fetchUser jika token ada
    }
  }, [navigate]);

  useEffect(() => {
    if (userRole && userRole !== 'user') {
      navigate('/signin'); // Arahkan pengguna non-admin ke halaman unauthorized
    }
  }, [userRole, navigate]);
};

export default useUserAuth;
