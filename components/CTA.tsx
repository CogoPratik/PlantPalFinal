import React from 'react';
import { ArrowRightIcon } from '../constants';

interface CTAProps {
  onSignUpClick: () => void;
}

const CTA: React.FC<CTAProps> = ({ onSignUpClick }) => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="bg-plant-green text-white rounded-3xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Become a Better Plant Parent?</h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy plant parents using Plant Pal to keep their plants healthy and thriving.
          </p>
          <button onClick={onSignUpClick} className="flex items-center justify-center bg-white text-plant-green font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors mx-auto">
            Start Your Free Trial <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
          <p className="mt-4 text-sm text-green-200">14-day free trial • No credit card required</p>
        </div>
      </div>
    </section>
  );
};

export default CTA;