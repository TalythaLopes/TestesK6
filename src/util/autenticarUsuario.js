import { login } from '../services/auth.js';
import { USUARIOS_VIRTUAIS } from '../../config/env.js';

const tokensCache = {};

export function getUsuarioAutenticado() {
  const indiceVU = __VU;
  const usuarioBase = USUARIOS_VIRTUAIS[(indiceVU - 1) % USUARIOS_VIRTUAIS.length];

  if (!tokensCache[indiceVU]) {
    const token = login(usuarioBase.username, usuarioBase.password);
    tokensCache[indiceVU] = token;
  }

  return {
    usuarioBase,
    token: tokensCache[indiceVU],
  };
}
