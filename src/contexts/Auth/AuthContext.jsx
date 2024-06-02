import { createClient } from '@supabase/supabase-js';
import { createContext, useState } from 'react';
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from '../../config/constants';

const initialValue = {
  isLoggedIn: false,
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
  handleSignIn: () => {}
};

export const AuthContext = createContext(initialValue);

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleSignIn(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      throw new Error(error);
    }

    setIsLoggedIn(true);
    setUser(data.user);
  }

  async function handleLogin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      throw new Error(error);
    }

    setIsLoggedIn(true);
    setUser(data.user);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error);
    }

    setIsLoggedIn(false);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, handleLogin, handleLogout, handleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}
