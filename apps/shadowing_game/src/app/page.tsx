"use client";
import Recorder from "./components/Recorder";
import SpeechEvaluation from "./components/SpeechEvaluation";

export default function Home() {
  const getCallback= ()=> {
    return (score: number, feedback: string) => {
      console.log("得分:", score);
      console.log("反馈:", feedback);
    };
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Recorder />
      <SpeechEvaluation targetText="无锡" onResult={getCallback()}/>
    </div>
  );
}
