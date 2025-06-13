"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import category from "@/data/category";
import Game from "@/components/Game";
import Footer from "@/components/Footer";

export default function FolllowPageDetail({ params }: any) {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const goBack = () => {
    router.push("/follow");
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
                <div key={index} className="text-item mt-9 py-8 px-5 border-3 rounded-2xl border-green-200">
                  {item.content}
                </div>
                <audio src="../public/audio/粤语语料1.m4a">播放</audio>
              </>
            ))}
        </div>
        <Game />
      </div>
      <Footer />
    </div>
  );
}
