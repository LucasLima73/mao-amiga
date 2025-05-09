// src/app/_not-found/page.tsx

import Link from 'next/link';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404 - Página não encontrada</h1>
        <p className="text-xl mb-6">A página que você está procurando não existe ou foi movida.</p>

        <Link href="/" passHref>
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-300 transition">
            Voltar para a página inicial
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
