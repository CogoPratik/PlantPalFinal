
import React from 'react';
import { ShieldIcon, LightningIcon, GlobeIcon, TrophyIcon } from '../constants';

const TrustBadge: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-plant-green-dark mb-2">{icon}</div>
    <p className="font-semibold text-plant-gray-dark">{label}</p>
  </div>
);

const TrustBadges: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-8">
            <p className="text-lg text-plant-gray">Trusted by plant lovers worldwide</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <TrustBadge icon={<ShieldIcon className="h-10 w-10" />} label="Secure & Private" />
          <TrustBadge icon={<LightningIcon className="h-10 w-10" />} label="Lightning Fast" />
          <TrustBadge icon={<GlobeIcon className="h-10 w-10" />} label="Global Community" />
          <TrustBadge icon={<TrophyIcon className="h-10 w-10" />} label="Award Winning" />
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
