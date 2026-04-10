import partnersData from '../data/partners.json';
import { Partner } from '../types';
import { partnerImages, fallbackImages } from '../utils/imageHelpers';

interface PartnerGridProps {
  className?: string;
}

export function PartnerGrid({ className = '' }: PartnerGridProps) {
  const national = partnersData.filter((p) => p.type === 'national') as Partner[];
  const international = partnersData.filter((p) => p.type === 'international') as Partner[];

  const getPartnerImage = (partner: Partner) => partner.imageId ? partnerImages[partner.imageId] || fallbackImages.partner || '/fallback-partner.jpg' : fallbackImages.partner || '/fallback-partner.jpg';

  return (
    <div className={`py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rhibms-red-500 to-rhibms-sky-500 bg-clip-text text-transparent mb-6">
            Our Esteemed Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Collaborating with national and international institutions to deliver world-class education
          </p>
        </div>

        {/* National Partners */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-16 text-gray-800">National Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {national.map((partner: Partner, index: number) => (
              <div key={index} className="group bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 overflow-hidden">
                <div className="p-10 pb-8">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 group-hover:text-rhibms-red-600 transition-colors">{partner.name}</h4>
                  <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg mb-8">
                    <img
                      src={getPartnerImage(partner)}
                      alt={partner.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = fallbackImages.partner)}
                    />
                  </div>
                  <p className="text-gray-600 leading-relaxed text-center px-6">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International Partners */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-16 text-gray-800">International Partners</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {international.map((partner: Partner, index: number) => (
              <div key={index} className="group bg-gradient-to-br from-rhibms-sky-50 to-rhibms-red-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-rhibms-sky-200 overflow-hidden">
                <div className="p-10 pb-8">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 group-hover:text-rhibms-sky-600 transition-colors">{partner.name}</h4>
                  <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg mb-8">
                    <img
                      src={getPartnerImage(partner)}
                      alt={partner.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => (e.currentTarget.src = fallbackImages.partner)}
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-center px-6 font-medium">{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

