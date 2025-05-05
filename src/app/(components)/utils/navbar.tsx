/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from './navbar.module.css';
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
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const offset = window.scrollY;
    setScrolled(offset > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    localStorage.setItem('i18nextLng', i18n.language);
  }, [i18n.language]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

   // novo estado de validação de telefone
   const [isPhoneValid, setIsPhoneValid] = useState(false);

   const phonePattern = /^(\([1-9][0-9]\)|[1-9][0-9])\s?9\d{4}-?\d{4}$/;

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

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
    setIsCreatingAccount(false);
    setPhone("");
    setName("");
    setIsPhoneValid(false);
    setIsOpen(false);
  };

  const handleNavClick = (label: string) => {
    window.gtag?.("event", "click_nav", { event_category: "Navigation", event_label: label });
  };

  const handleLoginButtonEvent = () => {
    window.gtag?.("event", "click_login", { event_category: "User", event_label: "Login Button" });
  };

  const handleLogoutButtonEvent = () => {
    window.gtag?.("event", "click_logout", { event_category: "User", event_label: "Logout Button" });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", phone));
      if (userDoc.exists()) {
        const data = userDoc.data();
        localStorage.setItem("userName", data?.userName || "");
        localStorage.setItem("userId", data?.userId || "");
        setUserName(data?.userName);
        setUserId(data?.userId);
        setIsLoggedIn(true);
        toggleLoginModal();
        alert(t('login.loading'));
      } else {
        alert("Telefone não encontrado!");
      }
    } catch (error: any) {
      alert("Erro ao fazer login: " + error.message);
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
        await setDoc(doc(db, "users", phone), { userName: name, userId: phone });
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", phone);
        setUserName(name);
        setUserId(phone);
        setIsLoggedIn(true);
        toggleLoginModal();
        alert("Conta criada com sucesso!");
      }
    } catch (error: any) {
      alert("Erro ao criar conta: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      localStorage.setItem("userName", user.displayName || "Usuário");
      localStorage.setItem("userId", user.uid);
      setUserName(user.displayName);
      setUserId(user.uid);
      setIsLoggedIn(true);
      toggleLoginModal();
      alert("Login com Google bem-sucedido!");
    } catch (error: any) {
      alert("Erro ao fazer login com Google: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
    setUserId(null);
    setIsLoggedIn(false);
    handleLogoutButtonEvent();
    alert("Logout bem-sucedido!");
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        {/* Mobile Header */}
        <div className="md:hidden flex justify-center items-center py-4 bg-black bg-opacity-90">
          <Link href="/" className="text-yellow-400 font-bold text-2xl uppercase">Mão Amiga</Link>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:flex container mx-auto justify-between items-center px-6 py-4">
          <div className="text-yellow-400 font-bold text-3xl uppercase">
            <Link href="/">Mão Amiga</Link>
          </div>

          <div className="flex items-center space-x-8 text-yellow-400 text-sm">
            <Link href="/trilhaSaude" onClick={() => handleNavClick("Saúde")} className="hover:text-yellow-300 transition">
              {t('navbar.health')}
            </Link>

            <Link href="/documentacao" onClick={() => handleNavClick("Documentação")} className="hover:text-yellow-300 transition">
              {t('navbar.documentation')}
            </Link>

            <Link href="/trilhaDireitosHumanos" onClick={() => handleNavClick("Direitos Humanos")} className="hover:text-yellow-300 transition">
              {t('navbar.human_rights')}
            </Link>

            <Link href="/socioeconomico" onClick={() => handleNavClick("Socioeconômico")} className="hover:text-yellow-300 transition">
              {t('navbar.socioeconomic')}
            </Link>

            <Link href="/mapa" onClick={() => handleNavClick("Mapa")} className="hover:text-yellow-300 transition">
              {t('navbar.map')}
            </Link>

            <Link href="/chat" onClick={() => handleNavClick("Chat")} className="hover:text-yellow-300 transition">
              {t('navbar.chat')}
            </Link>

            {/* Novo item SOBRE */}
            <Link href="/sobre" onClick={() => handleNavClick("Sobre")} className="hover:text-yellow-300 transition">
              {t('navbar.about', 'Sobre')}
            </Link>

            <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} className="bg-transparent text-yellow-400 border border-yellow-400 px-2 py-1 rounded-md">
              <option value="pt-BR">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
          </div>

          <div>
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 text-yellow-400">
                <span>{userName}</span>
                <button onClick={handleLogout} className="border border-yellow-400 px-4 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition">
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <button onClick={() => { handleLoginButtonEvent(); toggleLoginModal(); }} className="border border-yellow-400 px-4 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition text-yellow-400">
                {t('navbar.login')}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Bottom Tab */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-black bg-opacity-90 flex justify-around py-3 px-4 border-t border-yellow-400 z-50">
          <Link href="/trilhaSaude" className="flex flex-col items-center text-yellow-400 text-sm">
            <FaMedkit />
            {t('navbar.health_short')}
          </Link>
          <Link href="/documentacao" className="flex flex-col items-center text-yellow-400 text-sm">
            <FaFileAlt />
            {t('navbar.docs_short')}
          </Link>
          <Link href="/chat" className="flex flex-col items-center text-yellow-400 text-sm">
            <FaComment />
            {t('navbar.chat')}
          </Link>
          <Link href="/socioeconomico" className="flex flex-col items-center text-yellow-400 text-sm">
            <FaChartLine />
            {t('navbar.econ_short')}
          </Link>
          <button onClick={toggleDrawer} className="flex flex-col items-center text-yellow-400 text-sm">
            <FaEllipsisH />
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
              <Link href="/about" onClick={toggleDrawer} className="flex gap-2 items-center">
                <FaEllipsisH /> {t('navbar.about', 'Sobre')}
              </Link>
              <div className="flex items-center gap-2">
                <FaGlobe />
                <select value={i18n.language} onChange={(e) => { i18n.changeLanguage(e.target.value); toggleDrawer(); }} className="bg-transparent text-yellow-400 border border-yellow-400 px-2 py-1 rounded-md">
                  <option value="pt-BR">PT</option>
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                </select>
              </div>
              {isLoggedIn ? (
                <button onClick={() => { toggleDrawer(); handleLogout(); }} className="flex items-center gap-2 border border-yellow-400 px-2 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition text-yellow-400">
                  <FaSignOutAlt /> {t('navbar.logout')}
                </button>
              ) : (
                <button onClick={() => { toggleDrawer(); toggleLoginModal(); }} className="flex items-center gap-2 border border-yellow-400 px-2 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition text-yellow-400">
                  <FaSignInAlt /> {t('navbar.login')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-black bg-opacity-80 md:hidden">
            <ul className="flex flex-col items-center py-4 space-y-4 text-yellow-400 text-sm">
              <li><Link href="/trilhaSaude" onClick={() => { handleNavClick("Saúde"); toggleMenu(); }}>{t('navbar.health')}</Link></li>
              <li><Link href="/documentacao" onClick={() => { handleNavClick("Documentação"); toggleMenu(); }}>{t('navbar.documentation')}</Link></li>
              <li><Link href="/trilhaDireitosHumanos" onClick={() => { handleNavClick("Direitos Humanos"); toggleMenu(); }}>{t('navbar.human_rights')}</Link></li>
              <li><Link href="/socioeconomico" onClick={() => { handleNavClick("Socioeconômico"); toggleMenu(); }}>{t('navbar.socioeconomic')}</Link></li>
              <li><Link href="/mapa" onClick={toggleMenu}>{t('navbar.map')}</Link></li>
              <li><Link href="/chat" onClick={toggleMenu}>{t('navbar.chat')}</Link></li>
              <li><Link href="/about" onClick={() => { handleNavClick("Sobre"); toggleMenu(); }}>{t('navbar.about', 'Sobre')}</Link></li>
              {isLoggedIn ? (
                <>
                  <li className="text-yellow-400">{userName}</li>
                  <li><button onClick={() => { toggleMenu(); handleLogout(); }} className="border border-yellow-400 px-4 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition text-yellow-400">{t('navbar.logout')}</button></li>
                </>
              ) : (
                <li><button onClick={() => { handleLoginButtonEvent(); toggleLoginModal(); }} className="border border-yellow-400 px-4 py-1 rounded-md hover:bg-yellow-400 hover:text-black transition text-yellow-400">{t('navbar.login')}</button></li>
              )}
            </ul>
          </div>
        )}

        {/* Login Modal */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg relative mt-[9vh] w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">
                {isCreatingAccount ? t('login.create_account') : t('login.login')}
              </h3>

              {/* input Telefone */}
              <input
                type="text"
                placeholder={t('login.phone')}
                value={phone}
                onChange={(e) => {
                  const v = e.target.value;
                  setPhone(v);
                  setIsPhoneValid(phonePattern.test(v));
                }}
                className="w-full p-2 border rounded mb-1"
              />
              {phone && !isPhoneValid && (
                <p className="text-sm text-red-500 mb-2">
                  Formato inválido. Use: XX9XXXXXXXX
                </p>
              )}

              {/* input Nome — só para cadastro */}
              {isCreatingAccount && (
                <input
                  type="text"
                  placeholder={t('login.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded mb-4"
                />
              )}

              {/* botão Login / Criar conta */}
              <button
                onClick={isCreatingAccount ? handleCreateAccount : handleLogin}
                disabled={
                  isLoading ||
                  !isPhoneValid ||
                  (isCreatingAccount && name.trim() === "")
                }
                className={`
                  w-full px-4 py-2 rounded mb-4
                  ${isCreatingAccount
                    ? "bg-white text-black border border-black"
                    : "bg-blue-500 text-white"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isLoading
                  ? t('login.loading')
                  : (isCreatingAccount
                      ? t('login.create_account')
                      : t('login.login'))
                }
              </button>

              {/* botão Login com Google */}
              <button
                onClick={handleLoginWithGoogle}
                disabled={!isPhoneValid}
                className="w-full bg-red-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('login.google_login')}
              </button>

              {/* alterna entre login e criar conta */}
              <button
                onClick={() => setIsCreatingAccount(!isCreatingAccount)}
                className="text-blue-500 underline mb-4"
              >
                {isCreatingAccount ? t('login.have_account') : t('login.no_account')}
              </button>

              {/* fechar modal */}
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
    </>
  );
};

export default Navbar;
