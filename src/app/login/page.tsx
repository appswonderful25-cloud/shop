'use client';
import dynamic from "next/dynamic";
const LoginAndSignupComponent = dynamic(() => import("./login"), { ssr: false });

export default function LoginPage() {
  return (  
    <>
      <LoginAndSignupComponent key="login" />
    </>
  );
}