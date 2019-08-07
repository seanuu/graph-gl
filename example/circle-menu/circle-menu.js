import './circle-menu.scss';
import { arc } from 'd3-shape';
import { easeExpOut, easeBackOut, easeLinear, easeCircleIn } from 'd3-ease';
import * as Selection from 'd3-selection';
import 'd3-transition';
import { interpolateRainbow } from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';

export class CircleMenu {
    constructor () {
        // 菜单元素、数据
        this.menu = null;
        this.originMenu = null;
        this.menudata = [];
        this.promiseReject = null;
        this.initEvent();
    }

    initOptions ({
        intervalAngel = 0,
        levelSpacing = 2,
        cornerRadius = 3,
        iconSize = 35,
        fontSize = 12,
        innerRadius = 50,
        radiusStep = 70,
        arcLength = 90,
        secondLength = null,
        fullCircle = false
    } = {}) {
        // 图标大小
        this.iconSize = iconSize;
        this.fontSize = fontSize;

        // 一级菜单内径
        this.innerRadius = innerRadius;
        // 菜单层级关系
        this.radiusStep = radiusStep;
        this.secondLength = secondLength;
        this.fullCircle = fullCircle;
        this.arcLength = arcLength;

        // 菜单间隔
        this.levelSpacing = levelSpacing;
        this.intervalAngel = intervalAngel < 5 ? intervalAngel : 0;

        this.cornerRadius = cornerRadius;
        this.arc = arc().cornerRadius(this.cornerRadius);

        this.color = scaleSequential(interpolateRainbow);
    }

    initMenu (event, menu, options) {
        // 生成菜单、设置参数
        this.removeMenu();
        this.initOptions(options);

        return new Promise((resolve, reject) => {
            event.stopPropagation();
            this.promiseReject = reject;

            if (this.originMenu !== menu) {
                this.originMenu = menu;
                this.menudata = JSON.parse(JSON.stringify(menu));
                this.initData();
            }

            this.createMenu(event, resolve);
        });
    }

    initEvent () {
        document.addEventListener('click', () => {
            if (this.promiseReject) {
                this.promiseReject();
                this.promiseReject = null;
            }
            if (this.menu) {
                this.removeMenu();
            }
        }, false);
        document.addEventListener('contextmenu', () => {
            if (this.promiseReject) {
                this.promiseReject();
                this.promiseReject = null;
            }
            if (this.menu) {
                this.removeMenu();
            }
        }, false);
    }

    createMenu (event, resolve) {
        // 创建菜单元素、定位
        this.menu = Selection.select('body')
            .append('svg')
            .classed('circle-menu', true)
            .attr('height', 1)
            .attr('width', 2)
            .attr('viewBox', '0 0 1 1')
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('position', 'fixed')
            .style('overflow', 'visible')
            // _clientX节点图形定制
            .style('left', (event._clientX || event.clientX) + 'px')
            .style('top', (event._clientY || event.clientY) + 'px');

        this.createMenuItems({ resolve: resolve });
    }

    createMenuItems ({ menudata = this.menudata, parent = this.menu, resolve }) {
        // 生成一级、次级菜单
        const depth = menudata[0]._depth || 1;
        const _this = this;

        const menuItems = parent
            .append('g')
            .classed('menu-items', true);

        const menuItem = menuItems
            .selectAll('g')
            .data(menudata)
            .enter().append('g')
            .classed('menu-item', true);

        // menu title
        menuItem
            .append('title')
            .text(data => data.name);

        // menu path
        menuItem
            .append('path')
            .classed('first-menu-item-path', depth === 1)
            .classed('menu-item-path', true)
            .attr('d', d => d._d);
        // menu icon
        menuItem
            .append('g')
            .attr('transform', d => {
                return `translate(${d._centroid[0] - this.iconSize / 2},${d._centroid[1] - this.iconSize * 0.8})`;
            })
            .append('svg')
            .each(function (d) {
                d._icon = this;
            })
            .attr('width', this.iconSize)
            .attr('height', this.iconSize)
            .append('use')
            .attr('xlink:href', d => d.icon);

        // menu text
        menuItem
            .append('text')
            .classed('menu-item-text', true)
            .attr('x', data => data._centroid[0])
            .attr('y', data => data._centroid[1] + 21)
            .attr('text-anchor', 'middle')
            .style('font-size', this.fontSize + 'px')
            .text(data => {
                return data.name.length > 8 ? data.name.slice(0, 8) + '...' : data.name;
            });

        // menu symbol
        menuItem
            .each(function (data, index) {
                if (!data.children || !data.children.length > 0) return;

                Selection.select(this)
                    .append('path')
                    .classed('menu-item-sign', true)
                    .attr('d', d => d._outerArc)
                    .attr('fill', _this.color(index / menuItem.nodes().length));
            });

        // 菜单出现时的过渡效果, 偏移
        if (depth > 1) {
            menuItem
                .attr('transform', 'rotate(-45)')
                .transition()
                .duration(300)
                .ease(easeBackOut)
                .attr('transform', 'rotate(0)');
        } else {
            menuItem
                .attr('transform', 'scale(0.5)')
                .attr('opacity', 0.5)
                .transition()
                .duration(300)
                .ease(easeExpOut)
                .attr('transform', 'scale(1)')
                .attr('opacity', 1);
        }

        // 菜单事件
        menuItem
            .on('click', (d) => {
                Selection.event.stopPropagation();

                // 有下级菜单元素展示下级菜单
                if (d.children && d.children.length > 0) {
                    this.removeMenu(menuItems);
                    this.createMenuItems({ menudata: d.children, parent: menuItems, resolve: resolve });
                    return;
                }

                // 若绑定操作执行操作
                if (d.operation) {
                    // d.operation(this.selectedNodeData);
                    resolve({ operation: d.operation, argument: d.argument });
                    this.removeMenu();
                    return;
                }

                // 没有下级菜单也没有执行操作
                this.removeMenu(menuItems);
            });
    }

    initData (menudata = this.menudata, parentDepth = 0, startAngle = -2 * Math.PI / this.menudata.length / 2, parentItemRotatedAngel = 0) {
        // 初始化菜单数据
        // 计算菜单图形所需要素
        let menuDepth = parentDepth + 1;
        let menuItemRotatedAngle = 2 * Math.PI / this.menudata.length;

        if (menuDepth > 1) {
            // 计算需要旋转的弧度
            let menuNumber, arcLength;
            if (this.fullCircle) {
                menuNumber = menudata.length;
                arcLength = (2 * Math.PI) / menuNumber * (this.innerRadius + this.radiusStep + this.radiusStep * (parentDepth - 0.5) + this.levelSpacing * (parentDepth));
            } else {
                if (this.secondLength && this.secondLength) {
                    menuNumber = menudata.length >= this.secondLength ? menudata.length : this.secondLength;
                    arcLength = (2 * Math.PI) / menuNumber * (this.innerRadius + this.radiusStep + this.radiusStep * 0.5 + this.levelSpacing);
                } else {
                    menuNumber = menudata.length;
                    let arcLengthCache = (2 * Math.PI) / menuNumber * (this.innerRadius + this.radiusStep + this.radiusStep * 0.5 + this.levelSpacing);
                    arcLength = arcLengthCache <= this.arcLength ? arcLengthCache : this.arcLength;
                }
            }

            // 单个菜单节点所需旋转的角度
            menuItemRotatedAngle = arcLength / (this.innerRadius + this.radiusStep + this.radiusStep * (parentDepth - 0.5) + this.levelSpacing * (parentDepth));
            // 起始节点角度
            startAngle -= ((menuItemRotatedAngle * menudata.length) - parentItemRotatedAngel) / 2;
        }

        menudata.forEach((item, index) => {
            let arcArguments;
            if (menuDepth === 1) {
                arcArguments = {
                    innerRadius: this.innerRadius,
                    outerRadius: this.innerRadius + this.radiusStep,
                    padAngle: (this.intervalAngel / 180 * Math.PI),
                    startAngle: startAngle + menuItemRotatedAngle * index,
                    endAngle: startAngle + menuItemRotatedAngle * (index + 1)
                };
            } else {
                arcArguments = {
                    innerRadius: this.innerRadius + this.radiusStep + this.radiusStep * (parentDepth - 1) + this.levelSpacing * (parentDepth),
                    outerRadius: this.innerRadius + this.radiusStep + this.radiusStep * (menuDepth - 1) + this.levelSpacing * (parentDepth),
                    padAngle: (this.intervalAngel / 180 * Math.PI),
                    startAngle: startAngle + menuItemRotatedAngle * index,
                    endAngle: startAngle + menuItemRotatedAngle * (index + 1)
                };
            }

            item._d = this.arcPath(arcArguments);
            item._centroid = this.arcCentroid(arcArguments);
            item._depth = menuDepth;
            item._rotate = startAngle + menuItemRotatedAngle * (index + 0.5);
            item._outerCentoid = this.arcCentroid(Object.assign(arcArguments, { innerRadius: arcArguments.outerRadius - 8 }));
            item._outerArc = this.arcPath(Object.assign(arcArguments, { innerRadius: arcArguments.outerRadius - 4 }));

            if (item.children && item.children.length > 0) {
                let nextLevelStartAngle = startAngle + menuItemRotatedAngle * index;
                this.initData(item.children, menuDepth, nextLevelStartAngle, menuItemRotatedAngle);
            }
        });
    }

    removeMenu (menu = this.menu) {
        // 移除菜单
        if (!menu) {
            return;
        }

        if (menu !== this.menu) {
            menu = menu.select('.menu-items');
            menu
                .attr('transform', 'rotate(0)')
                .attr('opacity', '1')
                .transition()
                .duration(200)
                .ease(easeLinear)
                .attr('transform', 'rotate(180)')
                .attr('opacity', '0')
                .remove();
        } else {
            menu
                .attr('transform', 'scale(1)')
                .attr('opacity', '1')
                .transition()
                .duration(100)
                .ease(easeCircleIn)
                .attr('transform', 'scale(.5)')
                .attr('opacity', '0.5')
                .remove();
        }
    }

    arcPath (arcArguments) {
        // 计算圆弧路径
        return this.arc(arcArguments);
    }

    arcCentroid (arcArguments) {
        // 计算扇形质心
        return this.arc.centroid(arcArguments);
    }
}
