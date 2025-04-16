/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "../../../lib/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import firebaseApp from "../../../lib/firebase";
import { useTranslation } from 'react-i18next';
import { 
  FaMedkit,
  FaFileAlt,
  FaHands,
  FaChartLine,
  FaEllipsisH,
  FaMap,
  FaComment,
  FaSignInAlt,
  FaSignOutAlt,
  FaGlobe
} from 'react-icons/fa';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Debug: verificar idioma atual e salvar no localStorage
  useEffect(() => {
    console.log('Current language:', i18n.language);
    localStorage.setItem('i18nextLng', i18n.language);
  }, [i18n.language]);


  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");
    if (storedUserName && storedUserId) {
      setUserName(storedUserName);
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
    setIsOpen(false);
  };

  const handleNavClick = (label: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_nav", {
        event_category: "Navigation",
        event_label: label,
      });
    }
  };

  const handleLoginButtonEvent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_login", {
        event_category: "User",
        event_label: "Login Button",
      });
    }
  };

  const handleLogoutButtonEvent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "click_logout", {
        event_category: "User",
        event_label: "Logout Button",
      });
    }
  };

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
        window.location.reload();
      } else {
        alert("Telefone não encontrado!");
      }
    } catch (error) {
      alert("Erro ao fazer login: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

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
        window.location.reload();
      }
    } catch (error) {
      alert("Erro ao criar conta: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

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
      window.location.reload();
    } catch (error) {
      alert("Erro ao fazer login com Google: " + (error as any).message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setUserName(null);
    setUserId(null);
    setIsLoggedIn(false);
    handleLogoutButtonEvent();
    alert("Logout bem-sucedido!");
    window.location.reload();
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <nav className="absolute top-0 left-0 w-full bg-transparent z-50">
      {/* Desktop Navbar */}
      <div className="hidden md:flex container mx-auto justify-between items-center px-6 py-4">
        {/* Logo */}
        <div
          className="text-yellow-400 font-bold text-3xl tracking-widest uppercase"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          <Link href="/">Mão Amiga</Link>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-8 text-yellow-400 text-sm tracking-wide">
          <Link
            href="/trilhaSaude"
            onClick={() => handleNavClick("Saúde")}
            className="hover:text-yellow-300 transition"
          >
            {t('navbar.health')}
          </Link>

          <Link href="/documentacao" className="hover:text-yellow-300 transition">
            {t('navbar.documentation')}
          </Link>

          <Link href="/trilhaDireitosHumanos" className="hover:text-yellow-300 transition">
            {t('navbar.human_rights')}
          </Link>
         
          <Link
            href="/socioeconomico"
            onClick={() => handleNavClick("Socioeconômico")}
            className="hover:text-yellow-300 transition"
          >
            {t('navbar.socioeconomic')}
          </Link>
          <Link href="/mapa" className="hover:text-yellow-300 transition">
            {t('navbar.map')}
          </Link>
          <Link href="/chat" className="hover:text-yellow-300 transition">
            {t('navbar.chat')}
          </Link>

          <select 
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-transparent text-yellow-400 border border-yellow-400 px-2 py-1 rounded-md ml-4"
          >
            <option value="pt">PT</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
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
                {t('navbar.logout')}
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
              {t('navbar.login')}
            </button>
          )}
        </div>

      </div>

      {/* Mobile Bottom Tab */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black bg-opacity-90 flex justify-around items-center py-3 px-4 border-t border-yellow-400 z-50">
        <Link href="/trilhaSaude" className="flex flex-col items-center text-yellow-400 text-sm">
          <FaMedkit className="text-lg mb-1" />
          {t('navbar.health_short')}
        </Link>
        <Link href="/documentacao" className="flex flex-col items-center text-yellow-400 text-sm">
          <FaFileAlt className="text-lg mb-1" />
          {t('navbar.docs_short')}
        </Link>
        <Link href="/chat" className="flex flex-col items-center text-yellow-400 text-sm">
          <FaComment className="text-lg mb-1" />
          {t('navbar.chat')}
        </Link>
        <Link href="/socioeconomico" className="flex flex-col items-center text-yellow-400 text-sm">
          <FaChartLine className="text-lg mb-1" />
          {t('navbar.econ_short')}
        </Link>
        <button 
          onClick={toggleDrawer}
          className="flex flex-col items-center text-yellow-400 text-sm"
        >
          <FaEllipsisH className="text-lg mb-1" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="md:hidden fixed bottom-16 left-0 w-full bg-black bg-opacity-90 p-4 z-50">
          <div className="grid grid-cols-2 gap-4 text-yellow-400 text-sm">
            <Link href="/mapa" onClick={toggleDrawer} className="flex items-center gap-2">
              <FaMap /> {t('navbar.map')}
            </Link>
            <Link href="/trilhaDireitosHumanos" onClick={toggleDrawer} className="flex items-center gap-2">
              <FaHands /> {t('navbar.rights_short')}
            </Link>
            <div className="flex items-center gap-2">
              <FaGlobe />
              <select 
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                  toggleDrawer();
                }}
                value={i18n.language}
                className="bg-transparent text-yellow-400 border border-yellow-400 px-2 py-1 rounded-md"
              >
                <option value="pt">PT</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  toggleDrawer();
                  handleLogout();
                }}
                className="flex items-center gap-2 text-yellow-400 border border-yellow-400 px-2 py-1 rounded-md"
              >
                <FaSignOutAlt /> {t('navbar.logout')}
              </button>
            ) : (
              <button
                onClick={() => {
                  toggleDrawer();
                  toggleLoginModal();
                }}
                className="flex items-center gap-2 text-yellow-400 border border-yellow-400 px-2 py-1 rounded-md"
              >
                <FaSignInAlt /> {t('navbar.login')}
              </button>
            )}
          </div>
        </div>
      )}

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
                {t('navbar.health')}
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
                {t('navbar.documentation')}
              </Link>
            </li>
            <li>
              <Link
                href="/trilhaDireitosHumanos"
                onClick={() => {
                  handleNavClick("Direitos Humanos");
                  toggleMenu();
                }}
              >
                {t('navbar.human_rights')}
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
                {t('navbar.socioeconomic')}
              </Link>
            </li>
            <li>
              <Link href="/mapa" onClick={toggleMenu}>
                {t('navbar.map')}
              </Link>
            </li>
            <li>
              <Link href="/chat" onClick={toggleMenu}>
                {t('navbar.chat')}
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
                    {t('navbar.logout')}
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
                  {t('navbar.login')}
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
              {isCreatingAccount ? t('login.create_account') : t('login.login')}
            </h3>
            <input
              type="text"
              placeholder={t('login.phone')}
              className="w-full p-2 border rounded mb-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {isCreatingAccount && (
              <input
                type="text"
                placeholder={t('login.name')}
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
                ? t('login.loading')
                : isCreatingAccount
                ? t('login.create_account')
                : t('login.login')}
            </button>
            <button
              onClick={handleLoginWithGoogle}
              className="bg-red-500 text-white px-4 py-2 rounded w-full mb-4"
            >
              {t('login.google_login')}
            </button>
            <button
              onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              className="text-blue-500 underline"
            >
              {isCreatingAccount
                ? t('login.have_account')
                : t('login.no_account')}
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
