"use client";
import React, { useState } from "react";
import Category from "@/components/Category";
import Footer from "@/components/Footer";
import UserProfile from "@/components/UserProfile";

export default function GamePage() {
  return (
    <div className="">
      <UserProfile />
      <p className="mt-5 ml-8">请选择场景并开始游戏！</p>
      <Category />
      <Footer />
    </div>
  );
}
