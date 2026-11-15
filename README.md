# Árvore de diretórios

Escolha uma pasta do seu computador e veja a estrutura dela como **lista**, **markdown** ou **árvore (grafo)**.

Projeto desenvolvido para a disciplina de Estruturas de Dados, usando uma árvore n-ária para representar pastas e arquivos.

<br>

## Links

- **Aplicação:** https://directory-tree.vercel.app/
- **Slides:** https://canva.link/wlo60cchzt8r4j3

<br>

## Funcionalidades

- Seleção de uma pasta inteira pelo navegador
- Três formas de visualizar a mesma árvore:
  - **Lista:** hierarquia com ícones e linhas de ligação
  - **Markdown:** formato semelhante ao comando `tree`, fácil de copiar
  - **Árvore:** grafo horizontal com pastas e arquivos conectados
- Botão para limpar e escolher outra pasta

> Tudo acontece no seu navegador. Nenhum arquivo é enviado para servidor algum, o programa lê apenas os caminhos.
<br>

## Como funciona

1. O navegador informa o caminho de cada arquivo da pasta escolhida (`webkitRelativePath`), por exemplo `projeto/src/main.ts`.
2. Cada caminho é dividido em segmentos (`projeto`, `src`, `main.ts`) e inserido na árvore.
3. A árvore é desenhada nas três visualizações.

<br>

### Conceitos usados

| Conceito | No projeto |
| --- | --- |
| **Árvore n-ária** | Cada nó pode ter qualquer número de filhos |
| **Raiz** | Nó do topo, sem pai (a pasta escolhida) |
| **Nó interno** | Pasta que tem conteúdo |
| **Folha** | Nó sem filhos (os arquivos) |
| **Auto-referência** | `TreeNode` guarda `children: TreeNode[]`, uma lista do próprio tipo |
| **Recursão** | `insert` e as funções de renderização chamam a si mesmas para cada filho |
| **Caminhamento em pré-ordem** | Lista e texto: visitam o nó e depois os filhos |
| **Caminhamento em pós-ordem** | Grafo: posiciona os filhos primeiro para centralizar o pai |

<br>

## Como rodar localmente

Requisitos: [Node.js](https://nodejs.org/) instalado.

```bash
# clonar o repositório
git clone https://github.com/abeatrizoliveira/directory_tree.git
cd directory_tree

# instalar as dependências
npm install

# iniciar em modo de desenvolvimento
npm run dev
```

Para gerar a versão final e testá-la localmente:

```bash
npm run build
npm run preview
```

## Observações

- Pastas vazias não aparecem, porque o navegador informa somente os caminhos dos arquivos.
- A seleção de pastas depende do atributo `webkitdirectory`, disponível nos navegadores modernos.
