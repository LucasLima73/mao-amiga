"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaHeadset } from "react-icons/fa";

interface ChatButtonProps {}

const ChatButton: React.FC<ChatButtonProps> = () => {
  const [iconColor, setIconColor] = useState("#ffde59");
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      // Obtém o elemento pai do botão
      const parentElement = buttonRef.current.parentElement;

      if (parentElement) {
        // Obtém a cor de fundo do elemento pai
        const parentBgColor = getComputedStyle(parentElement).backgroundColor;

        // Função para converter cor RGB para hexadecimal
        const rgbToHex = (rgb: string) => {
          const result = rgb.match(/\d+/g);
          if (!result) return "#ffffff"; // Caso não consiga converter, assume branco
          return (
            "#" +
            result
              .slice(0, 3)
              .map((x) => {
                const hex = parseInt(x, 10).toString(16);
                return hex.length === 1 ? "0" + hex : hex;
              })
              .join("")
          );
        };

        const parentColorHex = rgbToHex(parentBgColor);

        // Ajusta a cor do ícone se o fundo for igual a #ffde59
        if (parentColorHex.toLowerCase() === "#ffde59") {
          setIconColor("#ffffff");
        }
      }
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        border: "4px solid #ffde59",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.98)";
        e.currentTarget.style.boxShadow = "0 3px 5px rgba(0, 0, 0, 0.2)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
      }}
    >
      <FaHeadset
        style={{
          fontSize: "24px",
          color: iconColor,
        }}
      />
    </button>
  );
};

export default ChatButton;
