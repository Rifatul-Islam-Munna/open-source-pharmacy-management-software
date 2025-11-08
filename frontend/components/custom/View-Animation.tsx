"use client";
import React, { ViewTransition } from "react";

const ViewAnimation = ({ children }: { children: React.ReactNode }) => {
  return <ViewTransition>{children}</ViewTransition>;
};

export default ViewAnimation;
