// k6 run --insecure-skip-tls-verify main.js
//k6.exe run --insecure-skip-tls-verify --out web-dashboard=export=test-report.html .\main.js
import { login } from './src/services/auth.js';
import { USUARIOS_VIRTUAIS } from './config/env.js';
import {
  FluxoAutenticacao,
  FluxoEdicaoCliente,
  FluxoConsultarClientes,
  FluxoExcluirPedidoVenda,
  FluxoIncluirPedidoVenda,
  FluxoDuplicarPedidoVenda,
  FluxoConsultarIndicadores,
  FluxoGerarRelatorio,
  FluxoGerarRelatorioEspecifico
} from './src/modules/fluxos.js';
const tokensPorVU = {};

// Configurações do teste
export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '5s', target: 20 },
    { duration: '10s', target: 30 },
    { duration: '3s', target: 40 },
    { duration: '15s', target: 50 },
    { duration: '60s', target: 50 },
    { duration: '30s', target: 0 },
  ]/*,
  thresholds: {
    http_req_duration: ['p(99)<50'],
  },*/
};
/*
export let options = {
  vus: 40,
  duration: TEMPO_DURACAO_TESTE
};*/

// Função principal do teste
export default async function () {
  const valorMaximo = USUARIOS_VIRTUAIS.length;
  const indiceAleatorio = Math.floor(Math.random() * valorMaximo);
  const tempo = '1s';

  const indiceVU = __VU;
  const usuarioBase = USUARIOS_VIRTUAIS[(indiceVU - 1) % USUARIOS_VIRTUAIS.length];

  if (!tokensPorVU[indiceVU]) {
    //console.log(`[LOGIN] VU ${indiceVU} logando como ${usuarioBase.username}`);
    const token = login(usuarioBase.username, usuarioBase.password);
    tokensPorVU[indiceVU] = token;
  }

  const usuario = {
    usuarioBase,
    token: tokensPorVU[indiceVU]
  };

  //FluxoAutenticacao(usuario); agora tem limite de conexões simultâneas
  FluxoConsultarClientes(usuario);
  FluxoEdicaoCliente(usuario);
  FluxoIncluirPedidoVenda(usuario);
  FluxoExcluirPedidoVenda(usuario);
  FluxoDuplicarPedidoVenda(usuario);
  FluxoConsultarIndicadores(usuario);
  //FluxoGerarRelatorio(usuario);
  FluxoGerarRelatorioEspecifico(usuario);
  //obterLog(usuario);
  //sleep(tempo);
}
