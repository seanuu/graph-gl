import Utils from './graph.utils';

import LayoutWorker from './workers/layout.worker';
import Progress from './progress';
import GraphGrid from './grid';
import Legend from './legend';

import {NodeGroup} from './node-group';
import {LinkGroup} from './link-group';
import {LabelGroup} from './label-group';

import * as Selection from 'd3-selection';
import {max, min} from 'd3-array';
import {dispatch} from 'd3-dispatch';

import {zoom as d3Zoom, zoomIdentity} from 'd3-zoom';

import {scaleOrdinal} from 'd3-scale';
import {schemeCategory10} from 'd3-scale-chromatic';
import {drag} from 'd3-drag';
import {interpolateNumber} from 'd3-interpolate'

import * as Stats from 'three/examples/js/libs/stats.min';
import {
    Vector2, WebGLRenderer, OrthographicCamera, Scene, Raycaster, Clock
} from 'three';

export default function (container, d, opts = {}) {
    let data = d;
    let options = Object.assign({
        scaleExtent: [0, Infinity],
        nodeSize: 25,
        labelThreshold: 1 / 4,
        lineIntersectThreshold: 1 / 4,
        curveness: 0,
        antialias: true,
        sizeAttenuation: false,
        lineAnimation: false,
        lineOpacity: 0.65,

        textureInfo: {
            map: {},
            src: '',
            pixel: 128
        },

        // 节点字段，属性多级属性以 . 分隔
        splitSymbol: '.',
        id: 'id',
        category: 'group',
        group: 'group',
        nodeLabel: 'id',

        // 连线字段
        source: 'source',
        target: 'target',
        linkId: '',
        linkLabel: 'value',

        _nodeSize: 20,
        _realSize: 20,
        _lineOpacity: 1
    }, opts);

    container = Selection.select(container).node();
    if (!container) return;

    let initialized;
    let graph;
    let GraphUtils = Utils(options);
    let graphGrid;
    let legend = new Legend(container);
    let containerInfo = container.getBoundingClientRect();

    let interactionLayer;
    let layoutWorker, forceProgress;
    let canvas;

    let groupSet = new Set();
    let groupColor = scaleOrdinal(schemeCategory10);
    let categorySet = new Set();

    let zoom, transform = zoomIdentity;

    let scene, camera, renderer;
    let raycaster, mouse = new Vector2();
    let nodeGroup, linkGroup, labelGroup;
    let stats;

    let node, link;
    let linkEvent = dispatch('click', 'contextmenu');
    let nodeEvent = dispatch('click', 'contextmenu');
    let canvasEvent = dispatch('click', 'contextmenu');

    let dataResolver;
    let doUpdatePosition, interpolates, clock = new Clock(false);

    // 初始化
    function initialize() {
        if (initialized) return;
        initialized = true;
        Selection.select(container).selectAll(`[data-type=graph]`).remove();

        let height = containerInfo.height;
        let width = containerInfo.width;

        // canvas
        canvas = document.createElement('canvas');
        canvas.setAttribute('data-type', 'graph');
        canvas.width = width;
        canvas.height = height;
        container.appendChild(canvas);

        // grid
        graphGrid = new GraphGrid(container);

        // stats
        stats = new Stats();
        stats.dom.style.position = 'absolute';
        container.appendChild(stats.dom);

        // renderer
        renderer = new WebGLRenderer({
            antialias: (!!window.ActiveXObject || 'ActiveXObject' in window) ? false : options.antialias,
            canvas: canvas, precision: 'lowp'
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000);
        renderer.setSize(width, height);

        // camera
        camera = new OrthographicCamera(0, 0, 0, 0, 0.01, Math.max(300, height));
        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = -height / 2;
        camera.bottom = height / 2;
        camera.position.set(width / 2, height / 2, height / 2);
        camera.lookAt(width / 2, height / 2, height / 2);
        camera.updateProjectionMatrix();

        // scene
        scene = new Scene();

        // raycaster
        raycaster = new Raycaster();
        raycaster.linePrecision = 6;

        // nodeGroup, linkGroup, labelGroup
        nodeGroup = new NodeGroup(scene, options, GraphUtils);
        linkGroup = new LinkGroup(scene, options, GraphUtils);
        labelGroup = new LabelGroup(container, options, GraphUtils);

        interactionLayer = labelGroup.ctx.canvas;

        // Draggable
        initDrag(interactionLayer);

        // Zoommable
        initZoom(interactionLayer);

        // Event Listener
        initEvent(interactionLayer);

        // Simulation
        initForce();

        // window resize
        handleWindowResize();

        // post message
        data && update(data);
    }

    function resizeGrid() {
        graphGrid.resizeGrid(transform);
    }

    // 初始化拖动
    function initDrag(canvas) {
        Selection.select(canvas).call(drag()
            .container(canvas)
            .subject(() => {
                // 获取最近节点
                const m = Selection.mouse(renderer.domElement);
                const nodes = data.nodes;
                const radius = options._realSize;

                const x = transform.invertX(m[0]);
                const y = transform.invertY(m[1]);
                const node = GraphUtils.findClosest(x, y, radius, nodes);

                if (!node) return;
                return {
                    x: transform.applyX(node.x),
                    y: transform.applyY(node.y),
                    node: node
                };
            })
            .on('drag', () => {
                // 设置拖动事件
                const event = Selection.event;
                event.subject.node.x = transform.invertX(event.x);
                event.subject.node.y = transform.invertY(event.y);

                nodeGroup.updateNodePosition(event.subject.node);
                linkGroup.updateLinkPositionByNode(node);
                labelGroup.startUpdate(data, transform);
            })
            .on('end', () => {
                labelGroup.stopUpdate(data, transform);
            })
        );
    }

    // 初始化缩放
    function initZoom(canvas) {
        zoom = d3Zoom()
            .scaleExtent([0, Infinity])
            .filter(() => Selection.event.button !== 2 && Selection.event.buttons !== 2)
            .on('zoom', () => {
                if (dataResolver || dataResolver === undefined) return;

                transform = Selection.event.transform;
                let x = transform.x;
                let y = transform.y;
                let attenuation = options.sizeAttenuation ? 0.8 : Math.sqrt(transform.k);
                options._nodeSize = transform.k > 1 ? options.nodeSize * transform.k / Math.sqrt(transform.k) : options.nodeSize * attenuation;
                options._realSize = transform.k > 1 ? options.nodeSize / Math.sqrt(transform.k) : options.nodeSize / transform.k * attenuation;
                options._lineOpacity = max([0.1, min([options.lineOpacity, Math.sqrt(transform.k)])]);

                scene.position.set(x, y, 0);
                scene.scale.set(transform.k, transform.k, 1);
                resizeGrid();

                nodeGroup.updateNodeGroupSize();
                linkGroup.updateLinkGroupOpacity();
                labelGroup.startUpdate(data, transform);
            })
            .on('end', () => {
                labelGroup.stopUpdate(data, transform);
            });
        Selection.select(canvas)
            .call(zoom)
            .on('dblclick.zoom', null);
        zoom.transform(Selection.select(canvas), zoomIdentity.translate(containerInfo.width / 2, containerInfo.height / 2));
    }

    // 初始化事件
    function initEvent(canvas) {
        Selection.select(canvas)
            .on('mousemove', () => {
                if (dataResolver || dataResolver === undefined) return;
                let m = Selection.mouse(renderer.domElement);
                mouse.x = (m[0] / containerInfo.width) * 2 - 1;
                mouse.y = -(m[1] / containerInfo.height) * 2 + 1;

                let nodes = data.nodes;
                let radius = options._realSize;

                let x = transform.invertX(m[0]);
                let y = transform.invertY(m[1]);
                let find = GraphUtils.findClosest(x, y, radius, nodes);

                // 移入、移出，获取节点
                if ((find && ((node && node !== find) || !node)) || (!find && node)) {
                    if (find) GraphUtils.setStatusHover(find, true);
                    if (node) GraphUtils.setStatusHover(node, false);
                }
                node = find;

                canvas.style.cursor = node || link ? 'pointer' : 'default';
            })
            .on('click', () => {
                if (dataResolver || dataResolver === undefined) return;
                let event = Selection.event;
                event.preventDefault();

                let interaction = node || link;

                if (!interaction) {
                    canvasEvent.call('click', graph, event);
                    return;
                }

                showRelatedRelation(interaction, interaction === link);
                nodeGroup.updateNodeGroup();
                linkGroup.updateLinkGroup();
                labelGroup.updateOnce(data, transform);

                if (interaction === node) {
                    // 用于节点菜单
                    event._clientX = transform.applyX(node.x) + containerInfo.left;
                    event._clientY = transform.applyY(node.y) + containerInfo.top;
                    nodeEvent.call('click', graph, event, interaction);
                }
                if (interaction === link) linkEvent.call('click', graph, event, interaction);
            })
            .on('contextmenu', () => {
                let event = Selection.event;
                event.preventDefault();
                let interaction = node || link;

                if (!interaction) {
                    canvasEvent.call('contextmenu', graph, event);
                    return;
                }
                if (interaction === node) {
                    // 用于节点菜单
                    event._clientX = transform.applyX(node.x) + containerInfo.left;
                    event._clientY = transform.applyY(node.y) + containerInfo.top;
                    nodeEvent.call('contextmenu', graph, event, interaction);
                }
                if (interaction === link) linkEvent.call('contextmenu', graph, event, interaction);
            });

        // 设置 legend 事件
        legend.on('click', (groupName, hide) => {
            if (dataResolver || dataResolver === undefined) return;
            let groupSet;
            if (!(groupSet = GraphUtils.nodesByGroup.get(groupName))) return;

            let nodes = Array.from(groupSet);
            GraphUtils.hide(nodes, hide);
            GraphUtils.setLnkHide(data.links);

            nodeGroup.updateNodeGroup();
            linkGroup.updateLinkGroup();
            labelGroup.updateOnce();
        });
    }

    // 设置simulate
    function initForce() {
        layoutWorker = new LayoutWorker();
        forceProgress = new Progress(container);

        layoutWorker.onmessage = event => {
            if (event.data.type === 'tick') {

                forceProgress.setProgress(event.data.progress);

            } else if (event.data.type === 'end') {
                data = {
                    nodes: event.data.nodes,
                    links: event.data.links
                };
                // 隐藏进度条
                forceProgress.hide();

                // 创建图形
                createGroupObjects();

                // transition 设置位置插值
                let node;
                interpolates = [];
                for (let i = 0, n = data.nodes.length; i < n; i++) {
                    node = data.nodes[i];
                    interpolates.push({
                        x: interpolateNumber(node._x, node.x),
                        y: interpolateNumber(node._y, node.y)
                    });
                }
                doUpdatePosition = true;
                clock.start();

                // 缩放界面
                updateView(data.nodes);

                // inform resolved
                try {
                    dataResolver(true);
                    dataResolver = null;
                } catch (err) {
                    console.error(err.message);
                }
            }
        };

        // 初始仿真
        layoutWorker.postMessage({type: 'init', options: options});
    }

    // 处理生成图形相关
    function createGroupObjects() {
        let group, category;
        let i, n, node, nodes;
        nodes = data.nodes;

        // 更新分类颜色、设置材质
        groupSet.clear();
        categorySet.clear();

        for (i = 0, n = data.nodes.length; i < n; i++) {
            if (!(node = nodes[i])) continue;

            group = node.group;
            if (!groupSet.has(group)) groupSet.add(group);

            category = node.category;

            node._sprit = options.textureInfo.map[category] || 0;
            if (!categorySet.has(category)) categorySet.add(category);
        }
        groupColor.domain(Array.from(groupSet));

        // 更新用于图形的关系数据
        GraphUtils.initializeForceData(data);

        // 生成标签
        legend.generateLegend({groupSet, groupColor}, dataResolver);

        // 生成nodeGroup, linkGroup
        nodeGroup.generateNodeGroup(data.nodes, groupColor);
        linkGroup.generateLinkGroup(data.links, groupColor);
    }

    // resize
    function handleWindowResize() {
        window.addEventListener('resize', () => {
            containerInfo = container.getBoundingClientRect();
            let height = containerInfo.height;
            let width = containerInfo.width;

            camera.left = -width / 2;
            camera.right = width / 2;
            camera.top = -height / 2;
            camera.bottom = height / 2;
            camera.position.set(width / 2, height / 2, height / 2);
            camera.lookAt(width / 2, height / 2, height / 2);
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);

            resizeGrid();
            nodeGroup.updateNodeGroupPosition();
        });
    }

    // 更新视图
    function updateView(nodes, duration = 500) {
        const padding = options._realSize;
        const viewTransform = GraphUtils.viewTransform(nodes, containerInfo, padding);

        if (nodes === data.nodes) {
            zoom.scaleExtent([viewTransform.transform.k > options.scaleExtent[0]
                ? options.scaleExtent[0]
                : viewTransform.transform.k, options.scaleExtent[1]]);
        }

        zoom.transform(Selection.select(interactionLayer).transition().duration(duration), viewTransform.transform);
    }

    // 更新数据
    function update(forceData = data) {
        if (!forceData && dataResolver === undefined) return;

        let node, link;
        data = {
            nodes: [],
            links: []
        };
        // 浅复制
        for (let i = 0, n = (forceData.nodes && forceData.nodes.length) || 0; i < n; i++) {
            if (!(node = forceData.nodes[i])) continue;
            // 记录过渡位置
            node._x = node.x || 0;
            node._y = node.y || 0;
            data.nodes.push(node);
        }
        for (let i = 0, n = (forceData.links && forceData.links.length) || 0; i < n; i++) {
            if (!(link = forceData.links[i])) continue;
            data.links.push(link);
        }

        // init base info
        GraphUtils.initializeBaseInfo(data);

        // set status prop
        GraphUtils.removeStatus(forceData);
        GraphUtils.hide(forceData, false);

        // post force data
        layoutWorker.postMessage({
            type: 'update',
            nodes: data.nodes,
            links: data.links,
            options: options
        });

        return new Promise(resolve => {
            dataResolver = resolve;
        });
    }

    // 展示节点、连线相关
    function showRelatedRelation(node, isLink) {
        node = !isLink ? GraphUtils.getNodeById(node.id) : GraphUtils.getLinkById(GraphUtils.getLinkId(node));

        if (GraphUtils.checkStatusSelect(node) || !node) {
            GraphUtils.removeStatus(data);
            return;
        }

        // 清除所有状态
        GraphUtils.removeStatus(data);

        // 暗淡所有连线、节点
        GraphUtils.setStatusDim(data, true);

        // 还原相关连线、节点
        let {nodes, links}= GraphUtils.findRelation(node, data, isLink);

        GraphUtils.removeStatus({nodes, links});
        GraphUtils.setStatusOutstanding({nodes, links}, true);
        GraphUtils.setStatusSelect(node, true);

        return {nodes, links};
    }

    // 连线找点
    function intersectWithLine() {
        if (transform.k < options.lineIntersectThreshold) {
            if (link) GraphUtils.setStatusHover(link, false), linkGroup.updateLinkColor(link), link = null;
            return;
        }

        raycaster.setFromCamera(mouse, camera);

        let intersects = raycaster.intersectObject(linkGroup.object3d, false);

        if (!node) {
            let find = linkGroup.findLinkByIntersect(intersects[0]);

            // 移入、移出
            if ((find && ((link && link !== find) || !link)) || (!find && link)) {
                if (find) GraphUtils.setStatusHover(find, true);
                if (link) GraphUtils.setStatusHover(link, false);
                linkGroup.updateLinkColor([find, link]);
                labelGroup.updateOnce(data, transform);
            }

            link = find;
        } else {
            if (!link) return;
            GraphUtils.setStatusHover(link, false);
            linkGroup.updateLinkColor(link);
            labelGroup.updateOnce(data, transform);
            link = null;
        }
    }

    // 节点位置过渡
    function positionTransition() {
        if (doUpdatePosition) {
            let elapsed = clock.getElapsedTime() * 1000;
            let duration = 300;
            if (elapsed > duration) {
                doUpdatePosition = false;
                clock.stop();

                positioned(1);
            }
            positioned(elapsed / duration);

            nodeGroup.updateNodeGroupPosition();
            linkGroup.updateLinkGroupPosition();
        }

        function positioned(t) {
            let node;
            for (let i = 0, n = data.nodes.length; i < n; i++) {
                node = data.nodes[i];
                if (!node) continue;
                node.x = interpolates[i].x(t);
                node.y = interpolates[i].y(t);
            }
        }
    }

    // 渲染
    function animate() {
        requestAnimationFrame(animate);
        if (dataResolver || dataResolver === undefined) return;

        // 节点更新过渡
        positionTransition();

        // 连线交互
        intersectWithLine();

        renderer.render(scene, camera);

        stats.update();

        // 连线轨迹
        if (options.lineAnimation) linkGroup.animateLinkDirection(2 * 1000);
    }

    initialize();
    animate();

    return graph = {
        // redo everything
        update: update,

        // clear data && canvas
        clear: function() {
            return update({nodes: [], links: []});
        },

        // repaint graph
        repaintAll: function () {
            linkGroup.updateLinkGroup();
            nodeGroup.updateNodeGroup();
            labelGroup.updateOnce(data, transform);

            return graph;
        },

        // append force data to graph
        appendData: function ({nodes = [], links = []}) {
            let nodeArray = [], linkArray = [];
            let i, length, node, link;

            for (i = 0, length = nodes.length; i < length; i++) {
                node = nodes[i];

                if (GraphUtils.nodeExist(node)) return;
                nodeArray.push(node);
            }

            for (i = 0, length = links.length; i < length; i++) {
                link = links[i];

                if (GraphUtils.linkExist(link)) return;
                linkArray.push(link);
            }

            if (nodeArray.length === 0 || linkArray.length === 0) return;

            data.nodes = data.nodes.concat(nodeArray);
            data.links = data.links.concat(linkArray);

            return update(data);
        },

        // append node to graph
        appendNode: function (node) {
            if (GraphUtils.nodeExist(node)) return;

            data.nodes.push(node);

            return update(data);
        },

        // append link to graph
        appendLink: function (link) {
            if (GraphUtils.linkExist(link)) return;
            if (
                !GraphUtils.nodeExist(typeof link.source !== 'object' ? link.source.id : link[options.source]) ||
                !GraphUtils.nodeExist(typeof link.target !== 'object' ? link.target.id : link[options.target])
            ) return;

            data.links.push(link);

            return update(data);
        },

        // remove node from graph
        removeNode: function (node) {
            if (!node) return;
            const {links} = GraphUtils.findNodeRelation(node, data);

            // 避免重新生成图形
            for (let i = 0, n = links.length; i < n; i++) {
                delete data.links[links[i].index];
            }
            delete data.nodes[node.index];

            this.repaintAll();

            return graph;
        },

        // remove link from graph
        removeLink: function (link) {
            if (!link) return;
            delete data.links[link.index];

            this.repaintAll();

            return graph;
        },

        // 返回过滤节点
        filterNodes: function(queryString) {
            const nodes = this.nodes.sort((a, b) => {
                return b[this.options['id']] - a[this.options['id']] || a[this.options['id']].localeCompare(b[this.options['id']]);
            });

            return queryString ? nodes.filter((node) => {
                return (node[this.options.id].toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            }) : nodes;
        },

        // 事件监听
        on: function (typename, _) {
            let t = parseTypename(typename);

            switch (t.name) {
                case 'node':
                    return arguments.length > 1 ? (nodeEvent.on(t.type, _), graph) : nodeEvent.on(t.type);
                case 'link':
                    return arguments.length > 1 ? (linkEvent.on(t.type, _), graph) : linkEvent.on(t.type);
                case 'canvas':
                    return arguments.length > 1 ? (canvasEvent.on(t.type, _), graph) : canvasEvent.on(t.type);
            }

            function parseTypename(t) {
                let name = '', i = t.indexOf('.');
                if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
                return {type: t, name: name};
            }
        },

        // public 节点正中
        focusOnNode: function(node, duration = 500) {
            if (!node) return;

            node = GraphUtils.getNodeById(node[options.id]);

            let x = -node.x + containerInfo.width / 2;
            let y = -node.y + containerInfo.height / 2;

            zoom.transform(
                Selection.select(interactionLayer).transition().duration(duration),
                (zoomIdentity.translate(x, y).scale(1))
            );

            return graph;
        },

        // public 批量节点正中
        focusOnNodes: function(nodes = []) {
            let nodeG = [], node;
            for (let i = 0, n = nodes.length; i < n; i++) {
                node = nodes[i];
                node = GraphUtils.getNodeById(node.id || node[options.id]);
                node && nodeG.push(node);
            }
            updateView(nodeG);

            return graph;
        },

        // 找到节点、连线相关数据
        findRelation: function (d, isLink) {
            return GraphUtils.findRelation(d, data, isLink)
        },

        // 高亮批量节点
        lightNodes: function (nodes) {
            let nodeG = [], node, nodeById = new Map();
            let linkG = [], link, links = data.links;

            for (let i = 0, n = nodes.length; i < n; i++) {
                node = nodes[i];
                node = GraphUtils.getNodeById(node.id || node[options.id]);
                node && (nodeG.push(node), nodeById.set(node.id, node));
            }

            for (let i = 0, n = links.length; i < n; i++) {
                if (!(link = links[i])) continue;
                if (nodeById.has(link.source.id) && nodeById.has(link.target.id)) {
                    linkG.push(link);
                }
            }
            // 设置状态
            GraphUtils.removeStatus(data);
            GraphUtils.setStatusDim(data, true);
            GraphUtils.removeStatus({nodes: nodeG, links: linkG});
            GraphUtils.setStatusOutstanding({nodes: nodeG, links: linkG}, true);

            // 更新颜色
            nodeGroup.updateNodeGroup();
            linkGroup.updateLinkGroup();

            updateView(nodeG);

            return graph;
        }
    };
}
