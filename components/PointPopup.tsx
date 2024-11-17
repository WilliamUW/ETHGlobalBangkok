import { motion } from 'framer-motion'

interface PointPopupProps {
  isVisible: boolean
  points: number
}

export function PointPopup({ isVisible, points }: PointPopupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
    >
      <p className="text-lg font-bold">+{points} Points!</p>
      <p>Thank you for adding a record!</p>
    </motion.div>
  )
}