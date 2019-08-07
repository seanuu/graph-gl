import {
    Clock,
    VertexColors,
    LineBasicMaterial,
    Color,
    BufferGeometry,
    BufferAttribute,
    LineSegments,
    Vector2,
    QuadraticBezierCurve,
    LineCurve
} from 'three';

export class LinkGroup {
    constructor(scene, options, GraphUtils) {
        this.scene = scene;
        this.options = options;
        this.GraphUtils = GraphUtils;

        this._lineSegment = 20;

        this.clock = new Clock();

        this.material = new LineBasicMaterial({
            vertexColors: VertexColors,
            depthTest: true,
            opacity: 0.1,
            transparent: true
        });
    }

    hide() {
        if (!this.object3d) return;
        this.object3d.visible = false;
    }

    show() {
        if (!this.object3d) return;
        this.object3d.visible = true;
    }

    findLinkByIntersect(intersect) {
        if (!this.links || !intersect) return;
        let index = Math.floor(intersect.index / (this._lineSegment * 2));

        return this.links[index];
    }

    // 制成连线
    generateLinkGroup(links, groupColor) {
        this.links = links;
        this.groupColor = groupColor;
        if (this.object3d) {
            this.scene.remove(this.object3d);
            this.object3d.geometry.dispose();
            this.object3d = null;
        }

        let color = new Color('#222222');

        let geometry = new BufferGeometry();

        let pointLength = links.length * this._lineSegment * 2;
        let positions = new Float32Array(pointLength * 3).fill(0.0);
        let colors = new Float32Array(pointLength * 3).fill(color.r);
        let indices = new Uint32Array(pointLength);

        for (let i = 0; i < pointLength; i++) {
            indices[i] = i;
        }

        geometry.setIndex(new BufferAttribute(indices, 1).setDynamic(true));
        geometry.addAttribute('position', new BufferAttribute(positions, 3).setDynamic(true));
        geometry.addAttribute('color', new BufferAttribute(colors, 3).setDynamic(true));
        geometry.computeBoundingSphere();

        this.object3d = new LineSegments(geometry, this.material);
        this.updateLinkGroup();
        this.object3d.position.setZ(-0.1);

        this.scene.add(this.object3d);
        return this.object3d;
    }

    // 更新连线
    updateLinkGroup(links) {
        links && (this.links = links);
        if (!this.object3d || !this.links) return;

        this.updateLinkGroupColor();
        this.updateLinkGroupPosition();
    }

    // 更新连线颜色
    updateLinkGroupColor() {
        if (!this.object3d || !this.links) return;

        this.updateLinkColor(this.links);
    }

    // 更新连线位置
    updateLinkGroupPosition() {
        if (!this.object3d || !this.links) return;
        let links = this.links;

        let GraphUtils = this.GraphUtils;
        let geometry = this.object3d.geometry;
        let positions = geometry.getAttribute('position').array;
        let link, i, n;

        for (i = 0, n = links.length; i < n; i++) {
            if ((link = links[i]) && !GraphUtils.checkHide(link)) {
                this._setLine(link, positions, GraphUtils);
            } else {
                let empty = new Float32Array(this._lineSegment * 2 * 3);
                positions.set(empty, i * this._lineSegment * 2 * 3);
            }
        }

        geometry.getAttribute('position').needsUpdate = true;
        geometry.computeBoundingSphere();
    }

    // private draw line
    _setLine(link, positions, GraphUtils) {
        let curveness = link._curveness || this.options.curveness || 0;
        let positionZ = GraphUtils.checkStatusDim(link) ? -100 : 50;
        let pozIndex;
        let startPoint = new Vector2(link.source.x, link.source.y);
        let endPoint = new Vector2(link.target.x, link.target.y);
        let points;

        if (curveness) {
            let controlNormal = new Vector2().copy(startPoint).sub(endPoint).rotateAround(new Vector2(0, 0), Math.PI / 2)
                .multiplyScalar(curveness);
            let controlPoint = new Vector2().copy(endPoint).add(startPoint).divideScalar(2).add(controlNormal);

            link._line = new QuadraticBezierCurve(startPoint, controlPoint, endPoint);
        } else {
            link._line = new LineCurve(startPoint, endPoint);
        }

        points = link._line.getPoints(this._lineSegment);

        for (let i = 0; i < this._lineSegment; i++) {
            pozIndex = (this._lineSegment * 2 * link.index + i * 2) * 3;
            points[i].toArray(positions, pozIndex);
            positions[pozIndex + 2] = positionZ;

            pozIndex = (this._lineSegment * 2 * link.index + i * 2 + 1) * 3;
            points[i + 1].toArray(positions, pozIndex);
            positions[pozIndex + 2] = positionZ;
        }
    }

    // update连线透明度
    updateLinkGroupOpacity() {
        if (!this.object3d || !this.links) return;
        this.object3d.material.opacity = this.options._lineOpacity;
    }

    // 更新连线位置
    updateLinkPositionByNode(node) {
        if (!this.object3d || !this.links) return;
        let links = this.links;

        let GraphUtils = this.GraphUtils;
        let geometry = this.object3d.geometry;
        let positions = geometry.getAttribute('position').array;
        let link, i, n;

        for (i = 0, n = links.length; i < n; i++) {
            if (!(link = links[i]) || GraphUtils.checkHide(link)) continue;

            if (link.source.id === node.id || link.target.id === node.id) {
                this._setLine(link, positions, GraphUtils);
            }
        }

        geometry.getAttribute('position').needsUpdate = true;
    }

    // 更新连线颜色
    updateLinkColor(links) {
        if (!this.object3d || !this.links) return;

        links = links instanceof Array ? links : [links];
        let groupColor = this.groupColor;

        let geometry = this.object3d.geometry;
        let colors = geometry.getAttribute('color').array;
        let color = new Color();
        let i, n, link;

        for (i = 0, n = links.length; i < n; i++) {
            if (!(link = links[i])) continue;

            this._setSegmentColor(color, colors, groupColor, link);
        }

        geometry.getAttribute('color').needsUpdate = true;
    }

    _setSegmentColor(color, colors, groupColor, link) {
        let isHovered = this.GraphUtils.checkStatusHover(link);

        color.set(
            isHovered ? '#cccccc' : (this.GraphUtils.checkStatusDim(link) ? '#222222' : groupColor(link.source.group))
        );

        for (let j = 0; j < this._lineSegment * 2; j++) {
            color.toArray(colors, (this._lineSegment * 2 * link.index + j) * 3);
        }
    }

    // 动态点动向
    animateLinkDirection(duration) {
        if (!this.object3d || !this.links) return;

        let t = (this.clock.getElapsedTime() * 1000 % duration) / duration;
        let l = Math.floor(this._lineSegment * 2 * t);

        let links = this.links;
        let groupColor = this.groupColor;

        let GraphUtils = this.GraphUtils;
        let geometry = this.object3d.geometry;
        let colors = geometry.getAttribute('color').array;
        let color = new Color();
        let dirColor = new Color('#ffffff');
        let i, j, link, m;
        let isDim;

        for (i = 0, m = links.length; i < m; i++) {
            if (!(link = links[i]) || !GraphUtils.checkStatusOutstanding(link) || GraphUtils.checkStatusHover(link)) continue;
            color.set(groupColor(link.source.group));

            for (j = 0; j < this._lineSegment * 2; j++) {
                if (l === j && !isDim) {
                    dirColor.toArray(colors, (this._lineSegment * 2 * i + j) * 3)
                } else {
                    color.toArray(colors, (this._lineSegment * 2 * i + j) * 3);
                }
            }
        }

        geometry.getAttribute('color').needsUpdate = true;
    }
}
