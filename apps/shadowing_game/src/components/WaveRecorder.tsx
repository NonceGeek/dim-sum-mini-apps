"use client";
import React, { useState, useEffect, useRef } from "react";
import { formatTime } from "@/utils/audioUtils";
import WaveSurfer from "wavesurfer.js";

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
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const wavesurferRef = useRef<any>(null);
  const waveformRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const animationRef = useRef<any>(null);
  const playProgressRef = useRef<any>(null);
  const targetText = "我唔食辣野"; // 目标文本

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
        onRecordingComplete(score, feedback);
        clearInterval(timerRef.current);
        cancelAnimationFrame(animationRef.current);
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

  // 初始化wavesurfer
  useEffect(() => {
    if (WaveSurfer && waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#8ee085",
        progressColor: "#8b5cf6",
        cursorColor: "transparent",
        barWidth: 3,
        barRadius: 3,
        barGap: 2,
        height: 30,
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
    return intersection.size / Math.max(set1.size, set2.size);
  };

  const generateFeedback = (userText: string, targetText: string): string => {
    // 生成简单反馈
    if (userText === targetText) return "发音准确！";
    return "注意发音差异，请再试一次";
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
        const audioBlob: any = new Blob(audioChunks, { type: "audio/wav" });
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
    <div className="flex">
      {/* 录音控制面板 */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`px-4 py-3 rounded-full font-bold text-lg  duration-300 ${
              recording
                ? "bg-red-500 hover:bg-red-600 scale-105 recording-pulse"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {recording ? (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
                停
              </div>
            ) : (
              "录"
            )}
          </button>
        </div>
      </div>

      {/* 波形显示区域 */}
      <div className="mb-10">
        <div
          ref={waveformRef}
          className="bg-white border border-indigo-500/30 rounded-xl p-4 min-h-[10px] min-w-[300px]"
        ></div>

        {/* 播放控制 */}
        {audioUrl && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={togglePlayback}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-medium flex items-center"
            >
              {playing ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  暂停
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  播放录音
                </>
              )}
            </button>

            <div className="text-lg font-mono bg-indigo-900/30 px-4 py-2 rounded-lg">
              {formatTime(playTime)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaveRecorder;
