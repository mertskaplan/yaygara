import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Word } from '@/types';
interface WordCardProps {
  word: Word;
}
const cardVariants: Variants = {
  hidden: { y: 50, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } },
};
export const WordCard: React.FC<WordCardProps> = ({ word }) => {
  return (
    <motion.div
      key={word.term}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 text-center"
    >
      <h2 className="text-4xl font-extrabold text-slate-800 font-display tracking-tight">
        {word.term}
      </h2>
      <p className="text-slate-500 mt-4 text-lg">{word.hint}</p>
      <div className="flex justify-center items-center mt-6">
        <div className="flex items-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <Star
              key={i}
              className={`w-8 h-8 ${i < word.difficulty ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};