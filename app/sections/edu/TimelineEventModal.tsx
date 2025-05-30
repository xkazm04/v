import { motion } from "framer-motion";
import { useState } from "react";
import { MilestoneEvent } from "./EduLayout";

const TimelineEventModal = ({ event, onClose }: { event: MilestoneEvent, onClose: () => void }) => {
  // Track active panel for mobile view
  const [activePanel, setActivePanel] = useState<number | null>(null);

  // Generate unique color schemes for each text panel
  const panelColors = [
    { bg: "from-blue-900/40 to-blue-800/30", border: "border-blue-700", text: "text-blue-100" },
    { bg: "from-emerald-900/40 to-emerald-800/30", border: "border-emerald-700", text: "text-emerald-100" },
    { bg: "from-amber-900/40 to-amber-800/30", border: "border-amber-700", text: "text-amber-100" },
    { bg: "from-purple-950/70 to-purple-900/70", border: "border-purple-700", text: "text-purple-100" }
  ];

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-900 rounded-lg p-8 max-w-4xl w-full mx-4 text-white border border-gray-700 shadow-2xl backdrop-blur-sm bg-opacity-95"
        initial={{ scale: 0.5, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.5, y: 50, opacity: 0 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with gradient underline */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">{event.title}</h2>
        </div>
        
        {/* Main description - styled as a scrollable window with darker background */}
        <motion.div 
          className="mb-4 bg-gray-950 p-3 rounded-lg border-l-2 border-blue-800 shadow-lg text-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-gray-200 leading-relaxed tracking-wide text-sm">{event.description}</p>
        </motion.div>

        {/* Reference link if available */}
        {event.reference_url && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a 
              href={event.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Reference
            </a>
          </motion.div>
        )}
        
        
        {/* Text panels section */}
        {(event.text_1 || event.text_2 || event.text_3 || event.text_4) && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Dimensions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.text_1 && (
                <motion.div 
                  className={`relative bg-gradient-to-br ${panelColors[0].bg} p-5 rounded-lg shadow-xl hover:shadow-blue-900/30 transition-all duration-300 ${panelColors[0].border} border`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 20px 25px -5px rgba(30, 64, 175, 0.2), 0 10px 10px -5px rgba(30, 64, 175, 0.1)'
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-blue-600/10"></div>
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-400/70"></div>
                  <div className="absolute top-6 right-6 w-1 h-1 rounded-full bg-blue-300/70"></div>
                  
                  <p className={`${panelColors[0].text} relative z-10`}>{event.text_1}</p>
                  <div className="w-16 h-0.5 bg-blue-500/50 mt-3"></div>
                  <div className="text-xs text-blue-400/70 mt-2 font-medium">Perspective 1</div>
                </motion.div>
              )}
              
              {event.text_2 && (
                <motion.div 
                  className={`relative bg-gradient-to-br ${panelColors[1].bg} p-5 rounded-lg shadow-xl hover:shadow-emerald-900/30 transition-all duration-300 ${panelColors[1].border} border`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.2), 0 10px 10px -5px rgba(16, 185, 129, 0.1)'
                  }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 w-16 h-16 rounded-br-full bg-emerald-600/10"></div>
                  <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-emerald-400/70"></div>
                  <div className="absolute top-6 left-6 w-1 h-1 rounded-full bg-emerald-300/70"></div>
                  
                  <p className={`${panelColors[1].text} relative z-10`}>{event.text_2}</p>
                  <div className="w-16 h-0.5 bg-emerald-500/50 mt-3"></div>
                  <div className="text-xs text-emerald-400/70 mt-2 font-medium">Perspective 2</div>
                </motion.div>
              )}
              
              {event.text_3 && (
                <motion.div 
                  className={`relative bg-gradient-to-br ${panelColors[2].bg} p-5 rounded-lg shadow-xl hover:shadow-amber-900/30 transition-all duration-300 ${panelColors[2].border} border`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 20px 25px -5px rgba(217, 119, 6, 0.2), 0 10px 10px -5px rgba(217, 119, 6, 0.1)'
                  }}
                >
                  {/* Decorative pattern */}
                  <div className="absolute bottom-0 right-0 w-16 h-16 rounded-tl-full bg-amber-600/10"></div>
                  <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-amber-400/70"></div>
                  <div className="absolute bottom-6 right-6 w-1 h-1 rounded-full bg-amber-300/70"></div>
                  
                  <p className={`${panelColors[2].text} relative z-10`}>{event.text_3}</p>
                  <div className="w-16 h-0.5 bg-amber-500/50 mt-3"></div>
                  <div className="text-xs text-amber-400/70 mt-2 font-medium">Perspective 3</div>
                </motion.div>
              )}
              
              {event.text_4 && (
                <motion.div 
                  className={`relative bg-gradient-to-br ${panelColors[3].bg} p-5 rounded-lg shadow-xl hover:shadow-purple-900/30 transition-all duration-300 ${panelColors[3].border} border`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ 
                    y: -4,
                    boxShadow: '0 20px 25px -5px rgba(126, 34, 206, 0.2), 0 10px 10px -5px rgba(126, 34, 206, 0.1)'
                  }}
                >
                  {/* Decorative pattern */}
                  <div className="absolute bottom-0 left-0 w-16 h-16 rounded-tr-full bg-purple-600/10"></div>
                  <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-purple-400/70"></div>
                  <div className="absolute bottom-6 left-6 w-1 h-1 rounded-full bg-purple-300/70"></div>
                  
                  <p className={`${panelColors[3].text} relative z-10`}>{event.text_4}</p>
                  <div className="w-16 h-0.5 bg-purple-500/50 mt-3"></div>
                  <div className="text-xs text-purple-400/70 mt-2 font-medium">Perspective 4</div>
                </motion.div>
              )}
            </div>
          </div>
        )}
        

        {/* Close button */}
        <motion.div 
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-md shadow-lg hover:shadow-blue-600/50 transition-all duration-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            <span>Close</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TimelineEventModal;