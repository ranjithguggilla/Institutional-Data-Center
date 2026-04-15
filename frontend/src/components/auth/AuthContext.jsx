import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE } from '../../apiBase';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {

  const [jwtToken, setjwtToken] = useState(() =>
      localStorage.getItem('jwtToken')
      ? JSON.parse(localStorage.getItem('jwtToken'))
      : null
    );

  const navigate = useNavigate();

  const DEFAULT_REQUEST_MS = 25000;

  const redirectUser = async (role, tokenOverride = null, requestTimeout = DEFAULT_REQUEST_MS) => {
    const tokenToUse = tokenOverride ?? jwtToken;
    if (!tokenToUse) return;
    try {
        const response = await axios.get(`${API_BASE}/user/get-user-object`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokenToUse
          },
          timeout: requestTimeout
        });
        const rawRole = response.data?.role;
        const userRole = (rawRole ?? '')
          .toString()
          .trim()
          .toUpperCase();
        const expected = role != null ? String(role).trim().toUpperCase() : null;

        if (!userRole) {
          toast.error(
            'Your account has no role in the database. Ask an administrator to set role to STUDENT, FACULTY, or ADMIN.'
          );
          logoutUser();
          return;
        }

        if (userRole === 'STUDENT') {
          if (expected === 'STUDENT') return null;
          navigate('/student');
        } else if (userRole === 'FACULTY') {
          if (expected === 'FACULTY') return null;
          navigate('/faculty');
        } else if (userRole === 'ADMIN') {
          if (expected === 'ADMIN') return null;
          navigate('/admin/student');
        } else {
          toast.error(
            `Unrecognized account role "${rawRole}". Ask an administrator to fix your account.`
          );
          logoutUser();
        }
      } catch (error) {
        const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes?.('timeout');
        const isNetwork = error.code === 'ERR_NETWORK' || !error.response;
        const status = error.response?.status;
        const detail =
          typeof error.response?.data === 'string'
            ? error.response.data.slice(0, 120)
            : null;

        let msg;
        if (status === 502 || status === 503 || status === 504) {
          msg = 'The API server appears to be down (proxy returned ' + status + '). Start Spring Boot on port 9000 and try again.';
        } else if (isTimeout) {
          msg = 'Session verification timed out. The server may be overloaded or starting up — try again in a moment.';
        } else if (status === 401) {
          msg = 'Session was rejected by the server (401). Try logging in again; if it persists, restart the API or check the database user role.';
        } else if (status === 500 && detail) {
          msg = `Server error: ${detail}`;
        } else if (isNetwork) {
          if (!navigator.onLine) {
            msg = 'You appear to be offline. Check your internet connection and try again.';
          } else if (API_BASE === '/api') {
            msg = 'Cannot reach the API server. Make sure Spring Boot is running on port 9000 (Vite proxies /api → http://127.0.0.1:9000).';
          } else {
            msg = `Cannot reach ${API_BASE}. Start Spring Boot or check VITE_API_BASE_URL.`;
          }
        } else {
          msg = 'Could not verify your session after login. Please try again.';
        }
        toast.error(msg);
        logoutUser();
      }
  };

  const loginUser = async (e, setSubmitting) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await axios.post(
        `${API_BASE}/auth/login`,
        {
          email: e.target.username.value.trim(),
          password: e.target.password.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: DEFAULT_REQUEST_MS,
        }
      );

      const data = response.data;

      if (response.status === 200) {
        if (!data?.jwtToken) {
          toast.error('Login succeeded but the server did not return a token.');
          return;
        }
        setjwtToken(data.jwtToken);
        localStorage.setItem('jwtToken', JSON.stringify(data.jwtToken));
        await redirectUser(null, data.jwtToken, DEFAULT_REQUEST_MS);
      }
    } catch (error) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes?.('timeout');
      const isNetwork = error.code === 'ERR_NETWORK' || !error.response;
      const status = error.response?.status;

      if (status === 502 || status === 503 || status === 504) {
        toast.error(
          'The API server appears to be down (proxy returned ' + status + '). ' +
          'Start Spring Boot on port 9000 and try again.'
        );
      } else if (isTimeout) {
        toast.error(
          'Login request timed out. The server may be overloaded or starting up — try again in a moment.'
        );
      } else if (isNetwork) {
        if (!navigator.onLine) {
          toast.error('You appear to be offline. Check your internet connection and try again.');
        } else if (API_BASE === '/api') {
          toast.error(
            'Cannot reach the API server. Make sure Spring Boot is running on port 9000 ' +
            '(Vite proxies /api → http://127.0.0.1:9000).'
          );
        } else {
          toast.error(`Cannot reach ${API_BASE}. Start Spring Boot or check VITE_API_BASE_URL.`);
        }
      } else {
        toast.error('Username or Password is Incorrect!');
      }
      e.target.username.value = "";
      e.target.password.value = "";
    } finally {
      setSubmitting(false);
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
