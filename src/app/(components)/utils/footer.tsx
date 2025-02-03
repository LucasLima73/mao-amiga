import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-5">
      {/* Contêiner Principal */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-center items-center text-center md:text-left gap-8">
        {/* Seção Sobre */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-2xl font-semibold mb-3 text-yellow-400">Mão Amiga</h3>
          <p className="text-base leading-7 text-gray-300">
            Um projeto dedicado a apoiar refugiados no Brasil, oferecendo acesso a serviços essenciais e suporte em desafios legais, culturais e linguísticos.
          </p>
        </div>

        {/* Links Úteis */}
        <div className="flex-1 min-w-[250px]">
          <h3 className="text-2xl font-semibold mb-3 text-yellow-400">Links Úteis</h3>
          <ul className="space-y-2">
            {[
              { href: "/trilhaSaude", label: "Acesso à Saúde" },
              { href: "/trilhaDocumentacao", label: "Documentação" },
              { href: "/trilhaDireitosHumanos", label: "Direitos Humanos" },
              { href: "/trilhaSocioeconomico", label: "Apoio Socioeconômico" },
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
          <h3 className="text-2xl font-semibold mb-3 text-yellow-400">Contato</h3>
          <p className="text-base leading-7 text-gray-300">
            <strong>Email:</strong> contato@maoamiga.org.br
          </p>
          {/* <p className="text-base leading-7 text-gray-300">
            <strong>Telefone:</strong> +55 (11) 99999-9999
          </p> */}
        </div>
      </div>

      {/* Rodapé Inferior */}
      <div className="border-t border-gray-700 mt-8 pt-5 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Mão Amiga. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
