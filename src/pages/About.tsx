// Navbar and Footer now in App.tsx
import { Timeline } from '../components/Timeline';
import { founderImages } from '../utils/imageHelpers';
import { GraduationCap, Globe, Heart } from 'lucide-react';

const founder = {
  name: "Mr Eben Tambe",
  title: "Founder & Visionary",
  bio: "Mr Tambe founded RHIBMS in 2009 with a vision to bridge biomedical sciences and management excellence in Cameroon. His leadership has grown the institute from 50 students to over 7,000, establishing international partnerships and community impact initiatives.",
  image: founderImages.founda
};

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-24 text-center bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 leading-relaxed drop-shadow-lg">
            From a visionary dream in 2009 to becoming Cameroon's premier institute for biomedical
            and management sciences, preserving our legacy for generations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="px-8 py-4 bg-white/20 backdrop-blur-xl text-white font-semibold text-lg rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              Interactive Timeline
            </div>
            <div className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Meet Our Founder
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-8">
                <GraduationCap size={20} />
                <span>Founder & Visionary</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Mr Eben Tambe
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {founder.bio}
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
                  <Globe className="w-12 h-12 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Global Impact</div>
                    <div className="text-sm text-gray-600">International partnerships established</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                  <Heart className="w-12 h-12 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Community Service</div>
                    <div className="text-sm text-gray-600">Borehole, buses, scholarships</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <img 
                  src={founder.image} 
                  alt={founder.name}
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <Timeline />
    </>
  );
}
