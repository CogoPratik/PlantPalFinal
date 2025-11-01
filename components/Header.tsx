import React from 'react';
import { LogoIcon } from '../constants';

interface HeaderProps {
  onAuthClick: (mode: 'signin' | 'signup') => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick, isLoggedIn, onLogout }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <LogoIcon className="h-8 w-8 text-plant-green" />
          <span className="text-2xl font-bold text-plant-dark">Plant Pal</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-plant-gray-dark hover:text-plant-green transition-colors">Features</a>
          <a href="#pricing" className="text-plant-gray-dark hover:text-plant-green transition-colors">Pricing</a>
          <a href="#about" className="text-plant-gray-dark hover:text-plant-green transition-colors">About</a>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <button className="bg-plant-green text-white font-medium px-4 py-2 rounded-lg hover:bg-plant-green-dark transition-colors shadow-md">Dashboard</button>
              <button onClick={onLogout} className="text-plant-dark font-medium hover:text-plant-green transition-colors">Log Out</button>
            </>
          ) : (
            <>
              <button onClick={() => onAuthClick('signin')} className="text-plant-dark font-medium hover:text-plant-green transition-colors">Sign In</button>
              <button onClick={() => onAuthClick('signup')} className="bg-plant-green text-white font-medium px-4 py-2 rounded-lg hover:bg-plant-green-dark transition-colors shadow-md">Get Started</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;