import http from 'k6/http';
import encoding from 'k6/encoding';
import { HOST } from '../../config/env.js';

export function login(username, password) {
  const basicAuth = encoding.b64encode(`${username}:${password}`);
  const headers = {
    Authorization: `Basic ${basicAuth}`
  };

  const res = http.get(`${HOST}/auth/login/vendas/`, { headers });
  
  if (res.status !== 200) {
    throw new Error(`[LOGIN] ❗ Login falhou para ${username}`);
  }

  let token = '';
  try {
    token = res.json(); // retorno é um JSON bruto com a string do token
  } catch (e) {
    console.error(`[LOGIN] Erro ao interpretar resposta JSON: ${res.body}`);
    throw new Error(`[LOGIN] Token inválido para ${username}`);
  }

  if (!token || typeof token !== 'string') {
    console.error(`[LOGIN] Token ausente ou inválido: ${res.body}`);
    throw new Error(`[LOGIN] Token ausente ou inválido`);
  }

  return token;
}

//ainda em teste!!!
export function logout(token, username) {
  if (!token) {
    throw new Error(`[LOGOUT] Token ausente`);
  }

  const headers = {
    Authorization: token, //`Bearer ${token}` ou só `token`
  };

  const res = http.post(`${HOST}/auth/logout`, null, { headers });

  if (res.status !== 200) {
    throw new Error(`[LOGOUT] ❗ Logout falhou para ${username}`);
  }
  return true;
}