// src/App.tsx
import { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardManager } from './components/DashboardManager';
import type { UserData } from './Types';

function App() {
  // Pastikan generic type ini ada agar setUser bisa menerima objek
  const [user, setUser] = useState<UserData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      try {
        const data = JSON.parse(savedUser);
        
        // Type Guard: Pastikan data hasil parse punya properti dari UserData
        if (data && typeof data === 'object' && 'username' in data) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(data as UserData);
        }
      } catch (e) {
        console.error("Format user_data di localStorage rusak:", e);
        localStorage.removeItem('user_data');
      }
    }
    setIsInitialized(true);
  }, []);

  const handleLoginSuccess = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
  };

  if (!isInitialized) return null;

  return (
    <div className="App">
      {!user ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DashboardManager user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;