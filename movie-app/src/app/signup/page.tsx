"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Signing up with data:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Sign up successful!");
      setFormData({ username: "", email: "", password: "" });
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex font-sans">
      <div className="relative flex-1 h-screen">
        <Image
          src="https://pbs.twimg.com/profile_images/1243623122089041920/gVZIvphd_400x400.jpg"
          alt="Sign up illustration"
          fill
          sizes="50vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      <section className="flex-1 flex items-center justify-center p-12 bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6 p-8 rounded-2xl shadow-lg border border-gray-200"
          noValidate
        >
          <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
            Create Your Account
          </h1>

          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-gray-700 font-semibold"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              placeholder="Choose a username"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-400">
              Your public display name
            </p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-gray-700 font-semibold"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block mb-2 text-gray-700 font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Create a strong password"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              aria-label={`${showPassword ? "Hide" : "Show"} password`}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </section>
    </main>
  );
}
