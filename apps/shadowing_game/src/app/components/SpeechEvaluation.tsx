"use client";
// components/SpeechEvaluation.tsx
import { useState, useEffect } from "react";

// TypeScript declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
type SpeechRecognition = typeof window.SpeechRecognition;

interface SpeechEvaluationProps {
  targetText: string;
  onResult: (score: number, feedback: string) => void;
}

export default function SpeechEvaluation({
  targetText,
  onResult,
}: SpeechEvaluationProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Web Speech API not supported");
        return;
      }

      const recognizer = new SpeechRecognition();
      recognizer.lang = "zh-HK"; // 粤语
      recognizer.interimResults = false;

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const score = calculateSimilarity(transcript, targetText);
        const feedback = generateFeedback(transcript, targetText);
        onResult(score, feedback);
      };

      recognizer.onerror = (event: any) => {
        console.error("Recognition error:", event.error);
      };

      setRecognition(recognizer);
    }

    return () => {
      recognition?.abort();
    };
  }, [targetText]);

  const calculateSimilarity = (text1: string, text2: string): number => {
    // 简单的文本相似度计算
    // 实际项目中可以使用更复杂的算法
    const set1 = new Set(text1.split(""));
    const set2 = new Set(text2.split(""));
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    return intersection.size / Math.max(set1.size, set2.size);
  };

  const generateFeedback = (userText: string, targetText: string): string => {
    // 生成简单反馈
    if (userText === targetText) return "发音准确！";
    return "注意发音差异，请再试一次";
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsListening(!isListening);
  };

  return (
    <div>
      <button onClick={toggleListening}>
        {isListening ? "停止评估" : "开始语音评估"}
      </button>
      <p>目标句子: {targetText}</p>
    </div>
  );
}
