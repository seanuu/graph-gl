import GraphData from './graph-data.json';

let data = GraphData;
let nodes = data.nodes.map(function (nodeName, idx) {
    return {
        id: idx,
        name: nodeName,
        value: data.dependentsCount[idx],
        group: Math.floor(Math.random() * 10)
    };
});
let edges = [];
for (let i = 0; i < data.edges.length;) {
    let s = data.edges[i++];
    let t = data.edges[i++];
    edges.push({
        source: s,
        target: t,
        value: i
    });
}

export default {
    nodes: nodes,
    links: edges
};
