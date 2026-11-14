import type { TreeNode } from "./tree_node";

// Ícones em SVG
const icon_root =
    '<svg class="ico ico-root" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.2l2 2.5h8.8A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>' +
    '<path fill="none" d="M12 10v6M12 13l-2.5-2M12 13l2.5-2"/>' +
    '</svg>';

const icon_dir =
    '<svg class="ico ico-dir" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.2l2 2.5h8.8A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>' +
    '</svg>';

const icon_file =
    '<svg class="ico ico-file" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M6.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3z"/>' +
    '<path fill="none" d="M14 3v5h5"/>' +
    '</svg>';

function get_icon(node: TreeNode, level: number): string {
    if (level === 0) return icon_root;
    if (node.is_directory) return icon_dir;
    return icon_file;
}

function get_kind(node: TreeNode, level: number): string {
    if (level === 0) return "is-root";
    if (node.is_directory) return "is-dir";
    return "is-file";
}

function render_node(node: TreeNode, level: number): HTMLLIElement {
    const li = document.createElement("li");
    li.innerHTML = get_icon(node, level);

    const label = document.createElement("span");
    label.className = "name";
    label.textContent = node.name;
    li.appendChild(label);

    if (node.is_directory) {
        const ul = document.createElement("ul");
        for (const child of node.children) {
            ul.appendChild(render_node(child, level + 1));
        }
        li.appendChild(ul);
    }

    return li;
}

function render_text(
    node: TreeNode,
    level: number = 0,
    prefix: string = "",
    is_last: boolean = true
): string {
    const symbol = get_symbol(node, level);
    let text: string;

    function get_symbol(node: TreeNode, level: number): string {
        if (level === 0) return "🪾";
        if (node.is_directory) return "📁";
        return "📄";
    }

    if (level === 0) {
        text = `${symbol} ${node.name}\n`;
    } else {
        text = `${prefix}${is_last ? "└── " : "├── "}${symbol} ${node.name}\n`;
    }

    // o que os filhos herdam: "│   " se o pai ainda tem irmãos abaixo, senão espaços
    const child_prefix = level === 0 ? "" : prefix + (is_last ? "    " : "│   ");

    for (let i = 0; i < node.children.length; i++) {
        const child_is_last = i === node.children.length - 1;
        text += render_text(node.children[i], level + 1, child_prefix, child_is_last);
    }

    return text;

}


// Árvore na horizontal: a profundidade vai para a direita e as folhas
// ficam empilhadas, o que deixa o desenho bem mais compacto.
function render_graph(nodes: TreeNode[]): HTMLDivElement {
    const graph = document.createElement("div");
    graph.className = "tree-graph";

    const node_width = 210;
    const node_height = 36;
    const column_gap = 270; // distância entre colunas (profundidades)
    const row_gap = 48;     // distância entre linhas
    const padding = 24;

    type Position = {
        node: TreeNode;
        x: number;
        y: number;
        depth: number;
    };

    const positions: Position[] = [];
    let next_y = padding;

    // Calcula a posição de cada nó
    function calculate_position(
        node: TreeNode,
        depth: number
    ): number {
        const x = padding + depth * column_gap;

        // Nó folha: recebe a próxima linha livre
        if (node.children.length === 0) {
            const y = next_y;
            next_y += row_gap;

            positions.push({ node, x, y, depth });
            return y;
        }

        // Posiciona os filhos primeiro
        const child_positions = node.children.map(child =>
            calculate_position(child, depth + 1)
        );

        // Centraliza o pai (na vertical) em relação aos filhos
        const y = (
            child_positions[0] +
            child_positions[child_positions.length - 1]
        ) / 2;

        positions.push({ node, x, y, depth });

        return y;
    }

    // Calcula todos os nós da árvore
    for (const node of nodes) {
        calculate_position(node, 0);
        next_y += row_gap / 2;
    }

    const max_depth = Math.max(
        0,
        ...positions.map(position => position.depth)
    );
    const max_y = Math.max(0, ...positions.map(position => position.y));

    const width = padding * 2 + max_depth * column_gap + node_width;
    const height = max_y + node_height + padding;

    graph.style.width = `${width}px`;
    graph.style.height = `${height}px`;

    // Cria o SVG responsável pelas conexões
    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.classList.add("tree-graph-lines");

    const position_map = new Map(
        positions.map(position => [position.node, position])
    );

    // Desenha as curvas entre pais e filhos
    for (const position of positions) {
        for (const child of position.node.children) {
            const child_position = position_map.get(child)!;

            const x1 = position.x + node_width;
            const y1 = position.y + node_height / 2;
            const x2 = child_position.x;
            const y2 = child_position.y + node_height / 2;
            const mid = (x1 + x2) / 2;

            const path = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

            path.setAttribute(
                "d",
                `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
            );

            path.classList.add("tree-graph-line");
            svg.appendChild(path);
        }
    }

    graph.appendChild(svg);

    // Desenha os ícones e nomes
    for (const position of positions) {
        const element = document.createElement("div");

        element.className =
            `tree-graph-node ${get_kind(position.node, position.depth)}`;
        element.style.left = `${position.x}px`;
        element.style.top = `${position.y}px`;
        element.title = position.node.name;
        element.innerHTML = get_icon(position.node, position.depth);

        const label = document.createElement("span");
        label.className = "name";
        label.textContent = position.node.name;
        element.appendChild(label);

        graph.appendChild(element);
    }

    return graph;
}

export { render_node, render_text, render_graph };