"use client";
import { useState, useRef, useEffect } from "react";
import { IoVolumeMediumSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import DOMPurify from "dompurify";
import category from "@/data/category";
import Game from "@/components/Game";
import Footer from "@/components/Footer";
import { useQuestionStore } from "@/stores/questionStore";

export default function FolllowPageDetail({ params }: any) {
  const router = useRouter();
  const [questions, setQuestions]: any = useState([]);
  const [hasReult, setResult]: any = useState(false);
  let [quesNumber, setQuesNumber] = useState(0);
  const [userSelectedQuizAns, setUserSelectedQuizAns] = useState("");

  const audioRef: any = useRef(null);
  const { setCurrentQuestion } = useQuestionStore();
  const goBack = () => {
    router.push("/game");
  };

  const sanitizeHtml = (html: any) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "b",
        "i",
        "u",
        "em",
        "strong",
        "a",
        "p",
        "br",
        "ul",
        "ol",
        "li",
        "div",
      ],
      ALLOWED_ATTR: ["href", "title"],
      FORBID_TAGS: ["script", "style", "iframe", "frame", "object", "embed"],
      FORBID_ATTR: ["onclick", "onload", "onerror"],
    });
  };

  const playAudio = () => {
    const audio = document.querySelector("audio");
    if (audio) {
      audio.play();
    }
  };

  const getResult = (result: any) => {
    setResult(!!result ? [] : result);
  };

  useEffect(() => {
    const ques: any = category[params.slug]?.questions || [];
    setQuestions(ques);
    setCurrentQuestion(ques[0] || []);
  }, []);

  return (
    <div className="">
      <button className="ml-5 mt-5" onClick={goBack}>
        {"<返回"}
      </button>
      <div className="wrapper px-4 py-4">
        <div className="text-content">
          <div className="flex ml-3 mt-3">
            <div>原文:&nbsp;</div>
            <p>{questions[quesNumber]?.originalText}</p>
          </div>
          <>
            <div
              key={questions[quesNumber]?.key}
              className="text-item mt-4 py-4 px-3 border-3 rounded-2xl border-green-200 relative text-lg leading-12 font-bold"
            >
              <div
                className="game-quiz-warpper"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(questions[quesNumber]?.yueQuizText),
                }}
              ></div>
              <div
                className="audio-icon text-2xl z-1000 h-[24px]"
                onClick={() => {
                  playAudio();
                }}
              >
                <IoVolumeMediumSharp className="float-right" />
              </div>
            </div>

            <audio
              ref={audioRef}
              muted={false}
              key={questions[quesNumber]?.audioUrl}
            >
              <source
                src={questions[quesNumber]?.audioUrl}
                type="audio/mpeg"
              ></source>
            </audio>

            <div className="flex justify-center items-center mt-4">
              {questions[quesNumber]?.yueQuiz ? (
                questions[quesNumber]?.yueQuiz.map((quiz: any) => {
                  return (
                    <div
                      onClick={() => {
                        setUserSelectedQuizAns(quiz);
                      }}
                      key={quiz}
                      className={classNames(
                        "text-center border-2 p-3 m-2 text-xl rounded-lg cursor-pointer",
                        {
                          "text-green-200 border-green-200":
                            questions[quesNumber]?.yueQuizAnswer.includes(
                              userSelectedQuizAns
                            ) && userSelectedQuizAns === quiz,
                        }
                      )}
                    >
                      {quiz}
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
          </>
        </div>
        <Game getResult={getResult} />
        {hasReult ? (
          <div className="question-setting flex-col flex">
            <div className="w-full">
              <button
                className="px-3 py-1 w-full"
                onClick={() => {
                  let quesNumber_ = quesNumber - 1;
                  const num = Math.min(
                    Math.max(quesNumber_, 0),
                    questions.length - 1
                  );
                  setQuesNumber(num);
                  setCurrentQuestion(questions[num] || []);
                }}
              >
                上一题
              </button>
            </div>

            <div className="w-full">
              <button
                className="color-grey-200 leading-8 w-full border-green-200 border-2 rounded-2xl"
                onClick={() => {
                  let quesNumber_ = quesNumber + 1;
                  const num = Math.min(
                    Math.max(quesNumber_, 0),
                    questions.length - 1
                  );
                  setQuesNumber(num);
                  setCurrentQuestion(questions[num] || []);
                }}
              >
                下一题
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <Footer />
    </div>
  );
}
