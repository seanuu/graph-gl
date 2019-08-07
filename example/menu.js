import {CircleMenu} from './circle-menu/circle-menu.js';

let data = [
    {
        name: '添加节点',
        icon: '#icon-rila',
        operation: 'append'
    },
    {
        name: '删除节点',
        icon: '#icon-qingduoyun',
        operation: 'remove'
    },
    {
        name: '控制',
        icon: '#icon-longjuanfeng',
        children: [
            {
                name: '移除其他',
                icon: '#icon-leijiayu',
                operation: 'removeOther'
            },
            {
                name: '没有',
                icon: '#icon-dalei',
                operation: 'null'
            },
        ]
    },
];

let canvasMenu = [
    {
        name: '清空',
        icon: '#icon-rila',
        operation: 'clear'
    },
    {
        name: '重新布局',
        icon: '#icon-leijiayu',
        operation: 'update'
    },
    {
        name: '加载数据',
        icon: '#icon-leijiayu',
        operation: 'loadData'
    },
];

let menu = new CircleMenu();

let options = {
    innerRadius: 32,
    levelSpacing: 5,
    radiusStep: 55,
    iconSize: 30,
    fontSize: 11
};

export function initMenu(event) {
    return menu.initMenu(event, data, options);
}

export function initCanvasMenu(event) {
    return menu.initMenu(event, canvasMenu, Object.assign({}, options, {innerRadius: 10}));
}
