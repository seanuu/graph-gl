import {zoomIdentity} from 'd3-zoom';

export default function (options) {

    return {
        nodesByGroup: new Map(),

        nodeSet: new Set(),
        linkSet: new Set(),

        nodeById: new Map(),
        linkById: new Map(),

        getNodeById: function (id) {
            return this.nodeById.get(id);
        },

        getLinkById: function (id) {
            return this.linkById.get(id);
        },

        // 获取 link id
        getLinkId: function (link) {
            let linkId;
            if (link.id) return link.id;

            if (options.linkId && (linkId = link[options.linkId])) {
                return linkId;
            } else {
                let sourceId = typeof link.source !== 'object'
                    ? `${link.source}` : `${link.source[options.id]}`;
                let targetId = typeof link.target !== 'object'
                    ? `${link.target}` : `${link.target[options.id]}`;

                return `${sourceId}_${targetId}`;
            }
        },

        nodeExist: function (node) {
            return this.nodeSet.has(node[options.id] || node.id)
        },

        linkExist: function (link) {
            return this.linkSet.has(this.getLinkId(link));
        },

        // 初始化基本信息
        initializeBaseInfo: function ({nodes = [], links = []}) {
            let n = nodes.length,
                m = links.length;
            let i, link, node;

            this.nodeSet.clear();
            this.linkSet.clear();

            for (i = 0; i < n; ++i) {
                node = nodes[i];

                node.group = this.propertyOf(node, options.group) + '';
                node.category = this.propertyOf(node, options.category) + '';
                node.nodeLabel = this.propertyOf(node, options.nodeLabel) + '';

                node.id = node[options.id] + '';
                this.nodeSet.add(node.id);
            }

            for (i = 0; i < m; ++i) {
                link = links[i];

                link.linkLabel = this.propertyOf(link, options.linkLabel);

                if (!link.source) link.source = link[options.source];
                if (!link.target) link.target = link[options.target];

                if (!link._sourceId) link._sourceId = typeof link.source !== 'object'
                    ? `${link.source}` : `${link.source[options.id]}`;
                if (!link._targetId) link._targetId = typeof link.target !== 'object'
                    ? `${link.target}` : `${link.target[options.id]}`;

                if (!options.linkId) {
                    link.id = `${link._sourceId}_${link._targetId}`;
                } else {
                    link.id = link[options.linkId] + '';
                }

                this.linkSet.add(link.id);
            }

            this.initCurveness(links);
        },

        // 设置nodeById linkById，用于查找节点连线
        initializeForceData: function ({nodes = [], links = []}) {
            let n = nodes.length,
                m = links.length;
            let i, link, node;

            this.nodeById.clear();
            this.linkById.clear();

            for (i = 0; i < n; ++i) {
                node = nodes[i], node.index = i;

                if (!this.nodeById.get(node.id)) this.nodeById.set(node.id, node);
            }

            for (i = 0; i < m; ++i) {
                link = links[i], link.index = i;

                if (!this.linkById.get(link.id)) this.linkById.set(link.id, link);
            }

            this.initializeGroupData({nodes});
        },

        // 设置 nodesByGroup，用于批量显示或隐藏类型节点
        initializeGroupData: function ({nodes = []}) {

            let n = nodes.length;
            let i, node, groupName;

            this.nodesByGroup.clear();

            for (i = 0; i < n; ++i) {
                if (!(node = nodes[i])) continue;

                groupName = node[options.group];

                if (this.nodesByGroup.get(groupName)) {
                    let nodeSet = this.nodesByGroup.get(groupName);
                    nodeSet.add(node);
                } else {
                    let nodeSet = new Set();
                    nodeSet.add(node);
                    this.nodesByGroup.set(groupName, nodeSet);
                }
            }

        },

        // 设置连线曲度
        initCurveness: function (links = []) {
            let linksCount = {};
            let joinSymbol = '____';

            for (let link of links) {
                let sourceId = link._sourceId;
                let targetId = link._targetId;
                let linkIds = [sourceId, targetId].sort((a, b) => typeof a === 'string' ? a.localeCompare(b) : a - b).join(joinSymbol);

                linksCount[linkIds] = linksCount[linkIds] ? linksCount[linkIds] + 1 : 1;
            }

            for (let ids of Object.keys(linksCount)) {
                if (linksCount[ids] <= 1) continue;
                linkCurveness(ids.split(joinSymbol), links);
            }

            function linkCurveness([id1, id2], links) {
                let curveLinks;
                let curveLevel = new Map();
                let curveStep = 0.2;
                let i, n, link, linkId;

                curveLinks = links.filter((link) => {
                    return ((link._sourceId === id1 && link._targetId === id2)
                        || (link._sourceId === id2 && link._targetId === id1));
                }) || [];

                for (i = 0, n = curveLinks.length; i < n; i++) {
                    link = curveLinks[i];
                    linkId = `${link._sourceId}_${link._targetId}`;

                    if (curveLevel.has(linkId)) {
                        curveLevel.set(linkId, curveLevel.get(linkId) + curveStep);
                    } else {
                        curveLevel.set(linkId, 0.1);
                    }
                    link._curveness = curveLevel.get(linkId);
                }
            }
        },

        // 获取数据属性
        propertyOf: function (data, propertyName) {
            let temp, property, i = 0;
            let properties = propertyName.split(options.splitSymbol);

            while ((temp = data[properties[i]]) !== undefined) {
                i++;
                property = temp;
            }

            return property;
        },

        // 找到与x、y最近的节点
        findClosest: function (x, y, radius, nodes) {
            let dx, dy;
            let d2;
            let node;
            let closest;

            if (radius == null) radius = Infinity;
            else radius *= radius;

            for (let i = 0; i < nodes.length; ++i) {
                if (!(node = nodes[i])) continue;
                if (this.checkHide(node)) continue;
                dx = x - node.x;
                dy = y - node.y;
                d2 = dx * dx + dy * dy;
                if (d2 < radius) {
                    radius = d2;
                    closest = node;
                }
            }

            return closest;
        },

        // 找到节点、连线相关
        findRelation: function (node, data, isLink) {
            let nodes, links;
            node = !isLink ? this.getNodeById(node.id) : this.getLinkById(this.getLinkId(node));

            if (isLink) {
                nodes = [node.source, node.target];
                links = [node];
            } else {
                ({nodes, links} = this.findNodeRelation(node, data));
            }

            return {nodes, links};
        },

        // 找到节点 相关连线、节点
        findNodeRelation: function (node, {links}) {
            let relateNodesSet = new Set();
            let nodeId = node.id;
            let link, relateLinks = [];

            for (let i = 0, n = links.length; i < n; i++) {
                if (!(link = links[i])) continue;
                if ((link.source.id === nodeId || link.target.id === nodeId)) {
                    relateNodesSet.add(link['source']);
                    relateNodesSet.add(link['target']);

                    relateLinks.push(link);
                }
            }

            let relateNodes = Array.from(relateNodesSet);
            if (relateNodes.length === 0) relateNodes.push(node);
            return {nodes: relateNodes, links: relateLinks};
        },

        // 找到给出节点全部显示的变换
        viewTransform: function (nodes, rectInfo, padding = 20) {
            let rect = rectInfo;
            let minX, minY, maxX, maxY;
            let scale;
            let translateX, translateY;
            let graphWidth, graphHeight;

            for (let item of nodes) {
                if (!item) continue;
                if (!minX || minX > item.x) minX = item.x;
                if (!minY || minY > item.y) minY = item.y;
                if (!maxX || maxX < item.x) maxX = item.x;
                if (!maxY || maxY < item.y) maxY = item.y;
            }

            minX -= padding * 2;
            minY -= padding * 2;
            maxX += padding * 2;
            maxY += padding * 2;

            graphWidth = maxX - minX;
            graphHeight = maxY - minY;

            if (graphWidth / graphHeight > rect.width / rect.height) {
                scale = rect.width / graphWidth;
                if (scale > 1) scale = 1;
                translateX = -minX * scale;
                translateY = ((rect.height / scale - graphHeight) / 2 - minY) * scale;
            } else {
                scale = rect.height / graphHeight;
                if (scale > 1) scale = 1;
                translateX = ((rect.width / scale - graphWidth) / 2 - minX) * scale;
                translateY = -minY * scale;
            }

            if (scale >= 1) {
                scale = 1;
                translateX = ((rect.width / scale - graphWidth) / 2 - minX);
                translateY = ((rect.height / scale - graphHeight) / 2 - minY);
            }
            return {
                transform: zoomIdentity.translate(translateX || 1, translateY || 1).scale(scale || 1),
                // translateExtent: [[minX, minY], [maxX, maxY]]
            };
        },

        // 移除状态
        removeStatus: function (data) {
            if (Array.isArray(data)) {
                for (let i = 0, n = data.length; i < n; i++) {
                    data[i] && (data[i]._status = {});
                }
                return;
            } else if (typeof data === 'object' && !(data.nodes || data.links)) {
                data && (data._status = {});
                return;
            }
            const {nodes = [], links = []} = data;

            for (let i = 0, n = nodes.length; i < n; i++) {
                nodes[i] && (nodes[i]._status = {});
            }

            for (let i = 0, n = links.length; i < n; i++) {
                links[i] && (links[i]._status = {});
            }
        },

        // 设置status
        _setStatus: function (data, status, type) {
            if (Array.isArray(data)) {
                for (let i = 0, n = data.length; i < n; i++) {
                    data[i] && (data[i]._status[type] = status);
                }
                return;
            } else if (typeof data === 'object' && !(data.nodes || data.links)) {
                data && (data._status[type] = status);
                return;
            }
            const {nodes = [], links = []} = data;
            let i, n;

            for (i = 0, n = nodes.length; i < n; i++) {
                nodes[i] && (nodes[i]._status[type] = status);
            }

            for (i = 0, n = links.length; i < n; i++) {
                links[i] && (links[i]._status[type] = status);
            }
        },

        // 设置Hover状态
        setStatusHover: function (data, status) {
            this._setStatus(data, status, 'hover');
        },

        // 标记选中
        setStatusSelect: function (data, status) {
            this._setStatus(data, status, 'select');
        },

        // 标记隐藏
        setStatusDim: function (data, status) {
            this._setStatus(data, status, 'dim');
        },

        // 标记突出
        setStatusOutstanding: function (data, status) {
            this._setStatus(data, status, 'outstanding');
        },

        // 检查是否选中
        checkStatusSelect: function (data) {
            return data && data._status.select;
        },

        // 检查是否暗淡
        checkStatusDim: function (data) {
            return data && data._status.dim;
        },

        // 检查是否hover
        checkStatusHover: function (data) {
            return data && data._status.hover;
        },

        // 检查是否突出
        checkStatusOutstanding: function (data) {
            return data && data._status.outstanding;
        },

        // 隐藏
        hide: function (data, status = false) {
            if (Array.isArray(data)) {
                for (let i = 0, n = data.length; i < n; i++) {
                    data[i] && (data[i]._hide = status);
                }
                return;
            } else if (typeof data === 'object' && !(data.nodes || data.links)) {
                data && (data._hide = status);
                return;
            }
            const {nodes = [], links = []} = data;
            let i, n;

            for (i = 0, n = nodes.length; i < n; i++) {
                nodes[i] && (nodes[i]._hide = status);
            }

            for (i = 0, n = links.length; i < n; i++) {
                links[i] && (links[i]._hide = status);
            }
        },

        // 设置连线隐藏
        setLnkHide: function (links) {
            if (!links) return;
            let i, n, link;

            for (i = 0, n = links.length; i < n; i++) {
                if (!(link = links[i])) continue;

                if (this.checkHide(link.source) || this.checkHide(link.target)) {
                    this.hide(link, true);
                } else {
                    this.hide(link, false);
                }
            }
        },

        // 是否隐藏
        checkHide: function (data) {
            return data && data._hide;
        },
    }
}
