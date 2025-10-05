
import Navigation from '../components/Navigation';
import LiquidEther from '../components/LiquidEther';
import Globe from '../components/Globe';
import { motion } from 'framer-motion';
import { Database, Rocket, Dna } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: 'easeOut' } }
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } }
};

const Landing = () => {
  return (
  <div className="relative min-h-screen w-full overflow-hidden bg-semantic-surface-0 text-semantic-text-primary transition-colors">
      <div className="absolute inset-0" aria-hidden>
        <LiquidEther
          colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
          mouseForce={20}
          cursorSize={110}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
            iterationsPoisson={32}
          resolution={0.55}
          isBounce={false}
          autoDemo
          autoSpeed={0.55}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          className="select-none"
        />
  <div className="pointer-events-none absolute inset-0 mix-blend-multiply dark:mix-blend-normal bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(0,0,0,0.55)_85%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.65)_90%)] transition-colors" />
      </div>

      <div className="relative z-20">
        <Navigation />
      </div>

      <motion.div
  className="relative z-10 flex flex-col items-center justify-start text-center px-6 pt-28 pb-8 h-screen overflow-hidden"
        variants={staggerParent}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-semantic-text-primary via-accent/90 to-accent-alt/80 dark:from-purple-200 dark:via-white dark:to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-colors"
          variants={fadeInUp}
        >
          FF BioGuide
        </motion.h1>
  <motion.p className="mt-6 text-lg md:text-2xl text-semantic-text-secondary font-light" variants={fadeInUp}>
          fauna & flora intersection
        </motion.p>
        <motion.p
          className="mt-2 text-2xl md:text-3xl font-medium bg-gradient-to-r from-accent-alt via-accent to-accent-alt/80 dark:from-emerald-400 dark:via-purple-300 dark:to-fuchsia-400 bg-clip-text text-transparent transition-colors"
          variants={fadeInUp}
        >
          Space • Biology • Discovery
        </motion.p>

        <motion.div className="mt-16" variants={fadeInUp}>
          <div className="relative">
            <Globe size={320} />
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_70%)] mix-blend-overlay transition-colors" />
          </div>
        </motion.div>

        <motion.div
          className="mt-24 grid w-full max-w-5xl grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerParent}
        >
          {[
            { icon: Database, title: 'Vast Collection', description: 'Thousands of space biology publications and datasets' },
            { icon: Rocket, title: 'Mission Data', description: 'Research from ISS, Bion-M, and other space missions' },
            { icon: Dna, title: 'Biological Focus', description: 'Molecular biology, physiology, and life sciences in space' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl text-center transition-all duration-300 shadow-2xl border backdrop-blur-md bg-semantic-surface-1/80 border-semantic-border-muted hover:border-semantic-border-accent hover:bg-semantic-surface-2/80 "
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.03, transition: { type: 'spring', stiffness: 260, damping: 18 } }}
            >
              <feature.icon
                className={`w-12 h-12 mx-auto mb-4 ${
                  index === 0 ? 'text-emerald-400' : index === 1 ? 'text-purple-400' : 'text-orange-400'
                }`}
              />
              <h3 className="text-xl font-semibold mb-2 text-semantic-text-primary">{feature.title}</h3>
              <p className="text-semantic-text-secondary text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-semantic-surface-0 to-transparent dark:from-black/90" />
    </div>
  );
};

export default Landing;