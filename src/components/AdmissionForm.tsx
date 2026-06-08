import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient';
import { uploadFiles, uploadFile } from '../utils/storageHelpers';
import { v4 as uuidv4 } from 'uuid';

const subjectsList = ['Mathematics','Physics','Chemistry','Biology','English','History','Geography','Economics','Computer Science','Literature','Religious Studies']

// Updated to match programs.json schools
const programData: Record<string, Record<string, string[]>> = {
  'School Of Engineering':{
    'HND':['Civil Engineering','Mechanical Engineering','Electrical Engineering','Chemical Engineering'],
    'TOP UP':['Structural Engineering','Power Systems','Industrial Engineering'],
    'DIRECT BSc':['Advanced Engineering','Project Management'],
    'MASTERS':['Advanced Engineering','Project Management']
  },
  'School Of Management Sciences':{
    'HND':['Business Administration','Accounting','Economics'],
    'TOP UP':['Financial Management','Marketing','Human Resources'],
    'DIRECT BSc':['Strategic Management','Entrepreneurship'],
    'MASTERS':['MBA','Strategic Management']
  },
  'School Of Biomedical Sciences':{
    'HND':['Nursing','Public Health','Laboratory Science'],
    'TOP UP':['Nursing Practice','Health Administration'],
    'DIRECT BSc':['Advanced Nursing','Health Research'],
    'MASTERS':['Public Health','Health Management']
  },
  'School Of Agriculture':{
    'HND':['Agronomy','Animal Science'],
    'TOP UP':['Agribusiness','Crop Protection'],
    'DIRECT BSc':['Agricultural Economics','Sustainable Agriculture'],
    'MASTERS':['Agricultural Development']
  },
  'School Of Home Economics And Social Work':{
    'HND':['Nutrition','Social Work'],
    'TOP UP':['Family Studies','Community Development'],
    'DIRECT BSc':['Public Health Nutrition','Counseling'],
    'MASTERS':['Community Health']
  },
  'School Of Arts And Education':{
    'HND':['Education','Fine Arts'],
    'TOP UP':['Educational Administration'],
    'DIRECT BSc':['Curriculum Development','Educational Psychology'],
    'MASTERS':['Educational Leadership']
  }
}

interface FormData {
  s_fname?: string
  s_lname?: string
  s_mname?: string
  s_sex?: string
  s_dob?: string
  s_phone?: string
  s_email?: string
  s_address?: string
  p_fname?: string
  p_lname?: string
  p_mname?: string
  p_relationship?: string
  p_occupation?: string
  p_phone?: string
  p_email?: string
  p_address?: string
  cert_obtained_from?: string
  cert_name?: string
  sickness_info?: string
  agree?: boolean

  // Payment
  payment_method?: 'mtn_momo' | 'orange_money'
  momo_number?: string
  payment_amount?: string
}

const paymentMethodLabel: Record<NonNullable<FormData['payment_method']>, string> = {
  mtn_momo: 'MTN MOMO',
  orange_money: 'ORANGE MONEY',
}



interface Subject {
  subject: string
  grade: string
}

const AdmissionForm: React.FC = () => {
  const totalSteps = 7
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<FormData>({})
  const [subjects, setSubjects] = useState<Subject[]>([{subject:'', grade:''}])
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([])
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
const [certFiles, setCertFiles] = useState<File[]>([])
  const [passportFile, setPassportFile] = useState<File | null>(null)
  const [certPaths, setCertPaths] = useState<string[]>([])
  const [passportPath, setPassportPath] = useState<string | null>(null)
  const [formId] = useState(uuidv4())
// const [submitting, setSubmitting] = useState(false)
// const [isLoading, setIsLoading] = useState(false)
  const [isPatient, setIsPatient] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Prefill from route state
    if (location.state) {
      const state = location.state as any
      if (state.school) {
        setSelectedSchool(state.school)
      }
      if (state.level) {
        setSelectedLevel(state.level)
      }
      if (state.program) {
        setSelectedPrograms([state.program])
      }
    }
  }, [location.state])

  useEffect(() => {
    // Update programs when school/level change
    if (selectedSchool && selectedLevel && programData[selectedSchool]) {
      setAvailablePrograms(programData[selectedSchool][selectedLevel] || [])
    } else {
      setAvailablePrograms([])
    }
  }, [selectedSchool, selectedLevel])

  const changeStep = (dir: number) => {
    if (dir === 1 && !validateStep(currentStep)) return
    const next = currentStep + dir
    if (next >= 1 && next <= totalSteps) setCurrentStep(next)
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(form.s_fname && form.s_lname && form.s_phone && form.s_email && form.s_address)
      case 2:
        return !!(form.p_fname && form.p_lname && form.p_phone && form.p_email && form.p_address)
      case 3:
        return !!(selectedSchool && selectedLevel && selectedPrograms.length > 0)
      case 4:
        const valid = subjects.filter(s => s.subject && s.grade).length
        return valid >= 2
      case 5:
  return certPaths.length > 0 && !!passportPath
      case 6:
        if (!form.cert_obtained_from || !form.cert_name) return false
        if (isPatient) return !!form.sickness_info
        return true
      case 7: {
        if (!form.agree) return false
        if (!form.payment_method) return true
        const amountNum = form.payment_amount ? Number(form.payment_amount) : NaN
        const amountOk = Number.isFinite(amountNum) && amountNum > 0
        const phoneOk = !!(form.momo_number && form.momo_number.trim().length > 0)
        return amountOk && phoneOk


      }

      default:
        return true
    }
  }

  const addSubject = () => {
    setSubjects(prev => [...prev, {subject: '', grade: ''}])
  }

  const removeSubject = (i: number) => {
    if (subjects.length === 1) return
    setSubjects(prev => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(7)) return alert('Please accept terms and validate form')
    
    // Academic eligibility check
    const validCount = subjects.filter(s => s.subject && s.grade).length
    const hasReligious = subjects.some(s => s.subject && s.subject.toLowerCase() === 'religious studies')
    if (validCount < 2) return alert('At least 2 valid subjects required')
    if (validCount === 2 && hasReligious) return alert('Religious Studies cannot be one of two subjects')

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('Not authenticated');

      const admissionData = {
        user_id: user.id,
        form_id: formId,
        student: {
          s_fname: form.s_fname!,
          s_lname: form.s_lname!,
          s_mname: form.s_mname,
          s_sex: form.s_sex!,
          s_dob: form.s_dob,
          s_phone: form.s_phone!,
          s_email: form.s_email!,
          s_address: form.s_address!
        },
        parent: {
          p_fname: form.p_fname!,
          p_lname: form.p_lname!,
          p_mname: form.p_mname,
          p_relationship: form.p_relationship!,
          p_occupation: form.p_occupation,
          p_phone: form.p_phone!,
          p_email: form.p_email!,
          p_address: form.p_address!
        },
        education: {
          selected_school: selectedSchool,
          selected_level: selectedLevel,
          selectedPrograms
        },
        subjects: subjects.filter(s => s.subject && s.grade),
        cert_paths: certPaths,
        passport_path: passportPath,
        cert_obtained_from: form.cert_obtained_from!,
        cert_name: form.cert_name!,
        is_patient: isPatient,
        sickness_info: form.sickness_info || null,
        status: 'pending' as const
      };

      const { error } = await supabase.from('admissions').insert(admissionData);

      if (error) throw error;

      alert('✅ Application submitted to Supabase!');

    } catch (error: any) {
      console.error('Submit error:', error);
      alert('❌ Submission failed: ' + error.message);
    } finally {
      // setSubmitting(false);
    }

    // Reset form
    setForm({});
    setSubjects([{subject: '', grade: ''}]);
    setSelectedPrograms([]);
    setCertFiles([]);
    setCertPaths([]);
    setPassportFile(null);
    setPassportPath(null);
    setIsPatient(false);
    setCurrentStep(1);
  }

  const stepLabels = ['Student Info', 'Parent Info', 'Education', 'Subjects', 'Documents', 'Auxiliaries', 'Review']

  return (
    <div className="min-h-screen bg-gradient-to-br from-rhibms-red-50 via-white to-rhibms-sky-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rhibms-red-600 to-rhibms-sky-600 bg-clip-text text-transparent mb-4">
            Student Admission Form
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">Complete this form to apply for admission</p>
          
          {/* Prefill Banner */}
          {selectedSchool && (
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-3xl shadow-2xl max-w-2xl mx-auto mb-8">
              <span className="font-semibold text-lg">🎯 Applying for: {selectedSchool}</span>
            </div>
          )}
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
            {Array.from({length: 7}, (_, i) => {
              const n = i + 1
              const isActive = n === currentStep
              const isCompleted = n < currentStep
              return (
                <div key={n} className="flex items-center gap-2">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300
                    ${isActive ? 'bg-gradient-to-r from-rhibms-red-500 to-rhibms-sky-500 text-white shadow-rhibms-red-500/50 scale-110' : ''}
                    ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/50' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {isCompleted ? '✓' : n}
                  </div>
                  {n < 7 && (
                    <div className={`h-1 flex-1 ${isCompleted || isActive ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-center mt-4 gap-4 text-sm font-medium text-gray-600">
            {stepLabels.map((label, i) => (
              <div key={i} className={`px-3 py-1 rounded-full transition-colors ${
                i + 1 === currentStep ? 'bg-rhibms-red-100 text-rhibms-red-700' : 'text-gray-500'
              }`}>
                {label}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 md:p-12">
          {/* Step 1: Student Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-rhibms-red-500 to-rhibms-sky-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  1
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Student Information</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm"
                    value={form.s_fname || ''} 
                    onChange={e => setForm({...form, s_fname: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-sky-500 focus:border-transparent transition-all shadow-sm"
                    value={form.s_mname || ''} 
                    onChange={e => setForm({...form, s_mname: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm"
                    value={form.s_lname || ''} 
                    onChange={e => setForm({...form, s_lname: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                  <div className="flex gap-6 p-3 bg-gray-50 rounded-2xl">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="s_sex" 
                        value="Male" 
                        className="w-5 h-5 text-rhibms-red-500 border-gray-300 focus:ring-rhibms-red-500"
                        checked={(form.s_sex || 'Male') === 'Male'} 
                        onChange={e => setForm({...form, s_sex: e.target.value})}
                      />
                      <span className="font-medium">Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="s_sex" 
                        value="Female" 
                        className="w-5 h-5 text-rhibms-red-500 border-gray-300 focus:ring-rhibms-red-500"
                        checked={(form.s_sex || 'Male') === 'Female'} 
                        onChange={e => setForm({...form, s_sex: e.target.value})}
                      />
                      <span className="font-medium">Female</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                  <input 
                    type="date" 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-sky-500 focus:border-transparent transition-all shadow-sm"
                    value={form.s_dob || ''} 
                    onChange={e => setForm({...form, s_dob: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm"
                    value={form.s_phone || ''} 
                    onChange={e => setForm({...form, s_phone: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email"
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-sky-500 focus:border-transparent transition-all shadow-sm"
                    value={form.s_email || ''} 
                    onChange={e => setForm({...form, s_email: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                <textarea 
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm resize-vertical min-h-[120px]"
                  value={form.s_address || ''} 
                  onChange={e => setForm({...form, s_address: e.target.value})}
                  required 
                />
              </div>
            </div>
          )}

          {/* Step 2: Parent Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-rhibms-sky-500 to-rhibms-red-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  2
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Parent/Guardian Information</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm"
                    value={form.p_fname || ''} 
                    onChange={e => setForm({...form, p_fname: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-sky-500 focus:border-transparent transition-all shadow-sm"
                    value={form.p_mname || ''} 
                    onChange={e => setForm({...form, p_mname: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm"
                    value={form.p_lname || ''} 
                    onChange={e => setForm({...form, p_lname: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship *</label>
                  <select 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm"
                    value={form.p_relationship || ''} 
                    onChange={e => setForm({...form, p_relationship: e.target.value})}
                    required
                  >
                    <option value="">-- Select --</option>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Guardian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-sky-500 focus:border-transparent transition-all shadow-sm"
                    value={form.p_occupation || ''} 
                    onChange={e => setForm({...form, p_occupation: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm"
                    value={form.p_phone || ''} 
                    onChange={e => setForm({...form, p_phone: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email"
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-sky-500 focus:border-transparent transition-all shadow-sm"
                    value={form.p_email || ''} 
                    onChange={e => setForm({...form, p_email: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                <textarea 
                  className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm resize-vertical min-h-[120px]"
                  value={form.p_address || ''} 
                  onChange={e => setForm({...form, p_address: e.target.value})}
                  required 
                />
              </div>
            </div>
          )}

          {/* Step 3: Education */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  3
                </div>
                <h2 className="text-3xl font-bold text-gray-900">School & Program Selection</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select School{selectedSchool ? ' (Pre-selected)' : ' *'}</label>
                  <select 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-lg"
                    value={selectedSchool} 
                    onChange={e => {
                      setSelectedSchool(e.target.value)
                      setSelectedLevel('')
                      setSelectedPrograms([])
                    }}
disabled={!!selectedSchool}
                  >
                    <option value="">-- Select School --</option>
                    {Object.keys(programData).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Select Level *</label>
                  <select 
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-lg"
                    value={selectedLevel} 
                    onChange={e => {
                      setSelectedLevel(e.target.value)
                      setSelectedPrograms([])
                    }} 
                    disabled={!selectedSchool}
                  >
                    <option value="">-- Select Level --</option>
                    {selectedSchool && Object.keys(programData[selectedSchool]).map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              {availablePrograms.length > 0 && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-dashed border-blue-200">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">Select Programs *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 bg-white rounded-2xl">
                    {availablePrograms.map(p => (
                      <label key={p} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectedPrograms.includes(p)} 
                          onChange={e => {
                            const checked = e.target.checked
                            setSelectedPrograms(prev => checked ? [...prev, p] : prev.filter(x => x !== p))
                          }}
                        />
                        <span className="font-medium text-gray-900">{p}</span>
                      </label>
                    ))}
                  </div>
                  {selectedPrograms.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2 italic">Select at least one program</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Subjects */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  4
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Academic History</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">Enter your subjects and grades. You must have at least 2 valid subjects.</p>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="p-4 text-left font-semibold text-gray-800 border-b">Subject Name</th>
                      <th className="p-4 text-left font-semibold text-gray-800 border-b">Grade</th>
                      <th className="p-4 text-center font-semibold text-gray-800 border-b w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <select 
                            className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={row.subject} 
                            onChange={e => {
                              const val = e.target.value
                              setSubjects(prev => prev.map((r, i) => i === idx ? {...r, subject: val} : r))
                            }}
                          >
                            <option value="">-- Select Subject --</option>
                            {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="p-4">
                          <input 
                            className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={row.grade} 
                            onChange={e => {
                              const val = e.target.value
                              setSubjects(prev => prev.map((r, i) => i === idx ? {...r, grade: val} : r))
                            }} 
                            placeholder="e.g., A, B, C"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            type="button"
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                            onClick={() => removeSubject(idx)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m7-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 4h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button 
                type="button" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                onClick={addSubject}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Subject
              </button>
            </div>
          )}

{/* Step 5: Document Upload */}
  {currentStep === 5 && (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
          5
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Document Upload</h2>
      </div>
      <p className="text-lg text-gray-600 mb-6">Upload your academic certificates and passport photo. All files required to proceed.</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Certificates Upload */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">Academic Certificates * (Multiple)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-purple-400 transition-colors bg-gradient-to-b from-white to-purple-50">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={async (e) => {
                const files = Array.from(e.target.files || [])
                setCertFiles(files)
                // Auto upload
                if (files.length > 0) {
                  const paths = await uploadFiles(files, 'admissions', formId)
                  setCertPaths(paths)
                }
              }}
              className="hidden"
              id="certificates"
            />
            <label htmlFor="certificates" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                📄
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700 mb-1">Click to Upload</p>
                <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB each)</p>
              </div>
              <div className="flex gap-2 text-sm bg-white px-4 py-2 rounded-2xl border shadow-sm">
                or drag & drop
              </div>
            </label>
          </div>
          
          {certFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {certFiles.map((file, idx) => (
                <div key={idx} className="border rounded-2xl p-3 bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="text-xs text-gray-500 mb-1 truncate">{file.name}</div>
                  <div className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                  <button
                    type="button"
                    className="mt-1 text-red-500 hover:text-red-600 text-xs font-medium"
                    onClick={() => setCertFiles(prev => prev.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          {certFiles.length === 0 && (
            <p className="text-sm text-gray-500 mt-2 italic">No certificates uploaded yet</p>
          )}
        </div>

        {/* Passport Photo Upload */}
        <div>
          <label className="block text-lg font-semibold text-gray-800 mb-4">Passport Photo * (Single)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center hover:border-indigo-400 transition-colors bg-gradient-to-b from-white to-indigo-50">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files ? e.target.files[0] : null
                setPassportFile(file || null)
                // Auto upload
                if (file) {
                  const path = await uploadFile(file, 'admissions', formId)
                  setPassportPath(path)
                } else {
                  setPassportPath(null)
                }
              }}
              className="hidden"
              id="passport"
            />
            <label htmlFor="passport" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                📸
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700 mb-1">Click to Upload</p>
                <p className="text-sm text-gray-500">JPG, PNG (Max 2MB)</p>
              </div>
              <div className="flex gap-2 text-sm bg-white px-4 py-2 rounded-2xl border shadow-sm">
                or drag & drop
              </div>
            </label>
          </div>
          
          {passportFile && (
            <div className="mt-4 p-4 bg-white border rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={URL.createObjectURL(passportFile)} 
                  alt="Passport preview" 
                  className="w-20 h-20 object-cover rounded-xl shadow-md"
                />
                <div>
                  <div className="text-xs text-gray-500 truncate max-w-[150px]">{passportFile.name}</div>
                  <div className="text-xs text-gray-400">{(passportFile.size / 1024 / 1024).toFixed(1)} MB</div>
                  <button
                    type="button"
                    className="mt-1 text-red-500 hover:text-red-600 text-xs font-medium"
                    onClick={() => setPassportFile(null)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
          {!passportFile && (
            <p className="text-sm text-gray-500 mt-2 italic">No passport photo uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  )}


          {/* Step 6: Additional Information */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  6
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Additional Information</h2>
              </div>

              {/* Certificate Information */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Certificate Information</h3>
                <p className="text-sm text-gray-500 mb-6">Please provide details about your certificate.</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cert_obtained_from" className="block text-sm font-semibold text-gray-700 mb-2">
                      Certificate Obtained From *
                    </label>
                    <input
                      id="cert_obtained_from"
                      type="text"
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                      value={form.cert_obtained_from || ''}
                      onChange={(e) => setForm({ ...form, cert_obtained_from: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cert_name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Certificate Name *
                    </label>
                    <input
                      id="cert_name"
                      type="text"
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
                      value={form.cert_name || ''}
                      onChange={(e) => setForm({ ...form, cert_name: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Medical Condition Section */}
              <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl border border-orange-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Medical Condition</h3>
                <div className="space-y-4">
                  <label htmlFor="isPatient" className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-orange-300 cursor-pointer transition-all shadow-sm hover:shadow-md">
                    <input
                      id="isPatient"
                      type="checkbox"
                      className="w-6 h-6 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                      checked={isPatient}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsPatient(checked);
                        if (!checked) {
                          setForm((prev) => ({ ...prev, sickness_info: '' }));
                        }
                      }}
                    />
                    <span className="text-lg font-semibold text-gray-900 cursor-pointer">Are you a patient with a medical condition?</span>
                  </label>

                  {isPatient && (
                    <div className="transition-all duration-300 ease-in-out overflow-hidden">
                      <div className="bg-amber-100 border-l-4 border-amber-400 bg-amber-50 p-4 rounded-xl mb-6">
                        <p className="text-sm text-amber-800">
                          <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          Please provide details about your medical condition so we can accommodate your needs.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="sickness_info" className="block text-sm font-semibold text-gray-700 mb-2">
                          Medical Condition Details *
                        </label>
                        <textarea
                          id="sickness_info"
                          className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm resize-vertical min-h-[120px]"
                          value={form.sickness_info || ''}
                          onChange={(e) => setForm({ ...form, sickness_info: e.target.value })}
                          required
                          placeholder="Please describe your medical condition, treatment, and any special requirements..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Review & Submit */}
          {currentStep === 7 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  7
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Review & Submit</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8">Please review all the information below. You can go back to edit any section.</p>

              <div className="grid md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto space-y-6 md:space-y-0">
                {/* Student Information */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg className="w-8 h-8 text-rhibms-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Student Information
                  </h3>
                  <div className="space-y-4 text-lg">
                    <div><span className="font-semibold text-gray-700">Full Name:</span> {`${form.s_fname || ''} ${form.s_mname ? form.s_mname + ' ' : ''}${form.s_lname || ''}`.trim() || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Gender:</span> {form.s_sex || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">DOB:</span> {form.s_dob || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Phone:</span> {form.s_phone || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Email:</span> {form.s_email || 'N/A'}</div>
                    <div className="text-sm"><span className="font-semibold text-gray-700">Address:</span> {form.s_address || 'N/A'}</div>
                  </div>
                </div>

                {/* Parent/Guardian */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.26 3c.15 0 .3.01.456.03 1.411.17 2.701.74 3.697 1.632l-.773.773c-.78-.77-1.772-1.32-2.844-1.54V3h-1zM5.5 11a3.5 3.5 0 116.35 2.055A8.989 8.989 0 005.5 11zM5 20.5c0 .828.672 1.5 1.5 1.5H14v-1.5H6.5a1.5 1.5 0 01-1.5-1.5V20H5v.5z" />
                    </svg>
                    Parent / Guardian
                  </h3>
                  <div className="space-y-4 text-lg">
                    <div><span className="font-semibold text-gray-700">Full Name:</span> {`${form.p_fname || ''} ${form.p_mname ? form.p_mname + ' ' : ''}${form.p_lname || ''}`.trim() || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Relationship:</span> {form.p_relationship || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Occupation:</span> {form.p_occupation || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Phone:</span> {form.p_phone || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Email:</span> {form.p_email || 'N/A'}</div>
                    <div className="text-sm"><span className="font-semibold text-gray-700">Address:</span> {form.p_address || 'N/A'}</div>
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                    Education
                  </h3>
                  <div className="space-y-4 text-lg">
                    <div><span className="font-semibold text-gray-700">School:</span> {selectedSchool || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Level:</span> {selectedLevel || 'N/A'}</div>
                    <div className="text-sm"><span className="font-semibold text-gray-700">Programs:</span> {selectedPrograms.length ? selectedPrograms.join(', ') : 'None selected'}</div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zM12 14l9-5-9-5-9 5 9 5zm0 0l9-5-9-5-9 5 9 5z" />
                    </svg>
                    Academic Subjects
                  </h3>
                  <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
                    {subjects.filter(s => s.subject && s.grade).length > 0 ? subjects.filter(s => s.subject && s.grade).map((s, i) => (
                      <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                        <span>{s.subject}</span>
                        <span className="font-semibold">{s.grade}</span>
                      </div>
                    )) : <div className="text-gray-500 italic">No subjects added</div>}
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 md:col-span-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documents
                  </h3>
                  <div className="space-y-3 text-lg">
                    <div><span className="font-semibold text-gray-700">Certificates:</span> <span className="font-bold text-emerald-600">{certFiles.length}</span> uploaded</div>
                    <div><span className="font-semibold text-gray-700">Passport Photo:</span> {passportFile ? passportFile.name : 'Not uploaded'}</div>
                  </div>
                </div>

                {/* Additional */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 md:col-span-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Additional Information
                  </h3>
                  <div className="space-y-3 text-lg">
                    <div><span className="font-semibold text-gray-700">Certificate From:</span> {form.cert_obtained_from || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-700">Certificate Name:</span> {form.cert_name || 'N/A'}</div>
                    {form.sickness_info && (
                      <div className="text-sm p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <span className="font-semibold text-gray-700 block mb-1">Medical Condition:</span>
                        <span>{form.sickness_info}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 md:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h6m9-14h-4a2 2 0 00-2 2v10a2 2 0 002 2h4" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7h10M12 17h10" />
                    </svg>
                    Payment
                  </h3>
                  <div className="space-y-3 text-lg">
                    <div>
                      <span className="font-semibold text-gray-700">Method:</span>{' '}
                      {form.payment_method ? paymentMethodLabel[form.payment_method] : 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">User Number:</span>{' '}
                      {form.momo_number || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Amount:</span>{' '}
                      {form.payment_amount ? `${form.payment_amount}` : 'N/A'}
                    </div>
                  </div>
                </div>

              </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h3>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Choose MoMo Payment Method</label>
                <div className="relative">
                  <select
                    value={form.payment_method || ''}
                    onChange={(e) => {
                      const val = e.target.value as FormData['payment_method']
                      setForm({
                        ...form,
                        payment_method: val,
                      })
                    }}
                    className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-red-500 focus:border-transparent transition-all shadow-sm bg-white text-lg"
                  >
                    <option value="">-- Select Payment Method --</option>
                    <option value="mtn_momo">MTN MOMO</option>
                    <option value="orange_money">ORANGE MONEY</option>
                  </select>

                  {form.payment_method && (
                    <div className="mt-4 flex items-center gap-3">
                      {form.payment_method === 'mtn_momo' && (
                        <img
                          src={new URL('../assets/mtn_momo_icon.png', import.meta.url).toString()}
                          alt="MTN MoMo"
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      {form.payment_method === 'orange_money' && (
                        <img
                          src={new URL('../assets/Orange_Money_icon.png', import.meta.url).toString()}
                          alt="Orange Money"
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      <div className="text-gray-700 font-semibold">
                        {paymentMethodLabel[form.payment_method]}
                      </div>
                    </div>
                  )}
                </div>

                {!form.payment_method && (
                  <p className="text-sm text-gray-500 mt-3 italic">Payment is optional, but if you choose one you must fill the required fields.</p>
                )}
              </div>

              <div>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {form.payment_method ? 'User Number (MoMo Deduction)' : 'User Number'}
                      {form.payment_method ? ' *' : ''}
                    </label>
                    <input
                      value={form.momo_number || ''}
                      onChange={(e) => setForm({ ...form, momo_number: e.target.value })}
                      placeholder="e.g., 07xxxxxxxx"
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-sky-500 focus:border-transparent transition-all shadow-sm bg-white text-lg"
                      required={!!form.payment_method}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {form.payment_method ? 'Amount' : 'Amount'} {form.payment_method ? ' *' : ''}
                    </label>
                    <input
                      value={form.payment_amount || ''}
                      onChange={(e) => setForm({ ...form, payment_amount: e.target.value })}
                      placeholder="e.g., 50000"
                      inputMode="decimal"
                      className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rhibms-sky-500 focus:border-transparent transition-all shadow-sm bg-white text-lg"
                      required={!!form.payment_method}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <div className="p-8 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-3xl border-4 border-emerald-200">
            <label className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 hover:border-emerald-400 transition-all cursor-pointer">
              <input
                type="checkbox"
                className="w-6 h-6 text-emerald-600 rounded-lg border-2 border-gray-300 focus:ring-emerald-500 focus:ring-2 shrink-0"
                checked={form.agree || false}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                required
              />
              <div>
                <div className="text-xl font-bold text-gray-900">I confirm all information is correct</div>
                <div className="text-sm text-gray-600 mt-1">Once submitted, this application is final and cannot be changed.</div>
              </div>
            </label>
          </div>
        </div>
      )}


          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12 pt-8 border-t border-gray-200">


            <button 
              type="button" 
              onClick={() => changeStep(-1)}
              className="flex-1 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-2xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentStep === 1}
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            {currentStep === totalSteps ? (
              <button 
                type="submit" 
                className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Application
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => changeStep(1)}
                disabled={!validateStep(currentStep)}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-rhibms-red-500 to-rhibms-sky-500 hover:from-rhibms-red-600 hover:to-rhibms-sky-600 text-white font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {currentStep === totalSteps - 1 ? 'Review' : 'Next'}
                <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdmissionForm

