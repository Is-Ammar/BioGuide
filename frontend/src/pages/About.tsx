import React from 'react';
import { motion } from 'framer-motion';
import { Github, MapPin, Users } from 'lucide-react';

interface TeamMember {
  name: string;
  handle: string;
  country: string;
  role?: string;
}

const team: TeamMember[] = [
  { name: 'ismail ammar', handle: '@0xjiren', country: 'Morocco', role: 'front-end developer' },
  { name: 'Marouane Brouk', handle: '@marouanebrouk', country: 'Morocco', role: 'back-end developer' },
  { name: 'El Bouzidi Youssef', handle: '@authyx', country: 'Morocco', role: 'back-end developer' },
  { name: 'Ayoub diri', handle: '@adiri', country: 'Morocco', role: 'ai researcher' },
  { name: 'AKARKAOU MOHAMMED', handle: '@makarkao', country: 'Morocco', role: 'ui/ux designer' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const About: React.FC = () => {
  return (
    <div className="pt-28 pb-24 px-4 md:px-10 max-w-6xl mx-auto text-semantic-text-primary">
      <div className="relative mb-14">
        <div className="absolute -inset-4 bg-gradient-to-tr from-cosmic-400/10 via-bio-400/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cosmic-400 via-bio-400 to-cosmic-400 bg-clip-text text-transparent"
        >
          About BioGuide
        </motion.h1>
        <p className="mt-6 max-w-3xl text-base md:text-lg text-semantic-text-secondary leading-relaxed">
          BioGuide is a modern platform crafted to help researchers, students, and curious minds navigate the vast landscape of biomedical literature. We focus on a clean exploration experience, contextual insight, and fluid interaction—bringing clarity to complex scientific data.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 mb-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative p-6 rounded-2xl border border-semantic-border-muted bg-semantic-surface-1/80 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-400/10 to-transparent opacity-50 pointer-events-none" />
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" /> Mission
          </h2>
          <p className="text-sm text-semantic-text-secondary leading-relaxed">
            Empower deeper understanding of biomedical research by merging structured data, semantic exploration, and an AI-assisted interface that stays transparent and user-centric.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative p-6 rounded-2xl border border-semantic-border-muted bg-semantic-surface-1/80 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-bio-400/10 to-transparent opacity-50 pointer-events-none" />
          <h2 className="text-xl font-semibold mb-3">Values</h2>
          <ul className="space-y-2 text-sm text-semantic-text-secondary">
            <li><span className="text-accent font-medium">Clarity:</span> Reduce cognitive load with minimal friction.</li>
            <li><span className="text-accent font-medium">Trust:</span> Keep interactions explainable and secure.</li>
            <li><span className="text-accent font-medium">Velocity:</span> Fast iteration on research insights.</li>
            <li><span className="text-accent font-medium">Craft:</span> Careful attention to micro-interactions & accessibility.</li>
          </ul>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative p-6 rounded-2xl border border-semantic-border-muted bg-semantic-surface-1/80 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-400/5 via-bio-400/10 to-transparent opacity-50 pointer-events-none" />
          <h2 className="text-xl font-semibold mb-3">Focus</h2>
          <p className="text-sm text-semantic-text-secondary leading-relaxed">
            We iterate on search relevance, intuitive exploration modes, and AI-guided summarization—while keeping you in control of context.
          </p>
        </motion.div>
      </div>

      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-cosmic-400/20 blur-3xl opacity-30" />
        <div className="absolute top-20 right-10 w-56 h-56 rounded-full bg-bio-400/10 blur-3xl opacity-30" />
        <h2 className="text-2xl md:text-4xl font-bold mb-10 tracking-tight">Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((m) => (
            <motion.div
              key={m.handle}
              variants={item}
              className="group relative p-5 rounded-2xl border border-semantic-border-muted hover:border-semantic-border-accent/70 bg-semantic-surface-1/70 backdrop-blur-xl transition-colors overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-cosmic-400/15 via-bio-400/10 to-transparent" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  {m.role && <span className="inline-block mb-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full bg-semantic-surface-2/70 border border-semantic-border-accent/40 text-accent">{m.role}</span>}
                  <h3 className="text-lg font-semibold leading-tight">{m.name}</h3>
                </div>
              </div>
              <div className="space-y-2 text-sm text-semantic-text-secondary">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-accent" />
                  <span className="font-mono tracking-tight">{m.handle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>{m.country}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="mt-24 text-xs text-semantic-text-dim">
        Built with care by the BioGuide team. UI interactions inspired by modern research tooling aesthetics.
      </div>
    </div>
  );
};

export default About;
