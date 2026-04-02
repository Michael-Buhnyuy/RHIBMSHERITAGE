// Navbar and Footer now in App.tsx
import { PartnerGrid } from '../components/PartnerGrid';
import { Users, Globe, Building2, Handshake, Award } from 'lucide-react';

export default function Partners() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-24 text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl px-6 py-3 rounded-full mb-8 border border-white/30">
            <Handshake className="w-5 h-5" />
            <span className="font-semibold">20+ Strategic Partners</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight">
            Global Network
            <br />
            <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text drop-shadow-lg">
              of Excellence
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 leading-relaxed drop-shadow-lg">
            Collaborating with leading national and international institutions to deliver
            unmatched educational opportunities and research excellence.
          </p>
        </div>
      </section>

      {/* Partners */}
      <PartnerGrid />

      {/* Collaboration Impact */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partnership Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our collaborations drive innovation, student exchange, joint research,
              and community development initiatives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border hover:border-blue-200">
              <Users className="w-20 h-20 text-blue-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold text-gray-900 mb-3 group-hover:text-blue-600">1,200+</div>
              <div className="text-xl font-semibold text-gray-700">Student Exchanges</div>
            </div>

            <div className="group text-center p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border hover:border-emerald-200">
              <Globe className="w-20 h-20 text-emerald-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600">15</div>
              <div className="text-xl font-semibold text-gray-700">Countries</div>
            </div>

            <div className="group text-center p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border hover:border-purple-200">
              <Building2 className="w-20 h-20 text-purple-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold text-gray-900 mb-3 group-hover:text-purple-600">25</div>
              <div className="text-xl font-semibold text-gray-700">Joint Programs</div>
            </div>

            <div className="group text-center p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border hover:border-orange-200">
              <Award className="w-20 h-20 text-orange-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold text-gray-900 mb-3 group-hover:text-orange-600">$2.5M+</div>
              <div className="text-xl font-semibold text-gray-700">Research Funding</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
