let nodes = new Array(2000 * 5).fill(0).map((item, idx) => {
    return {
        id: `${idx * 1000}`,
        name: idx,
        group: Math.floor(Math.random() * 10)
    };
});
let links = nodes.map((node, index) => {
    return {
        source: node.id,
        target: nodes[index - 1 < 0 ? index : index - 1].id,
        value: index,
        id: Math.random().toString().substring(3)
    };
});
let links2 = nodes.map((node, index) => {
    return {
        source: node.id,
        target: nodes[index - 2 < 0 ? index : index - 2].id,
        value: index,
        id: Math.random().toString().substring(3)
    };
});
let links3 = nodes.map((node, index) => {
    let iii = Math.ceil(Math.random() * 40);
    return {
        source: node.id,
        target: nodes[index - iii < 0 ? index : index - iii].id,
        value: index,
        id: Math.random().toString().substring(3)
    };
});
export default {
    nodes, links: links.concat(links2).concat(links3)
};
