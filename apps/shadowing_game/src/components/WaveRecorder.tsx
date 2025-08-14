"use client";
import React, { useState, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { Tooltip } from "antd";
import { useQuestionStore } from "@/stores/questionStore";
import { IoPulseSharp } from "react-icons/io5";

interface WaveRecorderProps {
  onRecordingComplete: (score: number, feedback: string) => void;
  onReset: any;
}
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
type SpeechRecognition = typeof window.SpeechRecognition;

const WaveRecorder = ({ onRecordingComplete }: WaveRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playTime, setPlayTime] = useState(0);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const { currentQuestion } = useQuestionStore();
  const { yueText } = currentQuestion || {};

  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const wavesurferRef = useRef<any>(null);
  const waveformRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const animationRef = useRef<any>(null);
  const playProgressRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window?.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Web Speech API not supported");
        return;
      }

      const recognizer = new SpeechRecognition();
      recognizer.lang = "zh-HK"; // 粤语
      recognizer.interimResults = false;

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const score = calculateSimilarity(transcript, yueText);
        const finalScore = Math.min(100, Math.max(Math.round(score * 100), 60));
        const feedback = generateFeedback(finalScore);
        onRecordingComplete(finalScore, feedback);
        clearInterval(timerRef.current);
        cancelAnimationFrame(animationRef.current);
      };

      recognizer.onerror = (event: any) => {
        console.error("Recognition error:", event.error);
        onRecordingComplete(0, '系统错误');
      };

      setRecognition(recognizer);
    }

    return () => {
      recognition?.abort();
    };
  }, [yueText]);

  // 初始化wavesurfer
  useEffect(() => {
    if (WaveSurfer && waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#8ee085",
        progressColor: "#8b5cf6",
        cursorColor: "#333",
        barWidth: 5,
        barRadius: 3,
        barGap: 2,
        height: 16,
        normalize: true,
        interact: false,
      });

      wavesurferRef.current.on("audioprocess", (time: any) => {
        setPlayTime(Math.floor(time));
      });

      wavesurferRef.current.on("finish", () => {
        setPlaying(false);
      });

      if (audioUrl) {
        wavesurferRef.current.load(audioUrl);
      }
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
      clearInterval(playProgressRef.current);
    };
  }, [audioUrl]);

  const calculateSimilarity = (text1: string, text2: string): number => {
    // 简单的文本相似度计算
    // 实际项目中可以使用更复杂的算法
    const set1 = new Set(text1.split(""));
    const set2 = new Set(text2.split(""));
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const score = (intersection.size / Math.max(set1.size, set2.size)) * 2;
    return score; // 返回百分比
  };

  const generateFeedback = (score: number): string => {
    // 生成简单反馈
    if (score > 0 && score < 21) return "注意发音差异，请再试一次";
    if (score > 20 && score < 41) return "发音不错，但还有提升空间";
    if (score > 40 && score < 61) return "发音良好，继续保持";
    if (score > 60 && score < 81) return "发音非常好，接近完美";
    if (score > 80 && score < 101) return "太棒啦，发音完美无瑕";
    return "请重新录音";
  };

  // 开始录音
  const startRecording = async () => {
    try {
      recognition.start();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioChunks: any = [];
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob: any = new Blob(audioChunks, { type: "audio/mp4" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);

      // 计时器
      let startTime = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // 实时波形更新
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawWaveform = () => {
        if (!recording) return;

        analyser.getByteTimeDomainData(dataArray);

        if (wavesurferRef.current) {
          wavesurferRef.current.empty();
          wavesurferRef.current.drawBuffer(dataArray);
        }

        animationRef.current = requestAnimationFrame(drawWaveform);
      };

      drawWaveform();
    } catch (err) {
      console.error("录音启动失败:", err);
      alert("无法访问麦克风，请检查权限设置");
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      setRecording(false);
      recognition.stop();
      mediaRecorderRef.current.stop();
    }
  };

  // 播放/暂停录音
  const togglePlayback = () => {
    if (!audioUrl || !wavesurferRef.current) return;

    if (playing) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <>
      <div className="flex items-center">
        {/* 录音控制面板 */}
        <div className="flex flex-col">
          <div className="flex space-x-4">
            <Tooltip
              title="点击录制"
              color={"lime"}
              key={"lime"}
              placement="bottom"
              defaultOpen={true}
            >
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`px-3 py-2 rounded-full font-bold text-lg  duration-300 ${
                  recording ? "" : ""
                }`}
              >
                {recording ? (
                  <div className="flex items-center">
                    <div className="border text-green-200 rounded-full p-1 text-xl">
                      <IoPulseSharp />
                    </div>
                  </div>
                ) : (
                  <div className="border text-grey-200 rounded-full p-1 text-xl">
                    <IoPulseSharp />
                  </div>
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* 波形显示区域 */}
        <div className="min-w-4/5">
          <div
            onClick={togglePlayback}
            ref={waveformRef}
            className="border border-indigo-500/30 rounded-xl p-2 min-h-[10px]"
            style={{ backgroundColor: recording ? "#fff" : "#ceffce" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default WaveRecorder;
