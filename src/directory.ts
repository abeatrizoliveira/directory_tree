import { TreeNode } from "./tree_node";
import { render_node, render_text, render_graph } from "./tree_view";

const directory = document.getElementById("directory") as HTMLInputElement;
const list = document.getElementById("list") as HTMLUListElement;
const text = document.getElementById("text") as HTMLPreElement;
const btn_list = document.getElementById("btn_list") as HTMLButtonElement;
const btn_text = document.getElementById("btn_text") as HTMLButtonElement;
const graph = document.getElementById("graph") as HTMLDivElement;
const btn_graph = document.getElementById("btn_graph") as HTMLButtonElement;

directory.addEventListener("change", () => {
    const root = new TreeNode("", true);
    const files = Array.from(directory.files ?? []);

    for (const f of files) {
        root.insert(f.webkitRelativePath.split("/"));
    }

    list.innerHTML = "";
    text.textContent = "";
    for (const child of root.children) {
        list.appendChild(render_node(child, 0));
        text.textContent += render_text(child);
    }
    graph.innerHTML = "";

graph.appendChild(render_graph(root.children));
});

btn_list.addEventListener("click", () => {
    list.hidden = false;
    text.hidden = true;
    graph.hidden = true;
});

btn_text.addEventListener("click", () => {
    list.hidden = true;
    text.hidden = false;
    graph.hidden = true;
});

btn_graph.addEventListener("click", () => {
    list.hidden = true;
    text.hidden = true;
    graph.hidden = false;
});

const form = document.getElementById("form") as HTMLFormElement;
form.addEventListener("reset", () => {
    list.innerHTML = "";
    text.textContent = "";
    graph.innerHTML = "";
});