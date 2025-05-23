/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from './navbar.module.css';
import Link from "next/link";
import Image from "next/image";
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
import LanguageSelector from "./LanguageSelector";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const Navbar = React.forwardRef<{ toggleLoginModal: () => void }, {}>((_props, ref) => {
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
  
  // Expor a função toggleLoginModal através da ref
  React.useImperativeHandle(ref, () => ({
    toggleLoginModal
  }));

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
        alert(t('login.success'));
      } else {
        alert(t('login.phone_not_found'));
      }
    } catch (error: any) {
      alert(t('login.error') + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", phone));
      if (userDoc.exists()) {
        alert(t('login.phone_already_registered'));
      } else {
        await setDoc(doc(db, "users", phone), { userName: name, userId: phone });
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", phone);
        setUserName(name);
        setUserId(phone);
        setIsLoggedIn(true);
        toggleLoginModal();
        alert(t('login.account_created'));
      }
    } catch (error: any) {
      alert(t('login.create_error') + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.displayName && user.email) {
        localStorage.setItem("userName", user.displayName);
        localStorage.setItem("userId", user.email);
        setUserName(user.displayName);
        setUserId(user.email);
        setIsLoggedIn(true);
        toggleLoginModal();
        alert(t('login.google_success'));
      }
    } catch (error: any) {
      alert(t('login.google_error') + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setUserName(null);
    setUserId(null);
    setIsLoggedIn(false);
    handleLogoutButtonEvent();
    alert(t('login.logout_success'));
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

            <LanguageSelector />

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
                <div className="flex items-center">
                  <select 
                    value={i18n.language} 
                    onChange={(e) => { i18n.changeLanguage(e.target.value); toggleDrawer(); }} 
                    className="bg-transparent text-yellow-400 border border-yellow-400 px-2 py-1 rounded-md pr-8"
                    style={{ backgroundPosition: 'right 0.5rem center' }}
                  >
                    <option value="pt-BR">PT</option>
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                    <option value="fr">FR</option>
                    <option value="ar">AR</option>
                  </select>
                  <div className="ml-2 w-6 h-4 relative">
                    {i18n.language === 'pt-BR' && <Image src="/assets/flags/brazil.svg" alt="Brazil flag" fill className="object-contain" />}
                    {i18n.language === 'en' && <Image src="/assets/flags/usa.svg" alt="USA flag" fill className="object-contain" />}
                    {i18n.language === 'es' && <Image src="/assets/flags/spain.svg" alt="Spain flag" fill className="object-contain" />}
                    {i18n.language === 'fr' && <Image src="/assets/flags/france.svg" alt="France flag" fill className="object-contain" />}
                    {i18n.language === 'ar' && <Image src="/assets/flags/arabic.svg" alt="Arabic flag" fill className="object-contain" />}
                  </div>
                </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-black border border-yellow-400 p-8 rounded-lg shadow-lg relative mt-[9vh] w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                {isCreatingAccount ? t('login.create_account') : t('login.login')}
              </h3>

              {/* input Telefone */}
              <input
                type="text"
                placeholder={t('login.phone')}
                value={phone}
                onChange={(e) => {
                  const v = e.target.value;
                  // Permite apenas números no campo de telefone
                  const numbersOnly = v.replace(/[^0-9]/g, '');
                  setPhone(numbersOnly);
                  setIsPhoneValid(phonePattern.test(numbersOnly));
                }}
                className="w-full p-2 border border-yellow-400 bg-black text-white rounded mb-1 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {phone && !isPhoneValid && (
                <p className="text-sm text-red-500 mb-2">
                  {t('login.invalid_format')}
                </p>
              )}

              {/* input Nome — só para cadastro */}
              {isCreatingAccount && (
                <input
                  type="text"
                  placeholder={t('login.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-yellow-400 bg-black text-white rounded mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                    ? "bg-black text-yellow-400 border border-yellow-400 hover:bg-yellow-400 hover:text-black transition"
                    : "bg-yellow-400 text-black hover:bg-yellow-500 transition"}
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
                className="w-full bg-black text-white border border-white px-4 py-2 rounded mb-4 hover:bg-white hover:text-black transition"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                    <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                    <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                    <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                  </svg>
                  {t('login.google_login')}
                </div>
              </button>

              {/* alterna entre login e criar conta */}
              <button
                onClick={() => setIsCreatingAccount(!isCreatingAccount)}
                className="text-yellow-400 hover:text-yellow-300 underline mb-4"
              >
                {isCreatingAccount ? t('login.have_account') : t('login.no_account')}
              </button>

              {/* fechar modal */}
              <button
                onClick={toggleLoginModal}
                className="absolute top-2 right-2 text-yellow-400 hover:text-yellow-300"
              >
                ✖
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
});

export default Navbar;
