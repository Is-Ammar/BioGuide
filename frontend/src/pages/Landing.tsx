import React from 'react';
import { motion } from 'framer-motion';
import { Dna, Rocket, Database } from 'lucide-react';
import Navigation from '../components/Navigation';
import Globe from '../components/Globe';


const fadeInUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: 'easeOut' } }
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

const featureVariant = fadeInUp;

const Landing = () => {
  return (
    <div
      className="min-h-screen bg-gray-950 overflow-hidden relative"
      style={{
        backgroundImage: 'url(https://i.imgur.com/4fFEQts.png)',
        backgroundSize: '25px',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '15% 15%',
        filter: 'brightness(0.9)',
      }}
    >
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Floating Particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-50"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            initial={{ opacity: 0 }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.6, 0.25],
              scale: [1, 1.15, 1],
              transition: { duration: 5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }
            }}
          />
        ))}

        <motion.div
          className="text-center z-10 max-w-4xl mx-auto relative"
          variants={staggerParent}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-gray-100 via-purple-100 to-emerald-100 bg-clip-text text-transparent"
            variants={fadeInUp}
          >
            FF BioGuide
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-gray-300 mb-12 font-light leading-relaxed"
            variants={fadeInUp}
          >
            <p className="mb-4">fauna & flora intersection</p>
            <p className="text-3xl md:text-4xl font-medium bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Space • Biology • Discovery
            </p>
          </motion.div>

          {/* Globe */}
          <motion.div
            className="mx-auto mb-16 flex items-center justify-center"
            variants={fadeInUp}
          >
            <Globe size={320} />
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={staggerParent}
          >
            {[
              {
                icon: Database,
                title: "Vast Collection",
                description: "Thousands of space biology publications and datasets"
              },
              {
                icon: Rocket,
                title: "Mission Data",
                description: "Research from ISS, Bion-M, and other space missions"
              },
              {
                icon: Dna,
                title: "Biological Focus",
                description: "Molecular biology, physiology, and life sciences in space"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 p-6 rounded-xl text-center transition-colors duration-300 shadow-2xl hover:bg-gray-900/80 hover:border-purple-500/30"
                variants={featureVariant}
                whileHover={{ y: -8, scale: 1.03, transition: { type: 'spring', stiffness: 260, damping: 18 } }}
              >
                <feature.icon className={`w-12 h-12 mx-auto mb-4 ${
                  index === 0 ? 'text-emerald-400' : 
                  index === 1 ? 'text-purple-400' : 
                  'text-orange-400'
                }`} />
                <h3 className="text-xl font-semibold mb-2 text-gray-100">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
      </section>
    </div>
  );
};

export default Landing;