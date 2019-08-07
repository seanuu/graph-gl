import {select} from 'd3-selection';
import {scaleLinear} from 'd3-scale';
import {axisBottom, axisRight} from 'd3-axis';
import {zoomIdentity} from 'd3-zoom';

// svg grid
export default class {
    constructor(container) {
        this.container = select(container).node();
        // 初始网格
        this.gridSvg = select(this.container)
            .insert('svg')
            .attr('data-type', 'graph')
            .attr('style', `position: absolute; top: 0; color: #aaaaaa;
       left: 0; height: 1px; width: 1px; z-index: 1; overflow: visible; cursor: default; user-select: none;`);

        // 添加X、Y轴
        this.gGroupX = this.gridSvg.append('g');
        this.gGroupY = this.gridSvg.append('g');

        this.resizeGrid();
    }

    resizeGrid(transform = zoomIdentity) {
        let clientRect = this.container.getBoundingClientRect();
        let groupX = this.gGroupX;
        let groupY = this.gGroupY;
        let height = clientRect.height;
        let width = clientRect.width;
        let yTicks = Math.ceil(height / 20);
        let xTicks = Math.ceil(width / height * yTicks);
        let xScale, yScale, xAxis, yAxis, values;
        let interval;

        xScale = scaleLinear()
            .domain([0, width])
            .range([0, width]);

        yScale = scaleLinear()
            .domain([0, height])
            .range([0, height]);

        xScale = transform.rescaleX(xScale);
        yScale = transform.rescaleY(yScale);

        values = xScale.ticks(xTicks);
        if (values[5]) {
            interval = values[5] - values[0];
        } else {
            values = yScale.ticks(yTicks);
            interval = values[5] ? values[5] - values[0] : 100;
        }

        xAxis = axisBottom(xScale)
            .ticks(xTicks)
            .tickSize(height)
            .tickFormat(data => data % interval === 0 ? data : null)
            .tickPadding(8 - height);

        yAxis = axisRight(yScale)
            .ticks(yTicks)
            .tickSize(width)
            .tickFormat(data => data % interval === 0 ? data : null)
            .tickPadding(8 - width);

        xAxis.scale(xScale)(groupX);
        yAxis.scale(yScale)(groupY);

        groupX.call(tickStyles);
        groupY.call(tickStyles);

        function tickStyles(axis) {
            axis.selectAll('.tick line')
                .attr('shape-rendering', 'crispEdges')
                .attr('color', '#6e6e6e')
                .attr('stroke-opacity', 0.4)
                .attr('stroke-width', 0.5)
                .attr('stroke-dasharray', null)
                .filter(data => {
                    return data % interval !== 0 ? data : null;
                })
                .attr('stroke-dasharray', '2, 2');
            axis.select('.domain').attr('opacity', 0);
        }
    }

    remove() {
        this.gridSvg.remove();
    }
}


// // canvas grid --- canvas 画出来的不好看
// export default class {
//     constructor(container) {
//         // 初始网格
//         this.grid = select(container)
//             .append('canvas')
//             .attr('style', `position: absolute; top: 0; color: #aaaaaa;
//        left: 0; overflow: visible; cursor: default; user-select: none;`);
//
//         this.canvas = this.grid.node();
//         this.context = this.canvas.getContext('2d');
//
//
//         this.xScale = scaleLinear();
//         this.yScale = scaleLinear();
//     }
//
//     resizeGrid(containerInfo, transform) {
//         let canvas = this.canvas;
//         let height = containerInfo.height;
//         let width = containerInfo.width;
//         let yTicks = Math.ceil(height / 20);
//         let xTicks = Math.ceil(width / height * yTicks);
//         let context = this.context;
//         let xScale, yScale;
//         let interval;
//
//         canvas.height = height;
//         canvas.width = width;
//
//         xScale = scaleLinear()
//             .domain([0, width])
//             .range([0, width]);
//         yScale = scaleLinear()
//             .domain([0, height])
//             .range([0, height]);
//
//         xScale = transform.rescaleX(xScale);
//         yScale = transform.rescaleY(yScale);
//
//         let xValues = xScale.ticks(xTicks);
//         let yValues = yScale.ticks(yTicks);
//
//         let dashLinesX = [];
//         let solidLinesX = [];
//         let dashLinesY = [];
//         let solidLinesY = [];
//
//         if (xValues[5]) {
//             interval = xValues[5] - xValues[0];
//         } else {
//             interval = yValues[5] ? yValues[5] - yValues[0] : 100;
//         }
//
//         xValues.forEach(data => {
//             if (data % interval === 0) {
//                 solidLinesX.push(xScale(data));
//             } else {
//                 dashLinesX.push(xScale(data))
//             }
//         });
//
//         yValues.forEach(data => {
//             if (data % interval === 0) {
//                 solidLinesY.push(yScale(data));
//             } else {
//                 dashLinesY.push(yScale(data))
//             }
//         });
//
//         context.imageSmoothingEnabled = false;
//         context.mozImageSmoothingEnabled = false;
//         context.webkitImageSmoothingEnabled = false;
//         context.msImageSmoothingEnabled = false;
//
//         context.lineWidth = 0.5;
//         context.globalAlpha = 0.6;
//         context.strokeStyle = '#919191';
//
//         // draw dot line
//         context.save();
//         context.setLineDash([4, 4]);
//         context.beginPath();
//         for (let value of dashLinesX) {
//             context.moveTo(value, 0);
//             context.lineTo(value, height);
//         }
//         for (let value of dashLinesY) {
//             context.moveTo(0, value);
//             context.lineTo(width, value);
//         }
//         context.stroke();
//         context.restore();
//
//         // draw solid line
//         context.save();
//         context.beginPath();
//         for (let value of solidLinesX) {
//             context.moveTo(value, 0);
//             context.lineTo(value, height);
//         }
//         for (let value of solidLinesY) {
//             context.moveTo(0, value);
//             context.lineTo(width, value);
//         }
//
//         context.stroke();
//         context.restore();
//     }
//
//     remove() {
//         this.grid.remove();
//     }
// }
