//ainda em teste!!!
import * as Fluxos from '../modules/fluxos.js';
import { group } from 'k6';
import { log } from '../util/logger.js';

export default async function (usuario) {
  group('Smoke Test - Cada Fluxo Isoladamente', function () {
    //log('Executando smoke test');

    group('Autenticação', () => Fluxos.FluxoAutenticacao(usuario));
    group('Consultar Clientes', () => Fluxos.FluxoConsultarClientes(usuario));
    group('Editar Cliente', () => Fluxos.FluxoEdicaoCliente(usuario));
    group('Incluir Pedido', () => Fluxos.FluxoIncluirPedidoVenda(usuario));
    group('Excluir Pedido', () => Fluxos.FluxoExcluirPedidoVenda(usuario));
    group('Duplicar Pedido', () => Fluxos.FluxoDuplicarPedidoVenda(usuario));
    group('Indicadores', () => Fluxos.FluxoConsultarIndicadores(usuario));
    group('Relatório Específico', () => Fluxos.FluxoGerarRelatorioEspecifico(usuario));
  });
}