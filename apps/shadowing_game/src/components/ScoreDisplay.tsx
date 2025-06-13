import React from "react";

interface ScoreDisplayProps {
  score: number;
  feedback: string;
}

const ScoreDisplay = ({ score, feedback }: ScoreDisplayProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 mb-8 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-2">评分结果</h3>
          <p className="text-indigo-200 max-w-md">{feedback}</p>
        </div>

        <div className="relative">
          <div className="w-40 h-40 rounded-full border-8 border-indigo-900 flex items-center justify-center">
            <div className="text-4xl font-bold">{score}</div>
          </div>
          <div
            className="absolute inset-0 rounded-full border-8 border-transparent border-t-purple-500 border-r-cyan-500 score-spin"
            style={{ clipPath: "circle(50% at 50% 50%)" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
