/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../../../lib/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import firebaseApp from "../../../lib/firebase";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Navbar: React.FC = () => {
  // Estados para menu mobile, modal de login e criação de conta
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados de autenticação do usuário
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const auth = getAuth(firebaseApp);

  // Recupera dados do usuário do localStorage, se existirem
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserName && storedUserId) {
      setUserName(storedUserName);
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  // Função para alternar o menu mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Função para alternar a exibição do modal de login (fecha o menu mobile)
  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
    setIsOpen(false);
  };

  // Função para registrar eventos de navegação
  const handleNavClick = (label: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_nav", {
        event_category: "Navigation",
        event_label: label,
      });
    }
  };

  // Evento para o botão de Login
  const handleLoginButtonEvent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_login", {
        event_category: "User",
        event_label: "Login Button",
      });
    }
  };

  // Evento para o botão de Logout
  const handleLogoutButtonEvent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_logout", {
        event_category: "User",
        event_label: "Logout Button",
      });
    }
  };

  // Login por telefone
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", phone));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData?.userName);
        setUserId(userData?.userId);
        localStorage.setItem("userName", userData?.userName || "");
        localStorage.setItem("userId", userData?.userId || "");
        alert("Login bem-sucedido!");
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
        window.location.reload(); // Recarrega a página após login
      } else {
        alert("Telefone não encontrado!");
      }
    } catch (error) {
      alert("Erro ao fazer login: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Criação de conta por telefone (com nome)
  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", phone));
      if (userDoc.exists()) {
        alert("Este telefone já está registrado!");
      } else {
        await setDoc(doc(db, "users", phone), {
          userName: name,
          userId: phone,
        });
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", phone);
        alert("Conta criada com sucesso!");
        setIsLoggedIn(true);
        setUserName(name);
        setUserId(phone);
        setIsLoginModalOpen(false);
        window.location.reload(); // Recarrega a página após criação da conta
      }
    } catch (error) {
      alert("Erro ao criar conta: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Login com Google
  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("userName", user.displayName || "Usuário");
      localStorage.setItem("userId", user.uid);
      setUserName(user.displayName || "Usuário");
      setUserId(user.uid);
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      alert("Login com Google bem-sucedido!");
      window.location.reload(); // Recarrega a página após login com Google
    } catch (error) {
      alert("Erro ao fazer login com Google: " + (error as any).message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setUserName(null);
    setUserId(null);
    setIsLoggedIn(false);
    handleLogoutButtonEvent();
    alert("Logout bem-sucedido!");
    window.location.reload(); // Recarrega a página após logout
  };

  return (
    <nav className="absolute top-0 left-0 w-full bg-transparent z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          className="text-yellow-400 font-bold text-3xl tracking-widest uppercase"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          <Link href="/">Mão Amiga</Link>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-8 text-yellow-400 text-sm tracking-wide">
          <Link
            href="/trilhaSaude"
            onClick={() => handleNavClick("Saúde")}
            className="hover:text-yellow-300 transition"
          >
            SAÚDE
          </Link>

          <Link href="/trilhaDocumentacao" className="hover:text-yellow-300 transition">
            DOCUMENTAÇÃO
          </Link>
          <Link href="/trilhaDireitosHumanos" className="hover:text-yellow-300 transition">
            DIREITOS HUMANOS
          </Link>
         
          <Link
            href="/socioeconomico"
            onClick={() => handleNavClick("Socioeconômico")}
            className="hover:text-yellow-300 transition"
          >

            SOCIOECONÔMICO
          </Link>
          {/* Novo link para MAPA */}
          <Link href="/mapa" className="hover:text-yellow-300 transition">
            MAPA
          </Link>
        </div>

        {/* Login / Logout no Desktop via Modal */}
        <div className="hidden md:flex">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <span className="text-yellow-400">{userName}</span>
              <button
                onClick={handleLogout}
                className="text-yellow-400 border border-yellow-400 px-4 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                handleLoginButtonEvent();
                toggleLoginModal();
              }}
              className="text-yellow-400 border border-yellow-400 px-4 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Botão do Menu Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-yellow-400 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
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

      {/* Menu Mobile */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black bg-opacity-80 md:hidden">
          <ul className="flex flex-col items-center py-4 space-y-4 text-yellow-400 text-sm">
            <li>
              <Link
                href="/trilhaSaude"
                onClick={() => {
                  handleNavClick("Saúde");
                  toggleMenu();
                }}
              >
                SAÚDE
              </Link>
            </li>
            <li>
              <Link
                href="/documentacao"
                onClick={() => {
                  handleNavClick("Documentação");
                  toggleMenu();
                }}
              >
                DOCUMENTAÇÃO
              </Link>
            </li>
            <li>
              <Link
                href="/direitos-humanos"
                onClick={() => {
                  handleNavClick("Direitos Humanos");
                  toggleMenu();
                }}
              >
                DIREITOS HUMANOS
              </Link>
            </li>
            <li>
              <Link
                href="/socioeconomico"
                onClick={() => {
                  handleNavClick("Socioeconômico");
                  toggleMenu();
                }}
              >
                SOCIOECONÔMICO
              </Link>
            </li>
            {/* Novo item de menu para MAPA */}
            <li>
              <Link href="/mapa" onClick={toggleMenu}>
                MAPA
              </Link>
            </li>
            <li className="border-t border-yellow-400 w-3/4 mt-4"></li>
            {isLoggedIn ? (
              <>
                <li className="text-yellow-400">{userName}</li>
                <li>
                  <button
                    onClick={() => {
                      toggleMenu();
                      handleLogout();
                    }}
                    className="text-yellow-400 border border-yellow-400 px-4 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition"
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    handleLoginButtonEvent();
                    toggleLoginModal();
                  }}
                  className="text-yellow-400 border border-yellow-400 px-4 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Modal de Login para Desktop */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg relative mt-[9vh]">
            <h3 className="text-xl font-bold mb-4">
              {isCreatingAccount ? "Criar Conta" : "Login"}
            </h3>
            <input
              type="text"
              placeholder="Telefone"
              className="w-full p-2 border rounded mb-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {isCreatingAccount && (
              <input
                type="text"
                placeholder="Nome"
                className="w-full p-2 border rounded mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <button
              onClick={isCreatingAccount ? handleCreateAccount : handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
            >
              {isLoading
                ? "Carregando..."
                : isCreatingAccount
                ? "Criar Conta"
                : "Login"}
            </button>
            <button
              onClick={handleLoginWithGoogle}
              className="bg-red-500 text-white px-4 py-2 rounded w-full mb-4"
            >
              Login com Google
            </button>
            <button
              onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              className="text-blue-500 underline"
            >
              {isCreatingAccount
                ? "Já tem uma conta? Faça login"
                : "Não tem conta? Cadastre-se"}
            </button>
            <button
              onClick={toggleLoginModal}
              className="absolute top-2 right-2 text-black hover:text-gray-500"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
