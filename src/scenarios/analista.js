import {
  FluxoConsultarIndicadores,
  FluxoGerarRelatorioEspecifico
} from '../modules/fluxos.js';
import { group } from 'k6';
import { log } from '../util/logger.js';

export default async function (usuario) {
  group('Analista - Indicadores e Relatórios', function () {
    //log('Iniciando fluxo do analista');

    FluxoConsultarIndicadores(usuario);
    FluxoGerarRelatorioEspecifico(usuario);
  });
}