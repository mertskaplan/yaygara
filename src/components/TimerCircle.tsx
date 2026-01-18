import React from 'react';
interface TimerCircleProps {
  timeLeft: number;
  duration: number;
  color: string;
  className?: string;
}
export const TimerCircle: React.FC<TimerCircleProps> = ({ timeLeft, duration, color, className }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / duration;
  const strokeDashoffset = circumference * (1 - progress);
  const isUrgent = timeLeft <= 10;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
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
        <circle
          className="transition-all duration-500"
          style={{ color: isUrgent ? '#ef4444' : color }}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
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