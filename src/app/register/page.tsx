'use client';
import dynamic from 'next/dynamic';
const Register = dynamic(() => import('./register-form'), { ssr: false });
export default function RegisterPage() { return <Register />; }
