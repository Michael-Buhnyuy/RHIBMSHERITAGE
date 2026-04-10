import React, { useState } from 'react';
// Navbar and Footer now in App.tsx
import programsData from '../data/programs.json';
import { Program } from '../types';
import { programImages, fallbackImages } from '../utils/imageHelpers';
import { Users, BookOpen, Clock, Award } from 'lucide-react';

const ProgramCard: React.FC<{ program: Program; onClick: () => void }> = ({ program, onClick }) => (
  <div 
    className="group cursor-pointer bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-200 overflow-hidden h-full"
    onClick={onClick}
  >
    <div className="p-6 md:p-8 pb-4 h-full flex flex-col">
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 group-hover:text-rhibms-red-600 transition-colors flex-shrink-0">{program.title}</h3>
      <div className="w-full h-40 md:h-48 rounded-2xl overflow-hidden shadow-lg mb-4 flex-shrink-0">
<img 
          src={program.imageId ? programImages[program.imageId] || fallbackImages.program : fallbackImages.program} 
          alt={program.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = fallbackImages.program)}
        />
      </div>
      <p className="text-gray-600 leading-relaxed mb-6 px-1 flex-grow overflow-hidden">{program.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>{program.duration}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-rhibms-red-100 to-rhibms-sky-100 rounded-xl">
          <Award size={16} className="text-rhibms-red-600" />
          <span className="font-semibold text-xs">Accredited</span>
        </div>
      </div>
    </div>
  </div>
);

const ProgramDetail: React.FC<{ program: Program; onClose: () => void; navigate: (path: string, options?: any) => void }> = ({ program, onClose, navigate }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6">
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200">
      <div className="sticky top-0 bg-white/100 backdrop-blur p-8 border-b rounded-t-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{program.title}</h2>
          <button onClick={onClose} className="p-3 hover:bg-gray-200 rounded-2xl transition-all duration-200 hover:scale-110 shadow-sm">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 bg-gradient-to-r from-rhibms-red-50 to-rhibms-sky-50 px-6 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <Clock size={20} />
            <span className="font-semibold">{program.duration}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1 bg-white rounded-xl shadow-sm">
            <Award size={18} className="text-rhibms-red-600" />
            <span className="font-semibold text-gray-800">Accredited Program</span>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          <div>
            <div className="w-full h-80 rounded-3xl overflow-hidden shadow-2xl mb-8">
<img src={program.imageId ? programImages[program.imageId] || fallbackImages.program : fallbackImages.program} alt={program.title} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = fallbackImages.program)} />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-6 py-3 bg-gradient-to-r from-rhibms-red-500 to-rhibms-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                Core Disciplines
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-rhibms-sky-500 to-rhibms-sky-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                Modern Facilities
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all">
                Industry Partnerships
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Program Highlights</h3>
            <ul className="space-y-6 mb-12">
              <li className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-rhibms-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Hands-on Training</h4>
                  <p className="text-lg text-gray-700 leading-relaxed">Practical skills development through laboratories, field work, and clinical practice.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-rhibms-sky-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">World-Class Faculty</h4>
                  <p className="text-lg text-gray-700 leading-relaxed">Expert professors with international research experience and industry connections.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Career Success</h4>
                  <p className="text-lg text-gray-700 leading-relaxed">Proven graduate placement rates and international certification opportunities.</p>
                </div>
              </li>
            </ul>
            <div className="bg-gradient-to-r from-rhibms-red-50 to-rhibms-sky-50 p-8 rounded-3xl border-2 border-dashed border-rhibms-red-200">
              <p className="text-xl text-gray-700 leading-relaxed italic">
                {program.description}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button 
            type="button"
            onClick={() => navigate('/apply', { state: { school: program.title } })}
            className="px-16 py-8 bg-gradient-to-r from-rhibms-red-500 to-rhibms-sky-500 hover:from-emerald-500 hover:to-emerald-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 w-full max-w-2xl mx-auto"
          >
            Apply Now →
          </button>
        </div>
      </div>
    </div>
  </div>
);

import { useNavigate } from 'react-router-dom';

export default function Programs() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const navigate = useNavigate();

  return (

    <>
{selectedProgram && (
        <ProgramDetail program={selectedProgram} onClose={() => setSelectedProgram(null)} navigate={navigate} />
      )}
      
      {/* Hero */}
      <section className="pt-32 pb-24 text-center bg-gradient-to-r from-rhibms-red-500 to-rhibms-sky-500 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Academic Programs
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-95 leading-relaxed drop-shadow-lg">
            Six world-class schools offering comprehensive education across diverse disciplines
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-24 -mb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programsData.map((program: Program) => (
              <ProgramCard 
                key={program.id} 
                program={program}
                onClick={() => setSelectedProgram(program)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

