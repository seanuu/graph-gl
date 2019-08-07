## 基于webGL的关系图
支持大量数据展示


## 接口说明

```typescript
/**
 * 传入 Graph 的配置项
 */
interface Options {
    /**
     * 缩放限制[最小限制，最大限制]，默认：[0, Infinity]
     */
    scaleExtent: [number, number];
    /**
     * 节点大小, 默认：25
     */
    nodeSize: number;
    /**
     * 节点文字、连线交互可操作时的缩放阀值, 默认：1 / 4
     * 当低于此阀值时连线没有交互，节点文字不显示
     */
    labelThreshold: number;
    lineIntersectThreshold: number;
    /**
     * 连线曲度 默认：0
     */
    curveness: number;
    /**
     * 是否开启抗锯齿，节点数目有数万个时应当关闭此项, 默认：true
     */
    antialias: boolean;
    /**
     * 是否保持节点大小不随缩放变化, 默认：false
     */
    sizeAttenuation: boolean;
    /**
     * 是否当连线高亮时显示方向轨迹, 默认：true
     */
    lineAnimation: boolean;
    lineOpacity: number;

    /**
     * 用于节点纹理，纹理图片应当时将节点对应图标置于一行放置的图片： iconImage iconImage iconImage ....
     * map：category 字段值对应使用第几个图形，如果节点数据中，category有几种值['person', 'device', 'phone', 'email']
     *      {person: 0, device: 1, phone: 2, email: 3} person对应使用第一个图标，device使用第二个...
     * src：纹理图标的路径
     * pixel：纹理图片中单个图标的像素尺寸，纹理中的节点图标应当尺寸一致等距排列
     */
    textureInfo: {
        map: Object;
        src: string;
        pixel: number;
    };

    /**
     * 如果 category、group、nodeLabel、linkLabel 这些字段在 NodeObject/LinkObject 对象的某个属性对象中，例如：props
     * 设置 splitSymbol 为任意特殊字符串, 如：双下划线__
     * 在设置 category、group、nodeLabel、linkLabel 时使用： props__categoryFiled,  props__groupFiled ...
     */
    splitSymbol: string;
    /**
     * 连线对象中对应的字段
     * id：标注 NodeObject 中唯一标识的字段，对应 LinkObject 中的 source/target
     * category：标注 NodeObject 中表名类型的字段，会将节点以不同的纹理区分展示
     * group：标注 NodeObject 中分类的字段，会将节点在不同分组中以不同的颜色标识
     * nodeLabel：标注 NodeObject 中想要显示在节点下方的文字对应的字段
     */
    id: string;
    category: string;
    group: string;
    nodeLabel: string;

    /**
     * 连线对象中对应的字段
     * source：标注 LinkObject 中表名 source 的字段
     * target：标注 LinkObject 中表名 target 的字段
     * linkId：标注 LinkObject 中唯一标识的字段，没有则不填
     * linkLabel：标注 LinkObject 中想要在连线高亮时显示在连线中的文字的字段
     */
    source: string;
    target: string;
    linkId: string;
    linkLabel: string
}
/**
 * 节点对象
 */
interface NodeObject {}

/**
 * 连线对象
 */
interface LinkObject {}

/**
 * 关系数据
 */
interface GraphData {
    nodes: NodeObject[],
    links: LinkObject[]
}

/**
 * CSS 选择器
 */
type CSSSelector = string;

/**
 * Graph 关系图包含的方法
 */
interface GraphObject {
    /**
     * 传入关系数据，这个方法会根据传入的关系数据生成对应的图形展示
     */
    update(data?: GraphData): Promise<boolean>;

    /**
     * 这个方法会清空已有的关系数据和图形
     */
    clear(): Promise<boolean>;

    /**
     * 这个方法会重绘已有的关系图形
     */
    repaintAll(): GraphObject;

    /**
     * 这个方法会在已有的关系数据中增加传入的关系数据
     * 并根据新的数据生成图形
     */
    appendData(data: GraphData): Promise<boolean>;

    /**
     * 这个方法会在已有的关系数据中增加传入的节点数据
     * 并根据新的数据生成图形
     */
    appendNode(node): Promise<boolean>;

    /**
     * 这个方法会在已有的关系数据中增加传入的连接数据
     * 并根据新的数据生成图形
     */
    appendLink(link): Promise<boolean>;

    /**
     * 这个方法会在已有的关系数据中移除指定节点数据
     * 并根据新的数据生成图形
     */
    removeNode(node): GraphObject;

    /**
     * 这个方法会在已有的关系数据中移除指定连线数据
     * 并根据新的数据生成图形
     */
    removeLink(link): GraphObject;

    /**
     * 这个方法会在根据传入的字符串
     * 返回节点对应options中设置的id字段，包含该字符串的节点集合
     */
    filterNodes(queryString: string): Object[];

    /**
     * 事件监听
     *
     * 支持的 typename 有：
     * contextmenu.node  click.node       节点的左右键事件
     * contextmenu.link  click.link       连线的左右键事件
     * contextmenu.canvas  click.canvas   画布的左右键事件
     */
    on(typename, callback: (item) => void): GraphObject;

    /**
     * 传入一个节点对象，可以是原始数据中的节点对象，也可以是通过事件获取的节点对象或 filterNodes 方法获取的节点
     * 夜视聚焦到该节点，画布以该节点为中心
     *
     * 新添入节点时或查找节点时可以使用该方法
     */
    focusOnNode(node: NodeObject, duration?: number): GraphObject;

    /**
     * 和 focusOnNode 类型，不过展现形式为：以画布刚好包含节点集合的形式展示，
     */
    focusOnNodes(nodes: NodeObject[]): GraphObject;

    /**
     * 传入节点或连线，当传入连线时，参数 isLink 需要传入 true
     * 返回节点或连线相连的关系数据
     */
    findRelation(item: NodeObject | LinkObject, isLink): GraphData;

    /**
     * 和 focusOnNodes 类似
     * 不过会高亮节点集合和这些节点集合间的连线
     */
    lightNodes(nodes: NodeObject[]): GraphObject;
}

export function Graph(container: HTMLElement | CSSSelector, data: GraphData, opts: Options): GraphObject;

export default Graph;

```
