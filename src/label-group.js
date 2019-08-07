import {select} from "d3-selection";
import {timer} from 'd3-timer'

export class LabelGroup {
    constructor(container, options, GraphUtils) {
        let canvas;
        container = select(container).node();
        canvas = select(container).append('canvas')
            .attr('data-type', 'graph')
            .node();

        this.lineLabelColor = '#ffffff';
        this.nodeLabelColor = '#ffffff';
        this.data = {};

        this.containerInfo = container.getBoundingClientRect();
        this.options = options;
        this.GraphUtils = GraphUtils;
        this.ctx = canvas.getContext('2d');

        this.updateTimer = null;
        this.arrow = this._drawArrow();

        resizeCanvas.call(this);

        window.addEventListener('resize', () => {
            resizeCanvas.call(this);
        });

        function resizeCanvas() {
            this.containerInfo = container.getBoundingClientRect();
            select(canvas)
                .attr('height', this.containerInfo.height)
                .attr('width', this.containerInfo.width)
                .attr('style', 'position: absolute; top: 0; left: 0;');

            this.updateOnce();
        }
    }

    _drawArrow() {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let size = 64;
        canvas.height = size;
        canvas.width = size;

        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size, size / 2);
        ctx.lineTo(0, size);
        ctx.lineTo(size / 2, size / 2);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        return ctx.canvas;
    }

    _drawLabel({nodes, links} = this.data, transform = this.transform) {
        if (!(nodes || links) || !transform) return;

        let context = this.ctx;
        let GraphUtils = this.GraphUtils;
        let options = this.options;
        let height = this.containerInfo.height;
        let width = this.containerInfo.width;
        let arrow = this.arrow;
        let lineLabelColor = this.lineLabelColor;
        let nodeLabelColor = this.nodeLabelColor;
        let x, y;
        let showLabel = transform.k > options.labelThreshold;

        context.save();
        context.clearRect(0, 0, width, height);
        // 变换位置
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        context.font = '12px Georgia';
        context.fillStyle = nodeLabelColor;

        // 绘制节点label
        drawNodeLabel();

        // 绘制连线label
        drawLinkLabel();

        context.restore();

        function drawNodeLabel() {
            if (!nodes) return;
            let fontSize = transform.k < 1 ? 12 / transform.k : 12 / Math.sqrt(transform.k);
            let nodeSize = options._realSize;
            let font = `${fontSize}px Georgia`;
            let i, n, node;

            context.save();
            context.textBaseline = 'hanging';
            context.font = font;

            for (i = 0, n = nodes.length; i < n; i++) {
                node = nodes[i];
                if (!node || !node._status || GraphUtils.checkHide(node) || GraphUtils.checkStatusDim(node) ||
                    (!showLabel && !GraphUtils.checkStatusOutstanding(node))) {
                    node && (node._draw = false);
                    continue;
                }

                x = transform.applyX(node.x);
                y = transform.applyY(node.y);
                node._draw = x > 0 && x < width && y > 0 && y < height;
                if (!(node._draw)) continue;

                context.fillText(node.nodeLabel, node.x, node.y + nodeSize);
            }

            context.restore();
        }

        function drawLinkLabel() {
            if (!links) return;

            let transPositions, position;
            let linkLabel, a, nodeSize, arrowSize, u;
            let fontSize = transform.k < 1 ? 10 / transform.k : 10 / Math.sqrt(transform.k);
            let i, n, link;

            arrowSize = fontSize;
            nodeSize = options._realSize;

            context.save();
            context.font = `${fontSize}px Georgia`;
            context.globalAlpha = 0.8;
            context.fillStyle = lineLabelColor;

            for (i = 0, n = links.length; i < n; i++) {
                if (!(link = links[i])) continue;

                if (!link._status || GraphUtils.checkHide(link) ||
                    !(GraphUtils.checkStatusOutstanding(link) || GraphUtils.checkStatusHover(link))) continue;

                position = link._line.getPoint(0.5);
                // 中点不在视野返回
                transPositions = transform.apply([position.x, position.y]);
                if (
                    (!link.source._draw && !link.target._draw) &&
                    !((transPositions[0] > 0 && transPositions[0] < width) && (transPositions[1] > 0 && transPositions[1] < height))
                ) continue;

                linkLabel = link.linkLabel;
                a = link._line.getTangent(0.5);

                // draw label & arrow
                context.save();
                context.translate(position.x, position.y);
                context.rotate(Math.atan(a.y / a.x));
                context.fillText(linkLabel, 0, 0);
                context.restore();

                u = 1 - nodeSize / link._line.getLength();
                position = link._line.getPointAt(u);
                a = link._line.getTangentAt(u);

                // arrow
                context.save();
                context.translate(position.x, position.y);
                context.rotate(Math.atan2(a.y, a.x));
                context.drawImage(arrow, -arrowSize / 2, -arrowSize / 2, arrowSize, arrowSize);
                context.restore();
            }

            context.restore();
        }
    }

    updateOnce(data = this.data, transform = this.transform) {
        if (!data || !transform) return;
        this._drawLabel(data, transform);
    }

    startUpdate(data, transform) {
        if (!data || !transform) return;
        this.data = data;
        this.transform = transform;

        if (this.updateTimer) return;
        this.updateTimer = timer(() => {
            this._drawLabel();
        });
    }

    stopUpdate(data, transform) {
        if (!data || !transform) return;
        if (this.updateTimer) this.updateTimer.stop();
        this.updateTimer = null;

        this._drawLabel(data, transform);
    }
}
