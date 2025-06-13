"use client";
import { useState, useRef } from "react";

export default function Footer() {
  return (
    <div className="footer-wrapper flex text-green-200 fixed bottom-0 justify-center items-center w-full" >
      <div className="w-1/2 text-center">跟读练习</div>
      <div className="w-1/2 text-center">游戏模式</div>
    </div>
  );
}
