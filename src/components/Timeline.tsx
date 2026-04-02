import timelineData from '../data/timeline.json';
import { TimelineEvent } from '../types';
import { Calendar, Award, Landmark, Users } from 'lucide-react';

const events = timelineData as TimelineEvent[];

const getIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'milestone': return <Landmark className="w-6 h-6" />;
    case 'event': return <Calendar className="w-6 h-6" />;
    case 'award': return <Award className="w-6 h-6" />;
    default: return <Users className="w-6 h-6" />;
  }
};

interface TimelineProps {
  className?: string;
}

export function Timeline({ className = '' }: TimelineProps) {
  return (
    <div className={`py-20 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rhibms-red-600 to-rhibms-sky-500 bg-clip-text text-transparent mb-4">
            Our Journey Through Time
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From humble beginnings to becoming a beacon of biomedical and management excellence
          </p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 hidden lg:block" />
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 lg:hidden" />

          <div className="space-y-8">
            {events.map((event, index) => (
              <div
                key={event.year}
                className={`relative flex lg:gap-8 items-start lg:items-center ${index % 2 === 0 ? 'flex-row-reverse lg:flex-row' : 'flex-row lg:flex-row-reverse'}`}
              >
                {/* Event bubble */}
                <div className="lg:w-16 flex-shrink-0 flex flex-col items-center lg:block">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center z-10 border-4 border-white lg:w-20 lg:h-20">
                    <div className="text-white font-bold text-lg">{new Date(event.year, 0).getFullYear().toString().slice(-2)}</div>
                  </div>
                </div>

                {/* Event content */}
                <div className="flex-1 px-6 py-6 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-x-1 transition-all duration-500 lg:max-w-2xl group hover:bg-white/90">
                  <div className="flex items-center gap-3 mb-3">
                    {getIcon(event.type)}
                    <div className="font-bold text-2xl">{event.year}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

