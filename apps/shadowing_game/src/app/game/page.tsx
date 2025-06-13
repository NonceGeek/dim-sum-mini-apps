"use client";
import React, { useState } from "react";
import Category from "@/components/Category";
import Footer from "@/components/Footer";

export default function GamePage() {

   return (
      <div className="min-h-screen">
        <p>请选择场景并开始游戏！</p>
        <Category />
        <Footer />
      </div>
    );
}
