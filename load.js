import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

// Configurações do teste
export const options = {
  stages: [
    { duration: '1m', target: 200 },  // Aumenta para 20 VUs em 1 minuto
   
  ],
};

// Função principal que será executada por cada VU
export default function () {
  const res = http.get('https://mao-amiga.site');
  check(res, {
    'status é 200': (r) => r.status === 200,
  });
  sleep(1);
}

// Geração do relatório HTML ao final do teste
export function handleSummary(data) {
  return {
    'relatorio_teste_carga.html': htmlReport(data),
  };
}
