'use client';

import React, { useState } from "react";
import VerticalTimeline from "../utils/timeline";

interface Task {
  id: number;
  name: string;
  completed: boolean;
}

interface Step {
  title: string;
  checklist: string[];
  optionalIndexes?: number[];
}

const TrilhaSaude: React.FC = () => {
  const steps = [
    {
      title: "Passo 1: Solicitar o Protocolo de Refúgio ou Regularizar a Situação Migratória",
      checklist: [
        "Preencher o formulário no sistema Sisconare",
        "Documentos necessários: Passaporte ou equivalente"
      ],
      optionalIndexes: [], // Não há itens opcionais
    },
    {
      title: "Passo 2: Agendar e Solicitar a CRNM (Carteira de Registro Nacional Migratório)",
      checklist: [
        "Agendar atendimento na Polícia Federal",
        "Documentos necessários: Protocolo de Refúgio ou autorização de residência",
        "Comprovante de residência (opcional)"
      ],
      optionalIndexes: [2], // O item 3 é opcional
    },
    {
      title: "Passo 3: Obter o CPF (Cadastro de Pessoa Física)",
      checklist: [
        "Solicitar o CPF nas agências da Receita Federal, Banco do Brasil, Caixa Econômica, ou Correios",
        "Documentos necessários: Protocolo de Refúgio ou CRNM, passaporte ou equivalente"
      ],
      optionalIndexes: [], // Não há itens opcionais
    },
    {
      title: "Passo 4: Garantir um Comprovante de Residência",
      checklist: [
        "Certifique-se de ter um comprovante atualizado em seu nome",
        "Se não tiver, solicite uma declaração de residência"
      ],
      optionalIndexes: [], // Não há itens opcionais
    },
    {
      title: "Passo 5: Solicitar a Carteirinha do SUS",
      checklist: [
        "Ir até a Unidade Básica de Saúde (UBS)",
        "Documentos necessários: Protocolo de Refúgio ou CRNM, CPF, Comprovante de residência"
      ],
      optionalIndexes: [], // Não há itens opcionais
    },
  ];

  return (
    <div
      style={{
        backgroundImage: "url('/assets/images/saude.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div
        style={{
          marginTop: '100px',
        }}>
        <VerticalTimeline title="Trilha de Saúde" steps={steps} />
      </div>
    </div>
  );
};

export default TrilhaSaude;
