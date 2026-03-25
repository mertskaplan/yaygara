import { m } from 'framer-motion';

interface TimerCircleProps {
  timeLeft: number;
  duration: number;
  color: string;
  className?: string;
  isPaused?: boolean;
  onClick?: () => void;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({
  timeLeft,
  duration,
  color,
  className,
  isPaused = false,
  onClick
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Calculate the target progress. 
  // When active, we animate towards (timeLeft - 1) so that the animation 
  // completes exactly when the next tick occurs 1 second later.
  const targetProgress = isPaused ? timeLeft / duration : Math.max(0, timeLeft - 1) / duration;
  const strokeDashoffset = circumference * (1 - targetProgress);
  const isUrgent = timeLeft <= 10;

  return (
    <div 
      className={`relative flex items-center justify-center ${className} ${onClick ? 'cursor-pointer transition-transform hover:scale-105 active:scale-95' : ''}`}
      onClick={onClick}
    >
      <svg className="absolute w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-slate-200 dark:text-slate-700/50"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <m.circle
          initial={{ strokeDashoffset: circumference * (1 - timeLeft / duration) }}
          animate={{ strokeDashoffset }}
          transition={{ duration: isPaused ? 0.3 : 1, ease: "linear" }}
          style={{ color: isUrgent ? '#ef4444' : color }}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span
        className="text-4xl font-extrabold font-display drop-shadow-sm"
        style={{ color: isUrgent ? '#ef4444' : color }}
      >
        {timeLeft}
      </span>
    </div>
  );
};