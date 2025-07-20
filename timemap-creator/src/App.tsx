import React, { useEffect, useState } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/Chat/ChatWidget';
import { useAuthStore } from './store/authStore';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, setUser } = useAuthStore();
  const [showDashboard, setShowDashboard] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setShowDashboard(true); // Show dashboard on login
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  if (!user) {
    return <Login />;
  }

  if (showDashboard) {
    return (
      <>
        <Dashboard onLoadTimemap={() => setShowDashboard(false)} />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <Toolbar />
        <Canvas />
      </div>
      <ChatWidget />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
