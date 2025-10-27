import React from 'react';
interface TimerCircleProps {
  timeLeft: number;
  duration: number;
  className?: string;
}
export const TimerCircle: React.FC<TimerCircleProps> = ({ timeLeft, duration, className }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / duration;
  const strokeDashoffset = circumference * (1 - progress);
  const timeColor = timeLeft <= 10 ? 'text-red-500' : 'text-slate-700';
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg className="absolute w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-slate-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-sky-500 transition-all duration-500"
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
      <span className={`text-4xl font-extrabold font-display ${timeColor}`}>
        {timeLeft}
      </span>
    </div>
  );
};