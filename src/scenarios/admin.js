import {
  FluxoConsultarClientes,
  FluxoEdicaoCliente,
  FluxoIncluirPedidoVenda,
  FluxoConsultarIndicadores,
  FluxoGerarRelatorioEspecifico,
  FluxoExcluirPedidoVenda,
  FluxoDuplicarPedidoVenda
} from '../modules/fluxos.js';
import { group } from 'k6';
import { log } from '../util/logger.js';

export default async function (usuario) {
  group('Admin - Fluxo Completo', function () {
    ///log('Iniciando fluxo admin');

    FluxoConsultarClientes(usuario);
    FluxoEdicaoCliente(usuario);
    FluxoIncluirPedidoVenda(usuario);
    FluxoExcluirPedidoVenda(usuario);
    FluxoDuplicarPedidoVenda(usuario);
    FluxoConsultarIndicadores(usuario);
    FluxoGerarRelatorioEspecifico(usuario);
  });
}