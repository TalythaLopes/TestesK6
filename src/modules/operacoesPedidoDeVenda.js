import { sleep } from 'k6';
import { getConsultaDinamica, postCadastroDinamico, postGenerico, montarLog } from '../util/httpClient.js';

/**
 * Consulta um pedido aleatoriamente, e retorna o codigo desse pedido
 */
export function consultarPedidos(pUsuario = null) {
  if (!pUsuario) return;

  const bodyConsultarPedidos = {
    filtros: [
      {
        atributo: 'codigo',
        valor: 0, // 0 para trazer todos os pedidos
        condicao: 'maiorQue'
      }
    ],
    tipo: 'classe',
    nome: 'TConsultaPedidoVendaDAO',
    tamanhoPaginacao: 100,
    pagina: 0
  };

  const resposta = getConsultaDinamica(pUsuario, bodyConsultarPedidos, 'Consultar Pedidos');
  sleep('1s');

  let pedidos = [];

  try {
    pedidos = JSON.parse(resposta.body);
  } catch (e) {
    montarLog(pUsuario, 'Falha ao parsear resposta de pedidos', resposta);
    return;
  }

  if (!Array.isArray(pedidos) || pedidos.length === 0) {
    montarLog(pUsuario, 'Nenhum pedido retornado na consulta', resposta);
    return;
  }

  const indiceAleatorio = Math.floor(Math.random() * pedidos.length);
  const pedidoSelecionado = pedidos[indiceAleatorio];

  if (!pedidoSelecionado || !pedidoSelecionado.codigo) {
    montarLog(pUsuario, 'Pedido selecionado está incompleto', resposta);
    return;
  }

  return pedidoSelecionado.codigo;
}

/**
 * Abre o cadastro do pedido e retorna os dados do pedido
 */
export function abrirCadastroPedido(pUsuario = null, pCodigoPedido = null) {
  if (!pCodigoPedido) return;
  if (!pUsuario) return;
  //Abrir o Cadastro do Pedido
  const bodyAbrirCadastroPedido = {
    nomeClasse: 'TCadastroPedidoVendaDAO',
    metodo: 'abrir',
    parametros: {
      codigo: pCodigoPedido
    }
  };

  const cadastroPedido = postCadastroDinamico(pUsuario, bodyAbrirCadastroPedido, 'Cadastro de Pedido(Abrir)').body;

  return cadastroPedido;
}

/**
 * Inclui um pedido de venda com os dados passados no body
 */
export function incluirPedidoVenda(pUsuario = null, pBodyPedidoVenda = null) {
  if (!pUsuario) return;
  if (!pBodyPedidoVenda) return;

  //Incluir Pedido
  const bodyIncluirPedido = {
    nomeClasse: 'TCadastroPedidoVendaDAO',
    metodo: 'incluir'
  };
  const pedido = postCadastroDinamico(pUsuario, bodyIncluirPedido, 'Cadastro de Pedido(Incluir)').body;
  let codigoPedido = JSON.parse(pedido).codigo ? JSON.parse(pedido).codigo : 0;

  if (!pBodyPedidoVenda) {
    return;
  }

  //Ajusta o Body Dinamicamente atualizando o codigo do pedido em cada um dos detalhes do mestre-detalhe
  pBodyPedidoVenda.parametros.codigo = codigoPedido;
  if (pBodyPedidoVenda.parametros.arquivos.length > 0) {
    pBodyPedidoVenda.parametros.arquivos.forEach(arquivo => {
      arquivo.documentoOrigem = codigoPedido;
    });
  }
  pBodyPedidoVenda.parametros.documentoPedido.codigo = codigoPedido;
  pBodyPedidoVenda.parametros.documentoFiscal.codigo = codigoPedido;
  if (pBodyPedidoVenda.parametros.descontos.length > 0) {
    pBodyPedidoVenda.parametros.descontos.forEach(desconto => {
      desconto.documento = codigoPedido;
    });
  }
  if (pBodyPedidoVenda.parametros.itens.length > 0) {
    pBodyPedidoVenda.parametros.itens.forEach(item => {
      item.documento = codigoPedido;
    });
  }

  //Gravar Pedido
  postCadastroDinamico(pUsuario, pBodyPedidoVenda, 'Cadastro de Pedido(Gravar)');
}

/**
 * Exclui o pedido de venda referente ao codigo informado
 */
export function excluirPedidoVenda(pUsuario = null, pCodigoPedido = null) {
  if (!pCodigoPedido) return;
  if (!pUsuario) return;

  const bodyExcluirPedido = {
    nomeClasse: 'TCadastroPedidoVendaDAO',
    metodo: 'excluir',
    parametros: {
      codigo: pCodigoPedido
    }
  };
  postCadastroDinamico(pUsuario, bodyExcluirPedido, 'Cadastro de Pedido(Excluir)');
}

/**
 * Validar diferenciação dos itens do pedido
 */
export function validarDiferenciacoes(pUsuario = null, pBodyPedido = null) {
  if (!pUsuario) return;
  if (!pBodyPedido) return;
  if (!pBodyPedido.itens.length) return;

  //Atribui o tipo do pedido (Assitência / Venda)
  let tipoPedido = pBodyPedido.tipo;
  let tabela = null;
  let condicao = null;
  let item = null;
  let variacao = null;
  let cor = null;
  let acabamento = null;
  let grade = null;

  // Loop através dos itens
  for (let i = 0; i < pBodyPedido.itens.length; i++) {
    tabela = pBodyPedido.itens[i].tabelaPreco.codigo;
    condicao = pBodyPedido.itens[i].condicaoTabela;
    item = pBodyPedido.itens[i].item.codigo;
    variacao = pBodyPedido.itens[i].variacao.codigo;
    cor = pBodyPedido.itens[i].cor.codigo;
    acabamento = pBodyPedido.itens[i].acabamento.codigo;
    grade = pBodyPedido.itens[i].grade.codigo;

    const retorno = postGenerico(
      '/api/item/diferenciacao',
      {
        tipoPedido,
        tabela,
        condicao,
        item,
        variacao,
        cor,
        acabamento,
        grade
      },
      pUsuario,
      'Cadastro de Pedido(Validar Diferenciacao)'
    ).status;

    if (retorno == 500) return false;
  }
  return true;
}

/**
 * Valida os descontos aplicados no pedido
 */
export function validarDescontos(pUsuario = null, pBodyPedido = null) {
  if (!pUsuario) return;
  if (!pBodyPedido) return;

  const retorno = postGenerico('/api/pedido/descontos', pBodyPedido, pUsuario, 'Cadastro de Pedido(Validar Descontos)').status;

  if (retorno == 200) return true;
  return false;
}
