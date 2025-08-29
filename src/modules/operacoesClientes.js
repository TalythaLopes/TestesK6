import { sleep } from 'k6';
import { getConsultaDinamica, postCadastroDinamico, montarLog } from '../util/httpClient.js';

/**
 * Consulta um cliente aleatoriamente e retorna o codigo desse cliente
 */
export function consultarClientes(pUsuario = null) {
  if (!pUsuario) return;

  const bodyConsultarClientes = {
    filtros: [
      {
        atributo: 'razaoSocial',
        valor: 'A',
        condicao: 'queContem'
      }
    ],
    tipo: 'classe',
    nome: 'TConsultaClienteDAO',
    tamanhoPaginacao: 100,
    pagina: 0
  };

  const resposta = getConsultaDinamica(pUsuario, bodyConsultarClientes, 'Cliente(Consultar)');
  sleep('3s');

  let clientes;
  try {
    clientes = JSON.parse(resposta.body);
  } catch (e) {
    montarLog(pUsuario, 'Falha ao parsear resposta de clientes', resposta);
    return;
  }

  if (!Array.isArray(clientes) || clientes.length === 0) {
    montarLog(pUsuario, 'Nenhum cliente retornado na consulta', resposta);
    return;
  }

  const indiceAleatorio = Math.floor(Math.random() * clientes.length);
  const clienteSelecionado = clientes[indiceAleatorio];

  if (!clienteSelecionado || !clienteSelecionado.codigo) {
    montarLog(pUsuario, 'Cliente selecionado está incompleto', resposta);
    return;
  }

  return clienteSelecionado.codigo;
}

/**
 * Abre o cadastro de um cliente e retorna os dados desse cliente
 */
export function abrirCadastroCliente(pUsuario = null, pCodigoCliente = null) {
  //Abrir o Cadastro de Cliente
  const bodyAbrirCadastroCliente = {
    nomeClasse: 'TCadastroClienteDAO',
    metodo: 'abrir',
    parametros: {
      codigo: pCodigoCliente
    }
  };
  //Pegar os dados do cliente
  const cadastroCliente = postCadastroDinamico(pUsuario, bodyAbrirCadastroCliente, 'Cadastro de Cliente(Abrir)').body;

  return cadastroCliente;
}

/**
 * Altera o estado do cadastro relacionado ao codigo do cliente para EDIÇÃO
 */
export function entrarModoEdicaoCliente(pUsuario = null, pCodigoCliente = null) {
  if (!pCodigoCliente) return;
  if (!pUsuario) return;

  //Entrar em modo de edição
  const bodyEditarCadastroCliente = {
    nomeClasse: 'TCadastroClienteDAO',
    metodo: 'alterar'
  };
  postCadastroDinamico(pUsuario, bodyEditarCadastroCliente, 'Cadastro Cliente(Editar)');
}

/**
 * Grava a edição do cliente de acordo com os dados passados
 */
export function gravarCadastroEditadoCliente(pUsuario = null, pCadastroCliente = null) {
  if (!pCadastroCliente) return;
  if (!pUsuario) return;

  //Gravar edicao
  const bodyGravarCadastroCliente = {
    nomeClasse: 'TCadastroClienteDAO',
    metodo: 'gravar',
    parametros: JSON.parse(pCadastroCliente)
  };
  postCadastroDinamico(pUsuario, bodyGravarCadastroCliente, 'Cadastro de Cliente(Gravar)');
}
