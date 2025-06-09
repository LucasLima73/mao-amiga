"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function TermsOfUsePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-center text-primary mb-2">
            {t("termsOfUse.title")}
          </h1>
          <p className="text-gray-500 text-center mb-8">
            {t("termsOfUse.lastUpdate")}
          </p>

          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {t("termsOfUse.welcome")}
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              {t("termsOfUse.agreement")}
            </p>

            {/* Seção 1 - Objetivo da Plataforma */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {t("termsOfUse.sections.purpose.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("termsOfUse.sections.purpose.content")}
              </p>
            </div>

            {/* Seção 2 - Cadastro e Conta */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {t("termsOfUse.sections.registration.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("termsOfUse.sections.registration.content1")}
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                {t("termsOfUse.sections.registration.content2")}
              </p>
            </div>

            {/* Seção 3 - Privacidade e Proteção de Dados */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {t("termsOfUse.sections.privacy.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("termsOfUse.sections.privacy.content")}
              </p>

              <div className="ml-4 mt-4">
                <h3 className="font-medium text-gray-800">
                  {t("termsOfUse.sections.privacy.data.title")}
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>{t("termsOfUse.sections.privacy.data.item1")}</li>
                  <li>{t("termsOfUse.sections.privacy.data.item2")}</li>
                  <li>{t("termsOfUse.sections.privacy.data.item3")}</li>
                </ul>
              </div>

              <div className="ml-4 mt-4">
                <h3 className="font-medium text-gray-800">
                  {t("termsOfUse.sections.privacy.purposes.title")}
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>{t("termsOfUse.sections.privacy.purposes.item1")}</li>
                  <li>{t("termsOfUse.sections.privacy.purposes.item2")}</li>
                  <li>{t("termsOfUse.sections.privacy.purposes.item3")}</li>
                </ul>
              </div>

              <div className="ml-4 mt-4">
                <h3 className="font-medium text-gray-800">
                  {t("termsOfUse.sections.privacy.sharing.title")}
                </h3>
                <p className="mt-2 text-gray-700">
                  {t("termsOfUse.sections.privacy.sharing.content")}
                </p>
              </div>

              <div className="ml-4 mt-4">
                <h3 className="font-medium text-gray-800">
                  {t("termsOfUse.sections.privacy.rights.title")}
                </h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>{t("termsOfUse.sections.privacy.rights.item1")}</li>
                  <li>{t("termsOfUse.sections.privacy.rights.item2")}</li>
                  <li>{t("termsOfUse.sections.privacy.rights.item3")}</li>
                </ul>
              </div>

              <p className="mt-4 text-gray-700">
                {t("termsOfUse.sections.privacy.contact")}
              </p>
            </div>

            {/* Seção 4 - Uso Responsável */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {t("termsOfUse.sections.responsibleUse.title")}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>{t("termsOfUse.sections.responsibleUse.item1")}</li>
                <li>{t("termsOfUse.sections.responsibleUse.item2")}</li>
              </ul>
            </div>

            {/* Seção 5 - Responsabilidade */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {t("termsOfUse.sections.responsibility.title")}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>{t("termsOfUse.sections.responsibility.item1")}</li>
                <li>{t("termsOfUse.sections.responsibility.item2")}</li>
              </ul>
            </div>

            {/* Seção 6 - Modificações */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {t("termsOfUse.sections.modifications.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("termsOfUse.sections.modifications.content")}
              </p>
            </div>

            {/* Seção 7 - Contato */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {t("termsOfUse.sections.contact.title")}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {t("termsOfUse.sections.contact.content")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
