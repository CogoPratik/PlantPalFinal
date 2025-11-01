
import React from 'react';

const StatsBanner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-plant-green-dark to-plant-green text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl md:text-5xl font-bold">50K+</p>
            <p className="text-lg text-green-100">Active Users</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold">500K+</p>
            <p className="text-lg text-green-100">Plants Tracked</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold">98%</p>
            <p className="text-lg text-green-100">Satisfaction Rate</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold">4.9</p>
            <p className="text-lg text-green-100">App Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;
