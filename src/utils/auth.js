import api from './api';

export const login = async (username, password) => {
  const response = await api.post('v1/auth/login', { username, password });
  const { userId, jwt, userName, email, address, mobileNo, role } = response.data;
  localStorage.setItem('jwt', jwt);
  localStorage.setItem('user', JSON.stringify({ userId,userName, email, address, mobileNo, role}));
};

export const logout = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.userId;
};

export const getRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role;
};
