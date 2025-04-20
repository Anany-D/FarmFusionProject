import { MotionProps, Variants } from "framer-motion";

// Fade in animation
export const fadeIn: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

// Fade in from bottom animation
export const fadeInUp: MotionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Fade in from left animation
export const fadeInLeft: MotionProps = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

// Fade in from right animation
export const fadeInRight: MotionProps = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

// Scale animation
export const scaleIn: MotionProps = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

// Staggered children animation props
export const staggerContainer = {
  initial: "initial",
  animate: "animate",
  variants: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  } as Variants
};

// Child item for staggered animations
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

// For list animations
export const staggerList = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: delay
    }
  }
});

export const staggerListItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Subtle hover animation for cards
export const cardHover = {
  whileHover: { y: -5, transition: { duration: 0.2 } },
  whileTap: { y: 0 }
};

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Animation for tabs
export const tabVariants = {
  active: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  },
  inactive: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.5 }
  }
};

// For page transitions
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};
