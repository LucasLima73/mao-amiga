'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AboutButton: React.FC = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/sobre')}
      className="w-16 h-16 bg-transparent rounded-full border-4 border-[#ffde59] flex items-center justify-center focus:outline-none"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        transition: 'transform 0.2s ease',
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <span className="text-[#ffde59] text-3xl font-normal">?</span>
    </button>
  );
};

export default AboutButton;
