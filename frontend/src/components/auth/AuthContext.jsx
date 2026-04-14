import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

  const [jwtToken, setjwtToken] = useState(() =>
      localStorage.getItem('jwtToken')
      ? JSON.parse(localStorage.getItem('jwtToken'))
      : null
    );

  const navigate = useNavigate();

  const redirectUser = async (role, tokenOverride = null) => {
    const tokenToUse = tokenOverride ?? jwtToken;
    if (!tokenToUse) return;
    try {
        const response = await axios.get(`${API_BASE}/user/get-user-object`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokenToUse
          }
        });
        if(response.data.role === "STUDENT"){
            if(role === response.data.role) return null;
            navigate("/student");
        }
        else if(response.data.role === "FACULTY"){
            if(role === response.data.role) return null;
            navigate("/faculty");
        }
        else if(response.data.role === "ADMIN"){
            if(role === response.data.role) return null;
            navigate("/admin/student");
        }
      } catch (error) {
        logoutUser();
        navigate('/login');
      }
  };

  const loginUser = async (e, setLoading) => {
    e.preventDefault();
    try {
      setLoading(false);
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        {
          email: e.target.username.value,
          password: e.target.password.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (response.status === 200) {
        setjwtToken(data.jwtToken);
        localStorage.setItem('jwtToken', JSON.stringify(data.jwtToken));
        await redirectUser(null, data.jwtToken);
      }
    } catch (error) {
      toast.error("Username or Password is Incorrect!");
      e.target.username.value = "";
      e.target.password.value = "";
    } finally {
      setLoading(true);
    }
  };

   const logoutUser = async () => {
        setjwtToken(null);
        localStorage.removeItem('jwtToken');
        navigate('/login');
   };

  const contextData = {
    loginUser,
    jwtToken,
    setjwtToken,
    logoutUser,
    redirectUser
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
