"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Importar i18next

const TrilhaDireitosHumanos: React.FC = () => {
  const { t } = useTranslation(); // Hook para acessar traduções
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Dados do FAQ com traduções
  const faqData = [
    {
      title: t("faq_1_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_1_content") }}
        />
      ),
    },
    {
      title: t("faq_2_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_2_content") }}
        />
      ),
    },
    {
      title: t("faq_3_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_3_content") }}
        />
      ),
    },
    {
      title: t("faq_4_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_4_content") }}
        />
      ),
    },
    {
      title: t("faq_5_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_5_content") }}
        />
      ),
    },
    {
      title: t("faq_6_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_6_content") }}
        />
      ),
    },
    {
      title: t("faq_7_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_7_content") }}
        />
      ),
    },
    {
      title: t("faq_8_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_8_content") }}
        />
      ),
    },
    {
      title: t("faq_9_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_9_content") }}
        />
      ),
    },
    {
      title: t("faq_10_title"),
      content: (
        <div
          dangerouslySetInnerHTML={{ __html: t("faq_10_content") }}
        />
      ),
    },
  ];

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center p-8 overflow-y-auto"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/assets/images/direitoshumanos.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h2 className="text-4xl font-bold text-[#ffde59] mb-6 mt-[9vh]">
        {t("page_title")}
      </h2>

      <div className="w-full max-w-4xl space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-white text-black shadow-md rounded-xl border border-gray-200"
          >
            <button
              className="w-full text-left p-4 font-semibold text-lg"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {item.title}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-base">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrilhaDireitosHumanos;