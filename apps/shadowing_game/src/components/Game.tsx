"use client";
import { useState, useRef } from "react";
import WaveRecorder from "@/components/WaveRecorder";
import ScoreDisplay from "@/components/ScoreDisplay";

export default function Game() {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  // const [duration, setDuration] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // 处理录音完成
  const handleRecordingComplete = (score: number, feedback: string) => {
    setScore(score);
    setFeedback(feedback);
    setShowScore(true);
  };

  // 重置评分
  const resetScore = () => {
    setScore(0);
    setFeedback("");
    setShowScore(false);
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <WaveRecorder
          onRecordingComplete={handleRecordingComplete}
          onReset={resetScore}
        />

        {showScore && <ScoreDisplay score={score} feedback={feedback} />}
      </main>
    </div>
  );
}
