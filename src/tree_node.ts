// Classe nó para a árvore
class TreeNode {
    name: string; // Nome do arquivo
    is_directory: boolean; // Se é ou não um diretório
    children: TreeNode[]; // Lista dos nós filhos (auto-referenciado: define a estrutura como árvore n-ária)

    // Construtor, constrói todos vazios.
    constructor(name: string, is_directory: boolean) {
        this.name = name;
        this.is_directory = is_directory;
        this.children = []; // nó recém-criado -> não possui filhos (é folha até que se insira um)
    }

    insert(segments: string[]): void {
        // caso base: não há mais segmentos → return
        if (segments.length == 0) return;

        // 1. pegue o primeiro segmento e o resto
        const first_segment = segments.shift()!;


        // 2. procure em this.children um filho com name igual ao primeiro segmento
        let child = this.children.find(c => c.name === first_segment);

        // 3. se não achou:
        //      - é arquivo ou diretório? (sobrou algum segmento depois deste?)
        //      - crie com new TreeNode(...) e adicione em this.children
        if (child === undefined) {
            child = new TreeNode(first_segment, segments.length > 0);
            this.children.push(child)
        }

        // 4. chame insert no filho, passando só o resto dos segmentos
        child.insert(segments);
    }
}

export {
    TreeNode
}

