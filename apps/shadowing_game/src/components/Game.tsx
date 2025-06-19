"use client";
import { useState, useRef } from "react";
import WaveRecorder from "@/components/WaveRecorder";
import ScoreDisplay from "@/components/ScoreDisplay";
import CelebrationEffect from "@/components/CelebrationEffect";

export default function Game({ getResult }: any) {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showScore, setShowScore] = useState(false);

  // 处理录音完成
  const handleRecordingComplete = (score: number, feedback: string) => {
    setScore(score);
    getResult(score);
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
    <main className="container mx-auto py-8 max-w-4xl">
      {score > 70 && (
        <CelebrationEffect type={"confetti"} message={"发音很棒"} />
      )}
      <WaveRecorder
        onRecordingComplete={handleRecordingComplete}
        onReset={resetScore}
      />
      {showScore && <ScoreDisplay score={score} feedback={feedback} />}
    </main>
  );
}
