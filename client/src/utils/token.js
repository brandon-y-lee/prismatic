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
};

export const setAccessToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
}

export const removeAccessToken = () => {
  localStorage.removeItem('accessToken');
};

export const setLocalRequisitionId = (requisitionId) => {
  localStorage.setItem('requisitionId', requisitionId);
};

export const getLocalRequisitionId = () => {
  return localStorage.getItem('requisitionId');
}

export const removeLocalRequisitionId = () => {
  localStorage.removeItem('requisitionId');
};

