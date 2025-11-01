import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsBanner from './components/StatsBanner';
import Features from './components/Features';
import ExpertRecs from './components/ExpertRecs';
import PlantId from './components/PlantId';
import Testimonials from './components/Testimonials';
import TrustBadges from './components/TrustBadges';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AuthModal from './components/SignInModal';
import Dashboard from './components/Dashboard';

interface User {
  id: string;
  email?: string;
  user_metadata: {
    fullname?: string;
  };
}

const App: React.FC = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for a token and user in localStorage on initial load
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const handleLoginSuccess = (token: string, loggedInUser: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setAuthToken(token);
    setUser(loggedInUser);
    closeAuthModal();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
  };

  if (authToken && user) {
    return <Dashboard onLogout={handleLogout} token={authToken} user={user} />;
  }

  return (
    <div className="bg-green-50 text-plant-dark">
      <Header onAuthClick={openAuthModal} isLoggedIn={!!authToken} onLogout={handleLogout} />
      <main>
        <Hero onSignUpClick={() => openAuthModal('signup')} />
        <StatsBanner />
        <Features />
        <ExpertRecs />
        <PlantId />
        <Testimonials />
        <TrustBadges />
        <Pricing onSignUpClick={() => openAuthModal('signup')}/>
        <CTA onSignUpClick={() => openAuthModal('signup')}/>
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} initialMode={authModalMode} onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default App;