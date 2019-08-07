import {select} from 'd3-selection';
import {dispatch} from "d3-dispatch";

export default class {
    constructor(container) {
        this.container = select(container);

        this.groupDispatch = dispatch('click');
    }

    generateLegend(group) {
        if (this.group) this.group.remove();
        let _this = this;

        this.group = this.container
            .append('div')
            .classed('graph-legend', true)
            .attr('data-type', 'graph')
            .style('position', 'absolute')
            .style('top', '20px')
            .style('right', '10px')
            .style('color', '#ffffff')
            .style('opacity', '0.85')
            .style('vertical-align', 'middle')
            .style('cursor', 'pointer')
            .style('max-height', 'calc(100% - 20px)')
            .style('user-select', 'none')
            .style('font-size', '14px');

        let dom = this.group.selectAll('.graph-legend')
            .data(Array.from(group.groupSet).sort((a, b) => (a.localeCompare && a.localeCompare(b)) || a - b))
            .enter()
            .append('div')
            .classed('graph-legend', true)
            .style('display', 'block')
            .style('line-height', '20px')
            .style('min-width', '80px')
            .style('vertical-align', 'top')
            .style('margin-bottom', '4px')
            .on('mouseenter', function () {
                this.style.color = '#ffdcae'
            })
            .on('mouseleave', function () {
                this.style.color = '#ffffff'
            })
            .on('click', function (d) {
                this._hide = !this._hide;
                select(this).style('opacity', this._hide ? 0.6 : 1);
                select(this).select('.legend-symbol').style('background', d => this._hide ? '#AAAAAA99' : group.groupColor(d));
                select(this).select('.legend-text').style('color', this._hide ? '#aaaaaa' : '#ffffff');

                _this.groupDispatch.call('click', this, d, this._hide);
            });

        dom.append('span')
            .classed('legend-symbol', true)
            .style('background', d => group.groupColor(d))
            .style('display', 'inline-block')
            .style('height', '14px')
            .style('width', '20px')
            .style('border-radius', '3px')
            .style('vertical-align', 'middle')
            .style('margin-right', '12px');

        dom.append('span')
            .classed('legend-text', true)
            .text(d => d)
            .style('vertical-align', 'middle');
    }

    on(typename, _) {
        return arguments.length > 1 ? (this.groupDispatch.on(typename, _), this) : this.groupDispatch.on(typename);
    }

    remove() {
        if (this.group) this.group.remove();
    }

}
