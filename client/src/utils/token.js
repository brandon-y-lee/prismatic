export const setToken = (token) => {
  localStorage.setItem('token', JSON.stringify(token));
};

export const getToken = () => {
  try {
    const tokenString = localStorage.getItem('token');
    return tokenString ? JSON.parse(tokenString) : null;
  } catch (error) {
    console.error("Error parsing token from localStorage:", error);
    return null;
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const setLoggedInUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getLoggedInUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeLoggedInUser = () => {
  localStorage.removeItem('user');
}