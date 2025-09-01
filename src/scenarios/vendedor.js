import {
  FluxoConsultarClientes,
  FluxoIncluirPedidoVenda,
  FluxoExcluirPedidoVenda,
  FluxoDuplicarPedidoVenda,
  FluxoEdicaoCliente
} from '../modules/fluxos.js';
import { group } from 'k6';
import { log } from '../util/logger.js';

export default async function (usuario) {
  group('Vendedor - Operações com Pedido de Venda', function () {
    //log('Iniciando fluxo do vendedor');

    FluxoConsultarClientes(usuario);
    FluxoEdicaoCliente(usuario);
    FluxoIncluirPedidoVenda(usuario);
    FluxoExcluirPedidoVenda(usuario);
    FluxoDuplicarPedidoVenda(usuario);
  });
}