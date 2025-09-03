# <p align="center"> 🧪 Testes de Performance com K6 </p>

## Resumo 
Este repositório contém uma suíte de **testes de performance** utilizando o [K6.io](https://k6.io/). O objetivo é simular fluxos reais de uso da aplicação, garantindo **confiabilidade, escalabilidade e estabilidade** da API do WebService sob diferentes cenários. O **K6** é uma ferramenta de código aberto, escrita em Go, mas que permite a implementação de testes usando **JavaScript** tornando mais acessível e flexível para times de desenvolvimento.  

O projeto está em desenvolvimento e o foco principal é avaliar a performance da aplicação e identificar possíveis gargalos. Este é um protótipo em evolução, mas já pode ser utilizado como base para cenários de testes.

## Funcionalidades  
- 🔥 **Testes de fumaça** para validar fluxos críticos rapidamente  
- 💥 **Testes de estresse** simulando um número de usuários virtuais bem acima do esperado
- 📈 **Testes de carga** simulando múltiplos usuários virtuais
- 🔧 **Cenários modulares**: cada fluxo de negócio tem seu próprio arquivo
- 🧩 Arquitetura extensível: fácil adicionar novos cenários de negócio
- 📊 Coleta de métricas detalhadas: tempos de resposta, throughput e taxa de erros

## Instruções  
1. **Instalação do K6**  
   Siga a documentação oficial: [k6.io](https://k6.io/docs/get-started/installation/)
   Atenção: para o funcionamento completo é necessário instalar a **versão 0.50.0**!

2. **Configurações**  
   - No arquivo `config/env.js`, defina variáveis como `HOST` e `USUARIOS_VIRTUAIS`.  
   - Tokens são gerados dinamicamente. 

3. **Fluxos de Negócio**  
   - Para relatórios e pedidos de venda, ajuste os dados de entrada em `data/relatorio.js` e `data/pedidoDeVenda.js`.  
   - Esses valores podem ser extraídos via **DevTools**.  

4. **Executando os testes**
   
   Exemplo de execução:  
   ```bash
   k6 run --insecure-skip-tls-verify main.js
   ````
<p align="center"> 
  <img width="95%" alt="K6-users" src="https://github.com/user-attachments/assets/f6233559-6d98-4865-9415-37a9adc886d6" />
</p>

  - O parâmetro `--insecure-skip-tls-verify` ignora a validação TLS.
  - O arquivo main.js gerencia qual cenário será rodado.

  Exemplo de execução - teste de estresse:  
   ```bash
   k6 run --insecure-skip-tls-verify main.js --env TEST_TYPE=estresse
   ````
<p align="center">   
  <img width="95%" alt="K6-estresse" src="https://github.com/user-attachments/assets/79cbe6fb-f069-48f5-95fb-c7e8ac1e0801" />
</p>
   
  Exemplo de execução - teste de carga:  
   ```bash
   k6 run --insecure-skip-tls-verify main.js --env TEST_TYPE=carga
   ````
<p align="center"> 
  <img width="70%" alt="K6-carga" src="https://github.com/user-attachments/assets/3d1f7215-01b0-40a8-9c16-f4715a7d9b4b" />
</p>

## Tecnologias Utilizadas
<p align="center">
  <a href="https://k6.io/"><img src="https://img.shields.io/badge/K6.io-7D64FF?style=for-the-badge&logo=k6&logoColor=white" alt="K6"/></a>
  <a href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript"/></a>
  <a href="https://grafana.com/"><img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana"/></a>
</p>

A escolha das tecnologias foi motivada pelo K6 ser **leve, rápida** e de fácil integração com pipelines de CI/CD, além de possuir **relatórios detalhados** e suporte a **cenários personalizados**. Linguagem de script foi escolhida por ser familiar à equipe e ter suporte nativo no K6. O uso do Grafana foi planejado para análise visual das métricas, permitindo dashboards em tempo real. 

## Ideias Futuras

- **Integrar** com Grafana para monitoramento em tempo real
- **Implementar** notificações automáticas em caso de falha (Teams)
- **Automatizar** execução em pipelines CI/CD
- **Adicionar** testes de pico, imersão e API para análises mais completas
- **Estudar** e **implementar** geração de relatórios que se autoincrementam a cada execução dos testes
- **Permitir** cenários parametrizados com arquivos .env ou JSON
- **Adicionar** testes de regressão de performance para para comparação automática com execuções anteriores

