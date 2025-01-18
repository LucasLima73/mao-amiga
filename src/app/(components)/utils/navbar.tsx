"use client";

import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative z-10">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="text-lg font-bold text-[#ffde59]">
          <a href="/" className="hover:opacity-80">
            Mão Amiga
          </a>
        </div>
        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#ffde59] focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
        {/* Menu Desktop */}
        <div className="hidden md:block">
          <ul className="flex space-x-6 text-sm text-[#ffde59]">
            <li>
              <a href="/trilhaSaude" className="hover:opacity-80">
                Saúde
              </a>
            </li>
            <li>
              <a href="#documentacao" className="hover:opacity-80">
                Documentação
              </a>
            </li>
            <li>
              <a href="#direitos-humanos" className="hover:opacity-80">
                Direitos Humanos
              </a>
            </li>
            <li>
              <a href="#socioeconomico" className="hover:opacity-80">
                Socioeconômico
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Menu Mobile */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } absolute top-full left-0 w-full md:hidden`}
      >
        <ul className="flex flex-col text-center text-sm text-[#ffde59] bg-transparent">
          <li>
            <a href="#saude" className="block px-4 py-2 hover:opacity-80">
              Saúde
            </a>
          </li>
          <li>
            <a
              href="#documentacao"
              className="block px-4 py-2 hover:opacity-80"
            >
              Documentação
            </a>
          </li>
          <li>
            <a
              href="#direitos-humanos"
              className="block px-4 py-2 hover:opacity-80"
            >
              Direitos Humanos
            </a>
          </li>
          <li>
            <a
              href="#socioeconomico"
              className="block px-4 py-2 hover:opacity-80"
            >
              Socioeconômico
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
