'use client';
import React from 'react';
import { motion } from 'framer-motion';

const AboutButton: React.FC = () => {
  return (
    <motion.button
      // initial={{ scale: 0.8 }}
      // animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.1 }} // Transição rápida (mesma do botão do chatbot)
      className="w-16 h-16 bg-transparent rounded-full border-4 border-[#ffde59] flex items-center justify-center shadow-xl focus:outline-none"
      style={{
        position: 'fixed', // Fixa o botão na tela
        bottom: '20px', // Alinhado na parte inferior
        left: '20px', // Alinhado no canto inferior esquerdo
        transition: 'transform 0.2s ease', // Suaviza o hover
      }}
    >
      <motion.span
        initial={{ scale: 1 }}
        // whileHover={{ scale: 1.2 }} // Aumenta o ícone no hover
        transition={{ duration: 0.2 }} // Transição rápida (mesma do botão do chatbot)
        className="text-[#ffde59] text-3xl font-normal"
      >
        ?
      </motion.span>
    </motion.button>
  );
};

export default AboutButton;
