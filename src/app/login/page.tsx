"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { getDefaultRouteForRole, makeDevUserFromEmail, type LoginResponse } from "@/lib/auth-contract";
import { saveSession } from "@/lib/session";
import { imgAsset } from "@/utils/helpers";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await api.post<{ data: LoginResponse }>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { token, user } = response.data.data;
      saveSession(token, user, data.rememberMe);

      showToast(`Welcome back, ${user.name}.`);
      router.push(getDefaultRouteForRole(user.role));
    } catch (err: unknown) {
      console.warn("Login API unavailable, using dev role fallback:", err);
      const devUser = makeDevUserFromEmail(data.email);
      saveSession("frontend_dev_token", devUser, data.rememberMe);

      showToast(`Dev login as ${devUser.role.replace("_", " ")}.`);
      router.push(getDefaultRouteForRole(devUser.role));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="flex w-full flex-col bg-white lg:w-[41.666667%]">
        {/* Logo Header */}
        <div className="bg-[#171e28] px-[11%] py-[10%] text-center lg:text-left">
          <Image
            src={imgAsset("worksuite-logo.png")}
            alt="Logo"
            width={150}
            height={50}
            className="inline-block max-h-[50px] object-contain"
          />
        </div>

        {/* Login Form Container */}
        <div className="mx-auto my-[10%] w-full max-w-[80%] px-4">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register("email")}
                  className={`w-full border-b bg-transparent py-2 transition-all focus:outline-none ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-black"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register("password")}
                  className={`w-full border-b bg-transparent py-2 transition-all focus:outline-none ${
                    errors.password ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-black"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center space-x-2 text-sm text-[#171e28]">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-xs font-bold text-gray-600">Remember Me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#171e28] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="pt-2 pb-4 text-center">
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                 <span className="text-primary">Dev Roles:</span> use super/admin/employee/client in email
               </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-full bg-primary py-3 text-sm font-black uppercase tracking-[0.2em] text-white transition-all shadow-xl shadow-primary/20 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : "Log In"}
            </button>

            <div className="pt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-bold text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Go to website{" "}
                <Link href="/" className="font-bold text-primary hover:underline">
                  Home
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Background Section (Visible on large screens) */}
      <div 
        className="hidden flex-1 bg-cover bg-center bg-no-repeat lg:block"
        style={{ backgroundImage: `url(${imgAsset("login-bg.jpg")})` }}
      >
      </div>
    </div>
  );
}
