import { useEffect } from "react";

interface TimerProps {
  duration: number;
  currentQuestion: number;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

const Timer: React.FC<TimerProps> = ({ duration, currentQuestion, timeLeft, setTimeLeft }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = (timeLeft / duration) * circumference;

  useEffect(() => {
    setTimeLeft(duration);
  }, [currentQuestion, duration]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const getStrokeColor = () => {
    if (timeLeft > duration * 0.6) return "#16a34a";
    if (timeLeft > duration * 0.3) return "#eab308";
    return "#dc2626";
  };

  return (
    <div className="flex justify-center items-center">
      <svg width="40" height="40" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="30px"
          fill="black"
          className="font-semibold"
        >
          {timeLeft}s
        </text>
      </svg>
    </div>
  );
};

export default Timer;
