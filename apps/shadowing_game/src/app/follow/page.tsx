"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import Category from "@/components/Category";
import UserProfile from "@/components/UserProfile";

export default function FollowPage() {
  return (
    <div className="">
      <UserProfile />
      <p className="mt-5 ml-8">请选择场景并开始跟读！</p>
      <Category />
      <Footer />
    </div>
  );
}
