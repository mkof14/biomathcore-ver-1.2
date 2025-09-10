"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      alert("Success!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="corporate-heading text-2xl mb-4">
        {isLogin ? "Login" : "Register"}
      </h2>
      <form
        onSubmit={handleAuth}
        className="bg-gray-800 p-6 rounded-lg text-white"
      >
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded text-black"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mr-2"
        >
          {isLogin ? "Login" : "Register"}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="bg-gray-500 text-white p-2 rounded"
        >
          {isLogin ? "Need to Register?" : "Already have an account?"}
        </button>
      </form>
    </div>
  );
}
