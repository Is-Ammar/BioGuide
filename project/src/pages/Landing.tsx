import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Dna, Rocket, Database, Users, Star } from 'lucide-react';
import Navigation from '../components/Navigation';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated DNA Helix */}
        <motion.div
          className="absolute left-1/4 top-1/4 w-32 h-32 dna-helix opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400">
            <path
              d="M20 10 Q50 30 80 10 Q50 50 20 70 Q50 90 80 70"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M80 30 Q50 50 20 30 Q50 10 80 30 Q50 70 20 90"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </svg>
        </motion.div>

        {/* Floating Particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.5, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        <div className="text-center z-10 max-w-4xl mx-auto">
<motion.h1
  className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-gray-100 via-purple-100 to-emerald-100 bg-clip-text text-transparent"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  FF BioGuide
</motion.h1>
          
          <motion.div
            className="text-xl md:text-2xl text-gray-300 mb-12 font-light leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="mb-4">fauna & flora intersection</p>
            <p className="text-3xl md:text-4xl font-medium bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Space • Biology • Discovery
            </p>
          </motion.div>

          {/* Orbiting CTA Button */}
          <motion.div
            className="relative w-80 h-80 mx-auto mb-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <Link
                to="/dashboard"
                className="block bg-gray-900/80 backdrop-blur-md border border-purple-500/30 px-8 py-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group hover:bg-gray-800/90"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                  <span className="text-gray-100 font-medium group-hover:text-white">Explore Dashboard</span>
                  <motion.div
                    className="text-purple-400 group-hover:text-purple-300"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
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
                className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 p-6 rounded-xl text-center hover:scale-105 transition-all duration-300 shadow-2xl hover:bg-gray-900/80 hover:border-purple-500/30"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                whileHover={{ y: -10 }}
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
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
      </section>
    </div>
  );
};

export default Landing;