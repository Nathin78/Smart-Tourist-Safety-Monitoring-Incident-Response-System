import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAlertTriangle,
  FiArrowRight,
  FiChevronRight,
  FiMapPin,
  FiShield,
  FiSmartphone,
  FiUserCheck,
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import ThemeToggleButton from '../components/ThemeToggleButton';

const highlights = [
  {
    icon: FiMapPin,
    title: 'Live location tracking',
    description: 'Follow tourist movement in real time with clear map visibility.',
  },
  {
    icon: FiAlertTriangle,
    title: 'Instant incident reporting',
    description: 'Report issues quickly so the right response can start faster.',
  },
  {
    icon: FiShield,
    title: 'Safe zone monitoring',
    description: 'Protect travel routes with geofences and zone-based alerts.',
  },
  {
    icon: FiSmartphone,
    title: 'SOS support',
    description: 'Give tourists a one-tap emergency path when it matters most.',
  },
];

const steps = [
  'Tourists register their details and emergency contacts.',
  'The system tracks live movement and safe-zone status.',
  'Admins see incidents, SOS alerts, and geofence activity instantly.',
];

const LandingPage = () => {
  const { token, isAdmin } = useContext(AuthContext);
  const primaryPath = token ? (isAdmin ? '/admin' : '/dashboard') : '/login';

  return (
    <div className="min-h-screen text-[#343148]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#343148] text-[#d7c49e] shadow-lg">
            <FiUserCheck size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#343148]/70">
              Smart Tourist Safety
            </p>
            <h1 className="text-2xl font-bold text-[#343148]">TouristSafe</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-[#343148]/15 bg-white/65 px-2 py-2 shadow-sm md:flex">
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#343148] transition hover:bg-[#efe4c8]"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#343148]/75 transition hover:bg-[#efe4c8] hover:text-[#343148]"
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
            to={primaryPath}
            className="hidden rounded-full border border-[#343148]/20 bg-[#f7f0df] px-5 py-2.5 text-sm font-semibold text-[#343148] transition hover:bg-[#efe4c8] sm:inline-flex"
          >
            {token ? 'Open Dashboard' : 'Login'}
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-[#343148] px-5 py-2.5 text-sm font-semibold text-[#f7f0df] shadow-lg transition hover:bg-[#272436]"
          >
            Register
            <FiArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-[#343148]/15 bg-[#f7f0df]/95 p-8 shadow-xl sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#d7c49e]/30 px-4 py-2 text-sm font-semibold text-[#343148]">
              <FiShield size={16} />
              Safe travel starts here
            </div>

            <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight text-[#343148] sm:text-5xl">
              Protect tourists with live tracking, SOS alerts, and smart safe zones.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#343148]/80">
              Monitor travelers, reduce response time, and keep every journey visible with one
              central safety platform built for tourism teams and administrators.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={primaryPath}
                className="inline-flex items-center gap-2 rounded-full bg-[#343148] px-6 py-3 text-sm font-semibold text-[#f7f0df] shadow-lg transition hover:bg-[#272436]"
              >
                {token ? 'Go to Dashboard' : 'Get Started'}
                <FiArrowRight size={16} />
              </Link>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-full border border-[#343148]/20 bg-white px-6 py-3 text-sm font-semibold text-[#343148] transition hover:bg-[#efe4c8]"
              >
                View Live Map
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-[#343148]/70">
              <Link to="/about" className="inline-flex items-center gap-1 hover:text-[#343148]">
                About Us <FiChevronRight size={14} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-1 hover:text-[#343148]">
                Contact <FiChevronRight size={14} />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['24/7', 'Monitoring'],
                ['SOS', 'Response path'],
                ['Safe zones', 'Geofence alerts'],
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

          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-[#343148]/15 bg-[#343148] p-8 text-[#f7f0df] shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d7c49e]">
                Platform Overview
              </p>
              <h3 className="mt-4 text-3xl font-bold">Everything your safety team needs</h3>
              <p className="mt-4 text-base leading-7 text-[#f7f0df]/85">
                A clean dashboard for tourists, live maps, incidents, emergency SOS handling,
                and geofence-based protection.
              </p>

              <div className="mt-8 space-y-4">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-start gap-4 rounded-2xl bg-white/10 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d7c49e] font-bold text-[#343148]">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-[#f7f0df]/90">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-[#343148]/15 bg-white/90 p-5 shadow-lg"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d7c49e]/30 text-[#343148]">
                      <Icon size={20} />
                    </div>
                    <h4 className="mt-4 text-lg font-bold text-[#343148]">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[#343148]/75">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 rounded-[1.75rem] border border-[#343148]/15 bg-white/70 px-6 py-5 text-sm text-[#343148]/70 shadow-lg sm:flex-row">
          <p>Smart Tourist Safety Monitoring for safer travel and faster response.</p>
          <div className="flex items-center gap-4 font-semibold">
            <Link to="/about" className="hover:text-[#343148]">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-[#343148]">
              Contact
            </Link>
            <Link to="/login" className="hover:text-[#343148]">
              Login
            </Link>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default LandingPage;
