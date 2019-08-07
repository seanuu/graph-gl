import * as Force from 'd3-force';
import { scaleQuantize } from 'd3-scale';
import { max, min } from 'd3-array';

const ctx = self;
let simulation;
let tick = scaleQuantize()
    .domain([0, 10000])
    .range([200, 100, 50]);
ctx.addEventListener('message', ({data}) => {
    const options = data.options;
    const nodes = data.nodes;
    const links = data.links;

    switch (data.type) {
    case 'init':
        simulation = initSimulation(options);
        break;

    case 'update':
        simulation.nodes(nodes)
            .force('link').links(links);
        simulation.alpha(1);

        // let n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
        let n = min([max([tick(nodes.length), 15]), 360]);

        for (let i = 0; i < n; ++i) {
            postMessage({type: 'tick', progress: i / n});
            simulation.tick();
        }
        postMessage({type: 'end', nodes: nodes, links: links});
        break;
    }
});

function initSimulation(options) {
    const center = {x: 0, y: 0};

    const forceLink = Force.forceLink()
        .id(data => data[options.id])
        .distance(120);
    const forceCenter = Force.forceCenter(center.x, center.y);
    const forceCollision = Force.forceCollide(75)
        .strength(0.7);
    const forceManyBody = Force.forceManyBody()
        .strength(-2000);
    const forceRadial = Force.forceRadial(100, center.x, center.y)
        .strength(0.03);

    return Force.forceSimulation()
        .force('center', forceCenter)
        .force('collision', forceCollision)
        .force('link', forceLink)
        .force('charge', forceManyBody)
        .force('radial', forceRadial)
        .stop();
}
