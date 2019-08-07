import {select} from 'd3-selection';

export default class {
    constructor(container) {

        // 设置progress
        this.progress = select(container).append('div')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .style('height', '3px')
            .style('width', '0')
            .style('background-color', 'red')
            .attr('data-type', 'graph')
            .node();
    }

    setProgress(progressValue) {
        this.progress.style.display = 'block';
        this.progress.style.width = 100 * progressValue + '%';
    }

    hide() {
        this.progress.style.display = 'none';
    }

    remove() {
        this.progress.remove();
    }
}
