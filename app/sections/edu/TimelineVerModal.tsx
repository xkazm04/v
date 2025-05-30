import { motion } from "framer-motion";
import { MilestoneEvent } from "./TimelineVertical";
import TimelineModalPerspectives from "./TimelineModalDimensions";

const TimelineVerModal = ({ event, onClose }: { event: MilestoneEvent, onClose: () => void }) => {
  const panelColors = [
    { 
      bg: "bg-chart-1/10", 
      border: "border-chart-1/30", 
      text: "text-chart-1",
      accent: "bg-chart-1"
    },
    { 
      bg: "bg-chart-2/10", 
      border: "border-chart-2/30", 
      text: "text-chart-2",
      accent: "bg-chart-2"
    },
    { 
      bg: "bg-chart-3/10", 
      border: "border-chart-3/30", 
      text: "text-chart-3",
      accent: "bg-chart-3"
    },
    { 
      bg: "bg-chart-4/10", 
      border: "border-chart-4/30", 
      text: "text-chart-4",
      accent: "bg-chart-4"
    }
  ];

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-card rounded-lg p-8 max-w-4xl w-full mx-4 text-card-foreground border border-border shadow-2xl"
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
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-primary mb-2">{event.title}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
        </div>
        
        {/* Main description */}
        <motion.div 
          className="mb-6 bg-muted/30 p-4 rounded-lg border-l-4 border-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </motion.div>

        {/* Reference link */}
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
              className="text-primary hover:text-primary/80 flex items-center text-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Reference
            </a>
          </motion.div>
        )}
        
        {/* Perspectives Grid */}
        <TimelineModalPerspectives
          event={event}
          panelColors={panelColors}
          />

        {/* Close button */}
        <motion.div 
          className="flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            <span>Close</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TimelineVerModal;