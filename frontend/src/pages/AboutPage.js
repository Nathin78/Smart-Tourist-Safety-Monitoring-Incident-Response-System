import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiShield,
  FiSmartphone,
  FiUsers,
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import ThemeToggleButton from '../components/ThemeToggleButton';

const values = [
  {
    icon: FiMapPin,
    title: 'Live visibility',
    description: 'Keep tourists, routes, and safety zones visible on a single live map.',
  },
  {
    icon: FiSmartphone,
    title: 'Fast SOS response',
    description: 'Enable quick emergency reporting with an easy escalation path.',
  },
  {
    icon: FiShield,
    title: 'Safer travel zones',
    description: 'Use geofences to protect popular destinations and high-risk areas.',
  },
  {
    icon: FiUsers,
    title: 'People-first design',
    description: 'Help admins respond faster while keeping the system simple for tourists.',
  },
];

const milestones = [
  'Tourists register once and stay connected throughout the trip.',
  'Admins monitor incidents, SOS requests, and safe zones in real time.',
  'The platform helps improve response speed and travel confidence.',
];

const AboutPage = () => {
  const { token, isAdmin } = useContext(AuthContext);
  const ctaPath = token ? (isAdmin ? '/admin' : '/dashboard') : '/login';

  return (
    <div className="min-h-screen text-[#343148]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#343148]/70">
            Smart Tourist Safety
          </p>
          <h1 className="text-2xl font-bold text-[#343148]">About Us</h1>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-[#343148]/15 bg-white/65 px-2 py-2 shadow-sm md:flex">
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#343148]/75 transition hover:bg-[#efe4c8] hover:text-[#343148]"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#343148] transition hover:bg-[#efe4c8]"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#343148]/75 transition hover:bg-[#efe4c8] hover:text-[#343148]"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#343148]/20 bg-[#f7f0df] px-5 py-2.5 text-sm font-semibold text-[#343148] transition hover:bg-[#efe4c8]"
          >
            <FiArrowLeft size={16} />
            Back Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-[#343148]/15 bg-[#f7f0df]/95 p-8 shadow-xl sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#d7c49e]/30 px-4 py-2 text-sm font-semibold text-[#343148]">
              <FiClock size={16} />
              Built for safer journeys
            </div>
            <h2 className="mt-6 text-4xl font-bold leading-tight text-[#343148] sm:text-5xl">
              A tourism safety platform designed to protect travelers and support responders.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#343148]/80">
              Smart Tourist Safety Monitoring brings together live tracking, incident reporting,
              SOS alerts, and geofence-based safety zones so teams can act quickly and clearly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={ctaPath}
                className="inline-flex items-center gap-2 rounded-full bg-[#343148] px-6 py-3 text-sm font-semibold text-[#f7f0df] shadow-lg transition hover:bg-[#272436]"
              >
                Continue
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-[#343148]/20 bg-white px-6 py-3 text-sm font-semibold text-[#343148] transition hover:bg-[#efe4c8]"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['Live', 'Tracking'],
                ['SOS', 'Alerts'],
                ['Safety', 'Zones'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#343148]/10 bg-white/80 p-4 text-center shadow-sm"
                >
                  <div className="text-2xl font-bold text-[#343148]">{value}</div>
                  <div className="mt-1 text-sm text-[#343148]/70">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-[1.5rem] border border-[#343148]/15 bg-white/90 p-5 shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d7c49e]/30 text-[#343148]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#343148]">{value.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#343148]/75">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-[#343148]/15 bg-[#343148] p-8 text-[#f7f0df] shadow-xl sm:p-10">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {milestones.map((item, index) => (
              <div key={item} className="rounded-2xl bg-white/10 p-5">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d7c49e] font-bold text-[#343148]">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-[#f7f0df]/90">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
