import React from 'react';
import { CheckIcon } from '../constants';

interface PricingCardProps {
  planName: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  onButtonClick?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ planName, price, period = '/month', description, features, isPopular = false, buttonText, onButtonClick }) => (
  <div className={`border rounded-2xl p-8 flex flex-col ${isPopular ? 'border-plant-green border-2' : 'border-gray-200'} relative transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-plant-green text-white text-sm font-bold px-4 py-1 rounded-full">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-bold mb-2">{planName}</h3>
    <p className="text-plant-gray mb-6">{description}</p>
    <div className="mb-6">
      <span className="text-5xl font-extrabold">${price}</span>
      { price !== '0' && <span className="text-plant-gray">{period}</span>}
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <CheckIcon className="h-5 w-5 text-plant-green mr-3" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button onClick={onButtonClick} className={`w-full py-3 rounded-lg font-bold transition-colors ${isPopular ? 'bg-plant-green text-white hover:bg-plant-green-dark' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}>
      {buttonText}
    </button>
  </div>
);

interface PricingProps {
  onSignUpClick: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSignUpClick }) => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Choose Your Plan</h2>
          <p className="text-lg text-plant-gray mt-4">Start free, upgrade when you are ready</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard
            planName="Free"
            price="0"
            description="Perfect for beginners"
            features={['Up to 5 plants', 'Basic care reminders', 'Plant identification']}
            buttonText="Get Started"
            onButtonClick={onSignUpClick}
          />
          <PricingCard
            planName="Plant Lover"
            price="4.99"
            description="For serious plant parents"
            features={[
              'Unlimited plants',
              'AI assistant (limited)',
              'Advanced care schedules',
              'Unlimited AI assistant',
              'Priority support'
            ]}
            isPopular={true}
            buttonText="Start Free Trial"
            onButtonClick={onSignUpClick}
          />
          <PricingCard
            planName="Garden Pro"
            price="9.99"
            description="For plant professionals"
            features={[
              'Everything in Plant Lover',
              'Multiple gardens',
              'Team collaboration',
              'Advanced analytics',
              'Custom care plans',
              'Export reports',
            ]}
            buttonText="Start Free Trial"
            onButtonClick={onSignUpClick}
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;