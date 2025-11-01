import React from 'react';
import { LogoIcon, TwitterIcon, GithubIcon, InstagramIcon } from '../constants';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-plant-gray hover:text-white transition-colors">{children}</a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-plant-dark text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <LogoIcon className="h-8 w-8 text-plant-green" />
              <span className="text-2xl font-bold">Plant Pal</span>
            </div>
            <p className="text-plant-gray max-w-xs">Your personal plant care companion powered by AI.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><FooterLink href="#features">Features</FooterLink></li>
              <li><FooterLink href="#pricing">Pricing</FooterLink></li>
              <li><FooterLink href="#">FAQ</FooterLink></li>
              <li><FooterLink href="#">Roadmap</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><FooterLink href="#about">About</FooterLink></li>
              <li><FooterLink href="#">Blog</FooterLink></li>
              <li><FooterLink href="#">Careers</FooterLink></li>
              <li><FooterLink href="#">Contact</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><FooterLink href="#">Privacy</FooterLink></li>
              <li><FooterLink href="#">Terms</FooterLink></li>
              <li><FooterLink href="#">Security</FooterLink></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-plant-gray-dark">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-plant-gray text-sm mb-4 md:mb-0">&copy; 2024 Plant Pal. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-plant-gray hover:text-white"><TwitterIcon className="h-6 w-6" /></a>
            <a href="#" className="text-plant-gray hover:text-white"><GithubIcon className="h-6 w-6" /></a>
            <a href="#" className="text-plant-gray hover:text-white"><InstagramIcon className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;