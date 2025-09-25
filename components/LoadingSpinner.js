import { motion } from 'framer-motion';
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="rounded-full h-8 w-8 border-b-2 border-indigo-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      ></motion.div>
    </div>
  );
}