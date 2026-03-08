# SRS: Vertex AI Music

## 1. Visão Geral

- **Objetivo:** Criar uma ferramenta para extração e catalogação de metadados musicais (BPM, tom, gênero, biografia do artista) via análise de IA.
- **Público-alvo:** Desenvolvedores em curva de aprendizado com Vertex AI.
- **Escopo:**
  - **Análise Técnica:** Extração de BPM, tom e gênero musical.
  - **Contexto Biográfico:** Nome, datas de nascimento/óbito (foco em artistas solo ou principais).
  - **Fonte:** Vídeos do YouTube (via API).

## 2. Requisitos Funcionais

- [RF01] O sistema deve permitir pesquisa por título/artista via interface web.
- [RF02] O sistema deve consumir a API do YouTube para localizar o vídeo e extrair a url.
- [RF03] O sistema deve processar o áudio do vídeo (ou descrição) via Vertex AI para extrair os metadados.
- [RF04] O sistema deve apresentar os dados em um formato estruturado (JSON) no frontend.
- [RF05] O sistema deve fornecer uma mensagem de erro clara caso a IA não consiga inferir um dado específico (evitando alucinação).

## 3. Requisitos Não Funcionais

- **Desempenho:** Resposta da consulta deve ser concluída em < 60 segundos (considerando latência da API de IA).
- **Segurança:** O uso de chaves de API do Google Cloud/YouTube deve ocorrer exclusivamente no backend (Node.js); nunca expor no frontend.
- **Confiabilidade:** Implementar cache (ex: Redis ou banco local) para evitar múltiplas chamadas à API da IA para a mesma música (redução de custo e tempo).
- **Stack:** React (Frontend), Node.js (Backend/Proxy), Vertex AI API, YouTube Data API.

## 4. Regras de Negócio

- [RN01] Em casos de grupos musicais com muitos membros, a IA deve focar apenas no líder ou vocalista principal para evitar estouro de limite de tokens.
- [RN02] O sistema deve priorizar vídeos oficiais ou áudios originais para garantir maior precisão na análise.
- [RN03] Caso a confiança da resposta da IA seja baixa, o campo deve ser exibido como "Não determinado".

## 5. Fluxo de Usuário

1. Usuário insere o nome da música/artista.
2. O backend consulta o YouTube API e retorna a lista de vídeos correspondentes.
3. Usuário seleciona o vídeo desejado.
4. O backend envia o contexto do vídeo para o Vertex AI com uma estrutura de saída definida (JSON Schema).
5. O sistema exibe os metadados formatados. Caso a IA falhe em algum campo, o frontend exibe um aviso de "dado indisponível".

---

_Documentado em: 2026-03-07_
