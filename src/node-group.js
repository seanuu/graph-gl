import {
    TextureLoader,
    ShaderMaterial,
    Color,
    BufferGeometry,
    BufferAttribute,
    Points,
    Vector3
} from 'three';

const vertexShader = `
    attribute vec3 pointColor;
    attribute float size;
    attribute float textureIndex;
    varying vec3 vColor;
    varying float vTextureIndex;
    void main() {
        vColor = pointColor;
        vTextureIndex = textureIndex;
        gl_PointSize = size * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

const fragmentShader = `
    uniform vec3 color;
    uniform sampler2D texture;
    uniform float iconWidth;
    varying vec3 vColor;
    varying float vTextureIndex;
    void main() {
        gl_FragColor = vec4(color * vColor * 1.25, 1.0) * texture2D(texture, gl_PointCoord * vec2(iconWidth, 1.0) + vec2(iconWidth * vTextureIndex, 0.0)); 
    }`;

export class NodeGroup {

    constructor(scene, options, GraphUtils) {
        this.scene = scene;
        this.options = options;
        this.GraphUtils = GraphUtils;

        this.texture = new TextureLoader().load(options.textureInfo.src, () => {
            this.material.uniforms.iconWidth.value = 1 / (this.texture.image.naturalWidth / options.textureInfo.pixel);
        });
        this.texture.flipY = false;

        this.material = new ShaderMaterial({
            uniforms: {
                color: {value: new Color(0xffffff)},
                texture: {value: this.texture},
                iconWidth: {value: this.texture.image ? 1 / (this.texture.image.naturalWidth / options.textureInfo.pixel) : 1}
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
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

    // 生成nodeGroup
    generateNodeGroup(nodes, groupColor, transform) {
        this.nodes = nodes;
        this.groupColor = groupColor;

        if (this.object3d) {
            this.scene.remove(this.object3d);
            this.object3d.geometry.dispose();
            this.object3d = null;
        }

        let length = nodes.length;
        let geometry = new BufferGeometry();

        let positions = new Float32Array(length * 3).fill(0.0);
        let colors = new Float32Array(length * 3).fill(0.5);
        let sizes = new Float32Array(length).fill(this.options._nodeSize || 30);
        let textureIndices = new Float32Array(length);
        let indices = new Uint32Array(length);

        let node, i, n;
        for (i = 0, n = nodes.length; i < n; i++) {
            indices[i] = i, node = nodes[i];

            textureIndices[i] = node._sprit || 0;
        }

        geometry.addAttribute('position', new BufferAttribute(positions, 3).setDynamic(true));
        geometry.addAttribute('pointColor', new BufferAttribute(colors, 3).setDynamic(true));
        geometry.addAttribute('size', new BufferAttribute(sizes, 1).setDynamic(true));
        geometry.addAttribute('textureIndex', new BufferAttribute(textureIndices, 1));

        geometry.setIndex(new BufferAttribute(indices, 1).setDynamic(true));
        geometry.computeBoundingSphere();

        this.object3d = new Points(geometry, this.material);
        this.updateNodeGroup(transform);

        this.scene.add(this.object3d);
        return this.object3d;
    }

    // 更新nodeGroup
    updateNodeGroup(nodes) {
        nodes && (this.nodes = nodes);
        if (!this.object3d || !this.nodes) return;

        this.updateNodeGroupSize();
        this.updateNodeGroupPosition();
        this.updateNodeGroupColor();
    }

    // 更新 nodeGroup 大小
    updateNodeGroupSize() {
        if (!this.object3d || !this.nodes) return;

        let GraphUtils = this.GraphUtils;
        let nodes = this.nodes;
        let geometry = this.object3d.geometry;
        let options = this.options;

        let sizes = geometry.getAttribute('size').array;
        let i, n, node;

        for (i = 0, n = nodes.length; i < n; i++) {
            if ((node = nodes[i]) && !GraphUtils.checkHide(node)) {
                sizes[i] = options._nodeSize;
            } else {
                sizes[i] = 0.0;
            }
        }

        geometry.getAttribute('size').needsUpdate = true;
    }

    // 更新 nodeGroup 位置
    updateNodeGroupPosition() {
        if (!this.object3d || !this.nodes) return;
        let nodes = this.nodes;

        let GraphUtils = this.GraphUtils;
        let geometry = this.object3d.geometry;

        let positions = geometry.getAttribute('position').array;
        let vector3 = new Vector3();
        let node, i, n, positionZ;

        for (i = 0, n = nodes.length; i < n; i++) {
            if (!(node = nodes[i])) continue;
            positionZ = GraphUtils.checkStatusDim(node) ? -100 : 150;

            vector3.set(node.x || 0, node.y || 0, positionZ).toArray(positions, 3 * i);
        }

        geometry.getAttribute('position').needsUpdate = true;
        geometry.computeBoundingSphere();
    }

    // 更新 nodeGroup 颜色
    updateNodeGroupColor() {
        if (!this.object3d || !this.nodes) return;
        let nodes = this.nodes;
        let groupColor = this.groupColor;

        let GraphUtils = this.GraphUtils;
        let geometry = this.object3d.geometry;

        let colors = geometry.getAttribute('pointColor').array;

        let color = new Color();
        let node, i, n;

        for (i = 0, n = nodes.length; i < n; i++) {
            node = nodes[i];

            if (!node) continue;
            color.set(GraphUtils.checkStatusDim(node) ? '#222222' : groupColor(node.group));
            color.toArray(colors, i * 3);
        }

        geometry.getAttribute('pointColor').needsUpdate = true;
    }

    // 更新 node 位置
    updateNodePosition(node) {
        if (!this.object3d || !this.nodes) return;

        let geometry = this.object3d.geometry;
        let positions = geometry.getAttribute('position');

        positions.setXY(node.index, node.x, node.y);

        geometry.getAttribute('position').needsUpdate = true;
    }
}
