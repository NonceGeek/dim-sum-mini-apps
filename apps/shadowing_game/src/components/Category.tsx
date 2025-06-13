"use client";
import { useState, useRef } from "react";
import category from "@/data/category";
import { useRouter } from "next/navigation";
import { useQuestionStore } from "@/stores/questionStore";

type CategoryItem = {
  key: string;
  questions: [];
};

export default function Category({ params }: any) {
  const { setQuestions } = useQuestionStore();
  const router = useRouter();
  // console.log("params", params.slug);
  const pathname = window?.location?.pathname;
  console.log(pathname === "/game" ? "/game/" : "/follow/");
  const start: any = (item: CategoryItem) => {
    setQuestions(item.questions);
    router.push(pathname === "/game" ? "/game/" : "/follow/" + item?.key);
  };
  return (
    <div className="m-4">
      {category.map((item, index) => (
        <div
          key={index}
          className="flex justify-center items-center mt-2 p-4 w-full border-3 rounded-2xl border-green-200"
        >
          <div className="w-1/2 text-center">
            <p>{item.name}</p>
            <button onClick={() => start(item)}>开始</button>
          </div>
        </div>
      ))}
    </div>
  );
}
