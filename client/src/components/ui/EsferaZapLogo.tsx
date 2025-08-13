import { motion } from "framer-motion";

interface EsferaZapLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export function EsferaZapLogo({ size = 40, animated = true, className = "" }: EsferaZapLogoProps) {
  const logoVariants = {
    initial: { rotate: 0, scale: 1 },
    animate: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 3,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  const sphereVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 3,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      variants={animated ? logoVariants : undefined}
      initial={animated ? "initial" : undefined}
      animate={animated ? "animate" : undefined}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente InsightEsfera */}
          <radialGradient id="insightGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="30%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>
          
          {/* Gradiente WhatsApp */}
          <radialGradient id="whatsappGradient" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#25d366" />
            <stop offset="50%" stopColor="#128c7e" />
            <stop offset="100%" stopColor="#075e54" />
          </radialGradient>
          
          {/* Gradiente misto */}
          <linearGradient id="mixedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25d366" />
            <stop offset="25%" stopColor="#128c7e" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
        </defs>

        {/* Círculo de fundo com gradiente WhatsApp */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#whatsappGradient)"
          opacity="0.1"
        />

        {/* Rede de conexões estilo InsightEsfera */}
        <motion.g
          variants={animated ? sphereVariants : undefined}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
        >
          {/* Linhas de conexão */}
          <path
            d="M20 30 L35 45 L50 25 L65 40 L80 35"
            stroke="url(#insightGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M25 60 L40 50 L55 70 L70 55 L85 65"
            stroke="url(#insightGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M30 20 L50 35 L70 25 L50 45 L30 55 L50 65"
            stroke="url(#insightGradient)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
          
          {/* Nós da rede */}
          <circle cx="35" cy="45" r="3" fill="url(#insightGradient)" />
          <circle cx="50" cy="25" r="4" fill="url(#insightGradient)" />
          <circle cx="65" cy="40" r="3" fill="url(#insightGradient)" />
          <circle cx="40" cy="50" r="3" fill="url(#insightGradient)" />
          <circle cx="55" cy="70" r="3" fill="url(#insightGradient)" />
          <circle cx="70" cy="55" r="3" fill="url(#insightGradient)" />
        </motion.g>

        {/* Ícone WhatsApp estilizado no centro */}
        <g transform="translate(50, 50)">
          {/* Balão de conversa principal */}
          <path
            d="M -15 -8 C -15 -12 -12 -15 -8 -15 L 8 -15 C 12 -15 15 -12 15 -8 L 15 0 C 15 4 12 7 8 7 L -5 7 L -12 12 L -12 7 C -13.5 7 -15 5.5 -15 4 Z"
            fill="url(#mixedGradient)"
          />
          
          {/* Pontos de conversa */}
          <circle cx="-6" cy="-4" r="1.5" fill="white" opacity="0.9" />
          <circle cx="0" cy="-4" r="1.5" fill="white" opacity="0.9" />
          <circle cx="6" cy="-4" r="1.5" fill="white" opacity="0.9" />
          
          {/* Indicador de IA (pequena esfera) */}
          <circle cx="8" cy="-8" r="2.5" fill="url(#insightGradient)" opacity="0.8" />
          <circle cx="8" cy="-8" r="1" fill="white" />
        </g>

        {/* Orbit rings estilo InsightEsfera */}
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          stroke="url(#mixedGradient)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
          animate={animated ? { rotate: 360 } : undefined}
          transition={animated ? { duration: 20, ease: "linear", repeat: Infinity } : undefined}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#mixedGradient)"
          strokeWidth="0.3"
          fill="none"
          opacity="0.2"
          animate={animated ? { rotate: -360 } : undefined}
          transition={animated ? { duration: 30, ease: "linear", repeat: Infinity } : undefined}
        />
      </svg>
    </motion.div>
  );
}

export default EsferaZapLogo;