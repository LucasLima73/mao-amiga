"use client";
import React from "react";
import Link from "next/link";
import {
  X,
  FileText,
  Heart,
  HandCoins,
  Gavel,
  MessageSquare,
  MapPin,
  Info,
  User,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const baseClasses =
    "fixed inset-0 bg-black/90 z-50 transform transition-transform duration-300";
  const positionClass = isOpen ? "translate-y-0" : "translate-y-full";

  return (
    <div className={`${baseClasses} ${positionClass}`}>
      <div className="flex flex-col h-full text-yellow-500">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-yellow-500/20">
          <Link href="/" onClick={onClose}>
            <h1 className="text-xl font-bold cursor-pointer">MÃO AMIGA</h1>
          </Link>
          <button
            onClick={onClose}
            className="hover:bg-yellow-500/10 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="flex-1 overflow-y-auto py-6 px-6">
          {/* Trilhas */}
          <div className="space-y-1">
            <h2 className="text-gray-400 text-xs font-medium py-2">TRILHAS</h2>
            <Link href="/trilhaDocumentacao">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <FileText size={20} /> Documentação
              </button>
            </Link>
            <Link href="/trilhaSaude">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <Heart size={20} /> Saúde
              </button>
            </Link>
            <Link href="/socioeconomico">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <HandCoins size={20} /> Socioeconômico
              </button>
            </Link>
            <Link href="/direitosHumanos">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <Gavel size={20} /> Direitos
              </button>
            </Link>
          </div>

          <div className="my-6 border-t border-yellow-500/20" />

          {/* Ferramentas */}
          <div className="space-y-1">
            <h2 className="text-gray-400 text-xs font-medium py-2">
              FERRAMENTAS
            </h2>
            <Link href="/chat">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <MessageSquare size={20} /> Chat Assistente
              </button>
            </Link>
            <Link href="/mapa">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <MapPin size={20} /> Mapa de Serviços
              </button>
            </Link>
          </div>

          <div className="my-6 border-t border-yellow-500/20" />

          {/* Sobre */}
          <div className="space-y-1">
            <h2 className="text-gray-400 text-xs font-medium py-2">SOBRE</h2>
            <Link href="/sobre">
              <button
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
              >
                <Info size={20} /> Sobre Nós
              </button>
            </Link>
            <button
              onClick={onClose /* aqui você pode disparar seu modal de login */}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-yellow-500/10 w-full"
            >
              <User size={20} /> Login / Cadastro
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-yellow-500/20">
          <h2 className="text-gray-400 text-xs font-medium">IDIOMA</h2>
          <div className="flex justify-center gap-4 mt-3">
            {["PT", "EN", "ES", "FR"].map((l) => {
              const active = l === "PT";
              return (
                <button
                  key={l}
                  onClick={onClose /* se trocar idioma, fecha o menu */}
                  className={`h-8 w-12 rounded border text-sm font-medium transition-colors ${
                    active
                      ? "border-yellow-500 bg-yellow-500 text-black"
                      : "border-yellow-500 hover:bg-yellow-500/10 text-yellow-500"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
