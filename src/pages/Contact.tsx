import React, { useState } from 'react';
// Navbar and Footer now in App.tsx
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const initialFormData = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

export default function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    if (formData.name && formData.email && formData.message) {
      setSubmitStatus('success');
    } else {
      setSubmitStatus('error');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSubmitStatus('idle');
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-24 text-center bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-95 leading-relaxed drop-shadow-lg">
            Ready to preserve history, collaborate, or learn more about RHIBMS Heritage?
          </p>
          <div className="bg-white/20 backdrop-blur-xl px-8 py-4 rounded-2xl inline-block border border-white/30">
            Mayor Street, beside Baptist Church • Cameroon
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Contact Information</h2>
            
            <div className="space-y-8 mb-16">
              <div className="group flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <MapPin className="w-12 h-12 text-blue-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">Visit Us</h3>
                  <p className="text-lg text-gray-700">Mayor Street, beside Baptist Church<br />Bamenda, Cameroon</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Phone className="w-12 h-12 text-emerald-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">Call Us</h3>
                  <p className="text-lg text-gray-700">+237 678 123 456<br />+237 699 987 654</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Mail className="w-12 h-12 text-purple-600 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">Email Us</h3>
                  <p className="text-lg text-gray-700">info@rhibms.org<br />heritage@rhibms.edu</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative bg-gradient-to-br from-slate-200 to-gray-300 rounded-3xl p-12 text-center group hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDBMMCAxMiBMMTIgMjRMMTIgMEwxMiAwWiIgZmlsbD0iI2U1ZTllOSIgb3BhY2l0eT0iMC4yNSIvPgo8L3N2Zz4K')] bg-repeat">
                <MapPin className="w-24 h-24 text-gray-600 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Interactive Map Coming Soon</h3>
                <p className="text-lg text-gray-700">Pinpoint our exact location on Mayor Street</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Send a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-8">
                <div className="text-emerald-800 text-center">
                  <Send className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-lg">Thank you for reaching out. We'll respond within 24 hours.</p>
                  <button 
                    onClick={resetForm}
                    className="mt-6 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-8">
                <div className="text-red-800 text-center">
                  <h3 className="text-2xl font-bold mb-2">Please fill all fields</h3>
                  <button 
                    onClick={resetForm}
                    className="px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-lg resize-vertical"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold py-6 px-8 rounded-2xl text-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
