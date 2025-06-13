"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import category from "@/data/category";
import Game from "@/components/Game";
// import { useQuestionStore } from "@/stores/questionStore";

export default function GameDetail({ params }: any) {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const goBack = () => {
    router.push("/game");
  };
  useEffect(() => {
    const ques: any = category[params.slug]?.questions || [];
    setQuestions(ques);
  }, []);
  return (
    <div className="">
      <button onClick={goBack}>返回</button>
      <div className="wrapper">
        <div>原文</div>
        <div className="text-content">
          {questions &&
            questions.map((item: any, index: number) => (
              <>
                <div key={index} className="text-item">
                  {item.content}
                </div>
                <audio src="../public/audio/粤语语料1.m4a">播放</audio>
              </>
            ))}
        </div>
        <Game />
      </div>
    </div>
  );
}
