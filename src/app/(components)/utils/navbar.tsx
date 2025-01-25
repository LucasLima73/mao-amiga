/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase"; // Importando Firestore
import {  getDoc, doc, setDoc } from "firebase/firestore"; // Firestore functions
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Firebase Authentication
import firebaseApp from "../../../lib/firebase"; // Firebase App

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // userId = telefone
  const auth = getAuth(firebaseApp);

  // Função para abrir e fechar os modais
  const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen);
  const toggleCreateAccountModal = () => setIsCreateAccountModalOpen(!isCreateAccountModalOpen);

  // Função para login com telefone
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", phone));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData?.userName);
        setUserId(userData?.userId);

        // Salvar no localStorage
        localStorage.setItem("userName", userData?.userName || "");
        localStorage.setItem("userId", userData?.userId || "");

        alert("Login bem-sucedido!");
        setIsLoggedIn(true);
        setIsLoginModalOpen(false);
      } else {
        alert("Telefone não encontrado!");
      }
    } catch (error) {
      alert("Erro ao fazer login: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar conta
  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      const userDoc = await getDoc(doc(db, "users", phone));
      if (userDoc.exists()) {
        alert("Este telefone já está registrado!");
      } else {
        // Salvar usuário no Firestore
        await setDoc(doc(db, "users", phone), { userName: name, userId: phone });
        
        // Salvar no localStorage
        localStorage.setItem("userName", name);
        localStorage.setItem("userId", phone);

        alert("Conta criada com sucesso!");
        setIsLoggedIn(true);
        setUserName(name);
        setUserId(phone);
        setIsCreateAccountModalOpen(false);
      }
    } catch (error) {
      alert("Erro ao criar conta: " + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para login com Google
  const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Salva os dados no localStorage
      localStorage.setItem("userName", user.displayName || "Usuário");
      localStorage.setItem("userId", user.uid);

      alert("Login com Google bem-sucedido!");

      // Atualiza o nome do usuário no estado
      setUserName(user.displayName || "Usuário");
      setUserId(user.uid);

      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
    } catch (error) {
      alert("Erro ao fazer login com Google: " + (error as any).message);
    }
  };

  // Função de logout
  const handleLogout = () => {
    setUserName(null);
    setUserId(null);
    setIsLoggedIn(false);

    // Remover dados do localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");

    alert("Logout bem-sucedido!");
  };

  useEffect(() => {
    // Verifica se o usuário já está logado
    const storedUserName = localStorage.getItem("userName");
    const storedUserId = localStorage.getItem("userId");

    if (storedUserName && storedUserId) {
      setUserName(storedUserName);
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 9999,
        padding: "0 50px",
        fontFamily: "'Roboto', sans-serif",
        fontSize: "1.5rem",
      }}
    >
      <ul
        style={{
          display: "flex",
          listStyleType: "none",
          gap: "40px",
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <a href="/trilhaSaude">SAÚDE</a>
        </li>
        <li>
          <a href="#documentacao">DOCUMENTAÇÃO</a>
        </li>
        <li>
          <a href="#direitos-humanos">DIREITOS HUMANOS</a>
        </li>
        <li>
          <a href="#socioeconomico">SOCIOECONÔMICO</a>
        </li>
      </ul>

      <div>
        {isLoggedIn ? (
          <div className="flex items-center">
            <span className="text-white mr-4">{userName}</span>
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 px-4 py-2 rounded"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={toggleLoginModal}
              className="text-white bg-blue-500 px-4 py-2 rounded"
            >
              Login
            </button>
            <button
              onClick={toggleCreateAccountModal}
              className="text-white bg-green-500 px-4 py-2 rounded"
            >
              Criar Conta
            </button>
          </div>
        )}
      </div>

      {/* Modal de Login */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Login</h3>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Telefone"
                className="w-full p-2 border rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Login"}
            </button>

            {/* Login com Google */}
            <button
              onClick={handleLoginWithGoogle}
              className="bg-red-500 text-white px-4 py-2 rounded w-full mb-4"
            >
              Login com Google
            </button>

            {/* Fechar o modal */}
            <button
              onClick={toggleLoginModal}
              className="absolute top-2 right-2 text-black hover:text-gray-500"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Modal de Criar Conta */}
      {isCreateAccountModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Criar Conta</h3>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Telefone"
                className="w-full p-2 border rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nome"
                className="w-full p-2 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button
              onClick={handleCreateAccount}
              className="bg-green-500 text-white px-4 py-2 rounded w-full mb-4"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Criar Conta"}
            </button>

            {/* Fechar o modal */}
            <button
              onClick={toggleCreateAccountModal}
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
