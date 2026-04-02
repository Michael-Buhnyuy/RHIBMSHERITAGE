import { motion } from "framer-motion";
import metricsData from "../data/metrics.json";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import AnimatedSection from "../components/AnimatedSection";
import CountUp from "../components/CountUp";
import { PartnerGrid } from "../components/PartnerGrid";

import {
  Building2,
  Users,
  Award,
  Users2,
  Target,
  Globe,
  GraduationCap,
  Microscope,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

/* ================= DATA ================= */

const stats = [
  { label: "Total Students", value: 7000, suffix: "+", icon: Users2 },
  { label: "Programs Offered", value: 7, suffix: "", icon: Building2 },
  { label: "Years of Legacy", value: 16, suffix: "", icon: Award },
  { label: "Partners", value: 4, suffix: "+", icon: Users },
];

const whyChoose = [
  {
    title: "Practical Training",
    description: "Hands-on experience through modern labs, clinical practice, and internships. Students engage with real-life biomedical scenarios, enhancing technical skills. RHIBMS ensures practical exposure aligns with industry standards and regulations. Workshops and simulations prepare students for problem-solving in professional environments. Our approach bridges academic knowledge with workplace readiness.",
    icon: Microscope,
  },
  {
    title: "Experienced Lecturers",
    description: "Our faculty comprises industry experts and academics with extensive experience. Lecturers provide mentorship, guidance, and research opportunities for students. They are committed to fostering critical thinking and professional growth. Continuous training ensures they remain updated with global best practices. Students benefit from direct access to knowledge, insight, and industry networks.",
    icon: GraduationCap,
  },
  {
    title: "Career Opportunities",
    description: "Graduates are prepared for employment in healthcare, management, and research. RHIBMS collaborates with companies to offer internships and job placements. Alumni have secured leadership roles locally and internationally. Students acquire transferable skills valued across industries. Career counseling supports each student in achieving their professional goals.",
    icon: Briefcase,
  },
  {
    title: "Accredited Programs",
    description: "Programs meet national and international accreditation standards. RHIBMS emphasizes quality, compliance, and academic rigor. Students gain recognized qualifications enhancing employability. Curricula are regularly updated to reflect evolving industry needs. Accreditation ensures graduates are competent and credible in their fields.",
    icon: ShieldCheck,
  },
];

const programs = [
  {
    title: "Health Sciences",
    description: "Training healthcare professionals to meet the demands of modern medical practice. Students study anatomy, physiology, diagnostics, and patient care. Programs combine theoretical knowledge with hands-on clinical experience. RHIBMS fosters research and innovation in healthcare solutions. Graduates are prepared to serve hospitals, clinics, and public health systems.",
    icon: Microscope,
  },
  {
    title: "Management Sciences",
    description: "Leadership and business skills for emerging managers and entrepreneurs. Students explore finance, marketing, human resources, and organizational behavior. Emphasis on strategic thinking and problem-solving in dynamic environments. RHIBMS encourages innovative approaches to management challenges. Graduates are equipped to lead organizations and drive sustainable growth.",
    icon: Briefcase,
  },
  {
    title: "Biomedical Studies",
    description: "Integrating biology, technology, and engineering to advance healthcare. Students learn diagnostics, medical devices, and laboratory techniques. Research opportunities focus on improving patient outcomes and medical innovation. RHIBMS bridges academic research with practical biomedical applications. Graduates can work in hospitals, labs, biotech, and medical research institutions.",
    icon: Building2,
  },
];

/* ================= TOOLTIP ================= */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white shadow-xl border rounded-xl p-4">
        <p className="font-semibold mb-2">Year: {label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ================= COMPONENT ================= */

export default function Home() {
  return (
    <>
      {/* HERO */}
      <AnimatedSection>
        <section className="pt-32 pb-20 text-center bg-gradient-to-r from-rhibms-red-500 to-rhibms-sky-500 text-white">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              RHIBMS Heritage
            </h1>

            <p className="text-xl mb-8">
              Preserving history through digital archives and storytelling.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-8 py-4 bg-white text-rhibms-red-600 rounded-full hover:scale-105 transition">
                Explore History
              </button>

              <button className="px-8 py-4 border-2 border-white rounded-full hover:bg-white hover:text-rhibms-red-600 transition">
                View Documentary
              </button>
            </div>
          </motion.div>
        </section>
      </AnimatedSection>

      {/* STATS */}
      <AnimatedSection delay={0.1}>
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-8 rounded-2xl bg-gray-50 text-center hover:shadow-2xl hover:-translate-y-2 transition-all"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-rhibms-red-600" />

                <div className="text-3xl font-bold">
                  <CountUp value={stat.value} />
                  {stat.suffix}
                </div>

                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* VISION & MISSION */}
      <AnimatedSection delay={0.2}>
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10">
            <div className="p-10 bg-white rounded-2xl shadow hover:shadow-xl transition">
              <Target className="w-12 h-12 text-rhibms-red-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Mission</h3>
              <p className="text-gray-600">
                To provide quality education, research, and community service. We deliver
                practical and theoretical knowledge, ensuring students acquire skills
                demanded by the modern workforce. Our mission includes fostering critical
                thinking, ethical values, and lifelong learning. RHIBMS commits to developing
                professionals who contribute positively to society and healthcare innovation.
              </p>
            </div>

            <div className="p-10 bg-white rounded-2xl shadow hover:shadow-xl transition">
              <Globe className="w-12 h-12 text-rhibms-sky-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Vision</h3>
              <p className="text-gray-600">
                To become a leading institution in Africa, recognized for academic excellence
                and innovation. We aim to cultivate leaders in biomedical and management fields,
                foster research that addresses real-world challenges, and inspire students
                to create sustainable impact. RHIBMS envisions a community where knowledge,
                technology, and ethics converge to shape future professionals.
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CHART */}
      <AnimatedSection delay={0.3}>
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                <Area
                  type="monotone"
                  dataKey="totalStudents"
                  stroke="#ef4444"
                  fill="#fee2e2"
                />

                <ReferenceLine y={7000} stroke="green" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </AnimatedSection>

      {/* WHY CHOOSE RHIBMS */}
      <AnimatedSection delay={0.4}>
        <section className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">

            {/* HEADER */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800">
                Why Choose RHIBMS
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Discover what makes RHIBMS a leading institution in biomedical and management education.
              </p>
              <div className="w-24 h-1 bg-rhibms-red-500 mx-auto mt-4 rounded-full" />
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChoose.map((item, i) => (
                <div
                  key={i}
                  className="p-8 bg-white rounded-2xl shadow hover:shadow-2xl hover:-translate-y-2 transition-all"
                >
                  <item.icon className="w-10 h-10 text-rhibms-red-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </AnimatedSection>

      {/* WHAT WE OFFER */}
      <AnimatedSection delay={0.5}>
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4">

            {/* HEADER */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800">
                What We Offer
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Explore our diverse academic programs designed to equip students with practical and professional skills.
              </p>
              <div className="w-24 h-1 bg-rhibms-red-500 mx-auto mt-4 rounded-full" />
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-3 gap-10">
              {programs.map((p, i) => (
                <div
                  key={i}
                  className="p-10 border rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all"
                >
                  <p.icon className="w-10 h-10 text-rhibms-red-600 mb-4" />
                  <h3 className="font-bold text-xl mb-2">{p.title}</h3>
                  <p className="text-gray-600">{p.description}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </AnimatedSection>

      {/* PARTNERS */}
      <AnimatedSection delay={0.6}>
        <PartnerGrid />
      </AnimatedSection>
    </>
  );
}