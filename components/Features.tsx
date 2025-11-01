import React from 'react';
import { ArrowRightIcon, CheckIcon, SparkleIcon, WaterDropIcon, AiIcon, CalendarIcon, CameraIcon, ChartIcon, BellIcon } from '../constants';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, bgColor, textColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <div className={`inline-block p-3 rounded-lg ${bgColor} ${textColor} mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-plant-gray">{description}</p>
  </div>
);

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features for Plant Parents</h2>
          <p className="text-lg text-plant-gray mt-4 max-w-2xl mx-auto">Everything you need to keep your plants healthy and thriving</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-plant-green text-white p-8 rounded-2xl shadow-xl flex flex-col">
            <div className="bg-white/20 p-4 rounded-lg self-start mb-4">
              <AiIcon className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Plant Care Assistant</h3>
            <p className="mb-6 flex-grow">
              Get instant, personalized answers to all your plant care questions. Our AI analyzes your plant's condition and provides expert recommendations 24/7.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center"><CheckIcon className="h-5 w-5 mr-3" />Instant diagnosis</li>
              <li className="flex items-center"><CheckIcon className="h-5 w-5 mr-3" />Custom care plans</li>
              <li className="flex items-center"><CheckIcon className="h-5 w-5 mr-3" />Seasonal adjustments</li>
            </ul>
            <button className="flex items-center justify-center bg-white text-plant-green font-bold px-6 py-3 rounded-lg w-full hover:bg-gray-100 transition-colors">
              Try AI Assistant <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
            <FeatureCard
              icon={<WaterDropIcon className="h-6 w-6" />}
              title="Smart Watering Reminders"
              description="Never forget to water your plants again with personalized schedules."
              bgColor="bg-blue-100"
              textColor="text-blue-500"
            />
            <FeatureCard
              icon={<CameraIcon className="h-6 w-6" />}
              title="Plant Identification"
              description="Identify any plant species instantly using your camera."
              bgColor="bg-green-100"
              textColor="text-green-500"
            />
            <FeatureCard
              icon={<CalendarIcon className="h-6 w-6" />}
              title="Care Schedule"
              description="Track watering, fertilizing, and maintenance tasks effortlessly."
              bgColor="bg-orange-100"
              textColor="text-orange-500"
            />
            <FeatureCard
              icon={<ChartIcon className="h-6 w-6" />}
              title="Health Tracking"
              description="Monitor your plant's health and get personalized recommendations."
              bgColor="bg-teal-100"
              textColor="text-teal-500"
            />
             <FeatureCard
              icon={<AiIcon className="h-6 w-6" />}
              title="AI Plant Care Assistant"
              description="Get instant answers to your plant care questions powered by AI."
              bgColor="bg-purple-100"
              textColor="text-purple-500"
            />
             <FeatureCard
              icon={<BellIcon className="h-6 w-6" />}
              title="Smart Notifications"
              description="Receive timely reminders for all your plant care needs."
              bgColor="bg-pink-100"
              textColor="text-pink-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;