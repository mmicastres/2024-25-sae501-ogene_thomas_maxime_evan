import React, { createContext, useContext, useState, useEffect } from 'react';
import { Http } from '@capacitor-community/http';

const apiUrl = 'http://cerqueira.alwaysdata.net/edtia-api/api';

const AuthContext = createContext({
  user: null,
  isLoading: true,
  errorEmail: null,
  errorPassword: null,
  login: async (email, password) => {},
  logout: async () => {},
  signup: async (userData) => {},
});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);



  useEffect(() => {
    console.log(user);
  }, [user]);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setErrorEmail(null);
      setErrorPassword(null);

      const response = await Http.post({
        url: `${apiUrl}/auth/login`,
        headers: { 'Content-Type': 'application/json' },
        data: { email, password }
      });
      const { data } = response;
      console.log("Login successful", data);
      
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      if (error.error?.error) {
        const errorType = error.error.error.type;
        const errorMessage = error.error.error.message;

        if (errorType === 'email') {
          setErrorEmail(errorMessage);
          setErrorPassword(null);
        } else if (errorType === 'password') {
          setErrorPassword(errorMessage);
          setErrorEmail(null);
        }
      } else {
        const generalErrorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        console.log("Erreur de connexion:", generalErrorMessage);
        setErrorEmail(generalErrorMessage);
        setErrorPassword(generalErrorMessage);
      }
    }
  };

  const signup = async ({ email, password }) => {
    try {
      console.log('Tentative d\'inscription avec:', { email, password });
      console.log('URL:', `${apiUrl}/auth/signup`);

      const response = await Http.post({
        url: `${apiUrl}/auth/signup`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          email,
          password
        }
      });
      
      const { data } = response;
      console.log('Réponse du serveur:', data);
      
      if (data) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      
      if (error.error?.message) {
        throw new Error(error.error.message);
      } else if (error.error?.error) {
        throw new Error(error.error.error);
      }
      throw new Error('Erreur lors de l\'inscription');
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur depuis AsyncStorage:', error);
    }
  };

  const loadUserFromStorage = () => {
    try {
      const userJSON = localStorage.getItem('user');
      if (userJSON) {
        setUser(JSON.parse(userJSON));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur depuis localStorage:', error);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, errorEmail, errorPassword, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);