"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next"; // Importar i18next

const Footer = () => {
  const { t } = useTranslation(); // Hook para acessar traduções

  return (
    <footer className="bg-black text-white py-10 px-5">
      {/* Contêiner Principal */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center text-center md:text-left gap-8">
        {/* Seção Sobre */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-2xl font-semibold mb-3 text-yellow-400">{t("about_title")}</h3>
          <p className="text-base leading-7 text-gray-300">{t("about_description")}</p>
        </div>

        {/* Links Úteis */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-2xl font-semibold mb-3 text-yellow-400">{t("useful_links_title")}</h3>
          <ul className="space-y-2">
            {[
              { href: "/trilhaSaude", label: t("link_acesso_saude") },
              { href: "/trilhaDocumentacao", label: t("link_documentacao") },
              { href: "/trilhaDireitosHumanos", label: t("link_direitos_humanos") },
              { href: "/trilhaSocioeconomico", label: t("link_apoio_socioeconomico") },
            ].map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 ease-in-out"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-2xl font-semibold mb-3 text-yellow-400">{t("contact_title")}</h3>
          <p className="text-base leading-7 text-gray-300">
            <strong>{t("contact_email_label")}:</strong> tccfesa@gmail.com
          </p>
          {/* <p className="text-base leading-7 text-gray-300">
            <strong>{t("contact_phone_label")}:</strong> +55 (11) 99999-9999
          </p> */}
        </div>
      </div>

      {/* Rodapé Inferior */}
      <div className="border-t border-gray-700 mt-8 pt-5 text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} {t("footer_copyright")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;