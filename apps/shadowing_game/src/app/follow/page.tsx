"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import Category from "@/components/Category";

export default function FollowPage() {
  return (
    <div className="min-h-screen">
      <p>请选择场景并开始跟读！</p>
      <Category />
      <Footer />
    </div>
  );
}
