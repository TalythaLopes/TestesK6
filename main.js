// k6 run --insecure-skip-tls-verify main.js
//k6.exe run --insecure-skip-tls-verify --out web-dashboard=export=test-report.html .\main.js
import { getUsuarioAutenticado } from './src/util/autenticarUsuario.js';
import * as Fluxos from './src/modules/fluxos.js';
import vendedorScenario from './src/scenarios/vendedor.js';
import analistaScenario from './src/scenarios/analista.js';
import adminScenario from './src/scenarios/admin.js';
import smokeScenario from './src/scenarios/smoke.js';

export const options = {
  scenarios: {
    vendedor: {
      executor: 'ramping-vus',
      exec: 'vendedor',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 20 },
        { duration: '10s', target: 30 },
        { duration: '120s', target: 30 },
        { duration: '20s', target: 0 },
      ],
      tags: { tipo_usuario: 'vendedor' },
    },
    analista: {
      executor: 'ramping-vus',
      exec: 'analista',
      startVUs: 5,
      stages: [
        { duration: '60s', target: 5 },
        { duration: '10s', target: 0 },
      ],
      tags: { tipo_usuario: 'analista' },
    },
    admin: {
      executor: 'ramping-vus',
      exec: 'admin',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 2 },
        { duration: '10s', target: 4 },
        { duration: '60s', target: 4 },
        { duration: '5s', target: 0 },
      ],
      tags: { tipo_usuario: 'admin' },
    }/*,
    smoke: {
      executor: 'per-vu-iterations',
      exec: 'smoke',
      vus: 1,
      iterations: 1,
      maxDuration: '30s',
      tags: { tipo_teste: 'smoke' },
    }*/
  }
};

// Mapear as funções chamadas por cada cenário
export async function vendedor() {
  const usuario = getUsuarioAutenticado();
  await vendedorScenario(usuario);
}

export async function analista() {
  const usuario = getUsuarioAutenticado();
  await analistaScenario(usuario);
}

export async function admin() {
  const usuario = getUsuarioAutenticado();
  await adminScenario(usuario);
}
/*
export async function smoke() {
  const usuario = getUsuarioAutenticado();
  await smokeScenario(usuario);
}*/