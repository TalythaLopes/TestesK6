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

const tokensPorVU = {}; // cache de tokens por VU

// Função utilitária para autenticar
function autenticarUsuario() {
  const indiceVU = __VU;
  const usuarioBase = USUARIOS_VIRTUAIS[(indiceVU - 1) % USUARIOS_VIRTUAIS.length];

  if (!tokensPorVU[indiceVU]) {
    const token = login(usuarioBase.username, usuarioBase.password);
    tokensPorVU[indiceVU] = token;
  }

  return {
    usuarioBase,
    token: tokensPorVU[indiceVU],
  };
}

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '5s', target: 20 },
    { duration: '10s', target: 30 },
    { duration: '3s', target: 40 },
    { duration: '15s', target: 50 },
    { duration: '60s', target: 50 },
    { duration: '30s', target: 0 },
  ]
};

export default async function () {
  const usuario = autenticarUsuario();

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
