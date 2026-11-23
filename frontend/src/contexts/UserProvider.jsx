import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

import { UserContext } from "./userContext";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        if (error.response?.status !== 401) setProfileError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    setProfileError(false);
    if (userData?.token) {
      localStorage.setItem('token', userData.token);
    }
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, profileError, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;