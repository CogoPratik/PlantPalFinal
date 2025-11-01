import React, { useState } from 'react';
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

const App: React.FC = () => {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  // In a real app, this would receive a user/token from the backend
  const handleLoginSuccess = () => {
    // e.g., localStorage.setItem('userToken', token);
    setIsLoggedIn(true);
    closeAuthModal();
  };

  const handleLogout = () => {
    // e.g., localStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="bg-green-50 text-plant-dark">
      <Header onAuthClick={openAuthModal} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
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