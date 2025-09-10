"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastHost() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={2500}
      newestOnTop
      pauseOnFocusLoss
      theme="light"
    />
  );
}
