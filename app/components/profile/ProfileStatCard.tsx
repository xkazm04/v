import { motion } from "framer-motion";
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isDark: boolean;
}

const ProfileStatCard: React.FC<StatCardProps> = ({ icon, label, value, isDark }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`
      p-3 rounded-lg text-center transition-colors duration-300
      ${isDark ? 
        'bg-slate-700/50 hover:bg-slate-600/50' : 
        'bg-vintage-cream/50 hover:bg-vintage-gold/20'
      }
    `}
  >
    <div className={`
      flex justify-center mb-1
      ${isDark ? 'text-purple-400' : 'text-vintage-forest'}
    `}>
      {icon}
    </div>
    <div className={`
      text-lg font-bold
      ${isDark ? 'text-white' : 'text-vintage-charcoal'}
    `}>
      {value}
    </div>
    <div className={`
      text-xs
      ${isDark ? 'text-gray-400' : 'text-vintage-sepia/80'}
    `}>
      {label}
    </div>
  </motion.div>
);

export default ProfileStatCard