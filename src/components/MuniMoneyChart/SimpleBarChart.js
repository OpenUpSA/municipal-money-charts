import * as d3 from 'd3';

export default function (element) {
    let w, h, d, scale;

    let methods = {}

    let container = d3.select(element);

    let svg = container.append('svg');
    let mainGroup = svg.append('g').attr('class', 'main-group');



    methods.width = (width) => {
        w = width;
        svg.attr('width', width);
        return methods;
    }

    methods.height = (height) => {
        h = height;
        svg.attr('height', height);

        return methods;
    }

    methods.data = (data) => {
        d = data;
        let sum = d3.sum(data, (d) => d.value);
        scale = d3.scaleLinear().domain([0, sum]).range([0, w])
        render(data, scale);

        return methods
    }

    function render(data, scale) {
        let da = data;
        console.log(da)
        let rects = mainGroup.selectAll('rect').data(da)

        rects.exit().transition().remove();

        rects.enter()
            .append('svg:rect')
            .attr('height', h)
            .merge(rects)
            .transition()
            .attr('width', (d) => {
                return scale([d.value]) - 2
            })
            .attr('x', (d, i) => {
                if (i === 0) {
                    return 0
                } else {
                    console.log(scale([da[i - 1].value]))
                    return scale([da[i - 1].value])
                }

            })
            .attr('fill', d => d.fillColor)


        // gs.exit().remove('rect').transition().duration(1000);
    }

    return methods;
}