import Graph from '../index';
// import GraphData from './mock-data/graph-data';
import GraphData from './mock-data/_graph-data1';
// import GraphData from './mock-data/_graph-data2';
// import GraphData from './mock-data/_graph-data3';
import SpriteMap from './textures/sprite-map';

import {initMenu, initCanvasMenu} from './menu';

let graph = Graph('#app', null, {
    textureInfo: SpriteMap,
    lineAnimation: true,
    sizeAttenuation: true,
    // antialias: false,
    // linkId: 'id'
});

setTimeout(() => {
    graph.update(GraphData).then(() => {
        setTimeout(() => {
            graph.focusOnNode(GraphData.nodes[0]);

            let i = 0;
            let interval = setInterval(() => {
                let start = Math.floor(Math.random() * GraphData.nodes.length);
                graph.lightNodes(GraphData.nodes.slice(start, start + Math.ceil(Math.random() * 10)));
                i++;
                i > 3 && (clearInterval(interval));
            }, 1000)

        }, 1000)
    })
}, 1000);


const operators = {
    append(argument, node) {
        let n = Object.assign({}, node, {id: Math.random().toString().substring(3, 7)});
        graph.appendNode(n).then(() => {
            graph.focusOnNode(n, 500)
        });
    },
    remove(node) {
        graph.removeNode(node);
    },
    update() {
        graph.update();
    },
    clear() {
        graph.clear();
    },
    loadData() {
        graph.update(GraphData);
    },
    removeOther(node) {
        graph.update({nodes: [node]})
    }
};

graph.on('contextmenu.node', (event, node) => {
    initMenu(event).then(({operation, argument}) => {
        operators[operation] && operators[operation](node);
    }).catch(() => null)
});

graph.on('click.link', (event, link) => {
    // console.log(link);
});

graph.on('contextmenu.canvas', (event) => {
    initCanvasMenu(event).then(({operation, argument}) => {
        operators[operation] && operators[operation]();
    }).catch(() => null)
});
