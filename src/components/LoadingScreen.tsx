import { motion } from 'framer-motion';

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/90 to-indigo-950/90 backdrop-blur-sm z-50">
      <div className="text-white text-center px-6 py-4">
        <motion.div
          className="relative mb-8"
          initial="initial"
          animate="animate"
          variants={floatAnimation}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-xl opacity-50 absolute -inset-2" />
          <div className="w-20 h-20 border-4 border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full animate-spin relative" />
        </motion.div>
        
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Loading Island
          </h2>
          <p className="text-sm text-indigo-200/80 max-w-[200px] mx-auto">
            Preparing your magical experience...
          </p>
        </motion.div>

        <motion.div 
          className="mt-8 flex justify-center gap-2"
          variants={fadeInUp} 
          initial="initial" 
          animate="animate"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
