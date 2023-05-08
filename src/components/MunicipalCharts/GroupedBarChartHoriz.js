import MunicipalChart from './MunicipalChart.js'
//import ResizeObserver from 'resize-observer-polyfill'
import * as d3 from 'd3'

export default class GroupedBarChartHoriz extends MunicipalChart {
  constructor(target) {
    super(target)
    //this._seriesField = 'item'
    //this._valueResizeObserver = new ResizeObserver(this.valueResizeHandler())
  }

  /*valueResizeHandler() {
    return entries => {
      let maxWidth = entries.reduce((maxWidth, entry) => {
        return Math.max(maxWidth, entry.contentRect.width)
      }, 0)

      d3.selectAll('.item-value').style('min-width', `${maxWidth}px`)
    }
  }*/

  updateProvider() {
    const margin = { top: 0, right: 0, bottom: 0, left: 200 };
    const width = d3.select(".grouped-bar-chart-horiz").node().clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    const formatter = d3.formatPrefix(".2s", 1e3);
    //const items = this.groupData(this.data(), this._seriesField)

    // const currencyFormatter = d3.format(`${formatter.scale}~`);

    const svg = d3.select(".grouped-bar-chart-horiz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .style("font-family", "sans-serif")
      .style("font-weight", "bold");

    const x = d3.scaleLinear()
      .domain([0, d3.max(this.data(), d => d3.max(d.values, v => v.value))])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(this.data().map(d => d.category))
      .range([0, height])
      .padding(0.1);

    // Y axis
    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(-180, 0)")
      .call(d3.axisLeft(y));

    d3.select(".y-axis path").remove();
    d3.selectAll(".y-axis line").remove();
    d3.selectAll(".y-axis text")
      .attr("transform", `translate(0, -${y.bandwidth() / 4 + 9})`)
      .style("text-anchor", "start")
      .style("font-size", "10px");


    // Add a group for each category.
    const groups = svg.selectAll("g.category")
      .data(this.data())
      .enter()
      .append("g")
      .attr("class", "category")
      .style("font-size", "10px")
      .attr("transform", d => `translate(0, ${y(d.category)})`);

    // Add each category's background bars to the group
    groups.selectAll("rect.background")
      .data(d => d.values)
      .enter()
      .append("rect")
      .attr("class", "background")
      .attr("data-year", d => d.year)
      .attr("x", d => x(0))
      .attr("y", (d, i) => i * (y.bandwidth() / 4) + 5)
      .attr("width", d => x.range()[1])
      .attr("height", 16)
      .attr("fill", "#f5f5f5")
      .attr("rx", 5)
      .attr("ry", 5)
      .style("cursor", "pointer");

    // Add each category's bars to the group
    groups.selectAll("rect.bar")
      .data(d => d.values)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-year", d => d.year)
      .attr("x", d => x(0))
      .attr("y", (d, i) => i * (y.bandwidth() / 4) + 5)
      .attr("width", d => x(d.value) - 110)
      .attr("height", 16)
      .attr("fill", "#e1dce8")
      .attr("rx", 5)
      .attr("ry", 5)
      .style("cursor", "pointer");


    // Add each category's years to the group
    groups.selectAll(".year")
      .data(d => d.values)
      .enter()
      .append("text")
      .attr("class", "year")
      .attr("data-year", d => d.year)
      .attr("x", d => x(0) - 50)
      .attr("y", (d, i) => i * (y.bandwidth() / 4) + (y.bandwidth() / 4) / 2 + 5)
      .attr("fill", "#999999")
      .text(d => d.year)
      .style("cursor", "pointer");


    // Add each category's bar's value to the group
    groups.selectAll(".value")
      .data(d => d.values)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("data-year", d => d.year)
      .attr("x", d => x.range()[1] - 10)
      .attr("y", (d, i) => i * (y.bandwidth() / 4) + (y.bandwidth() / 4) / 2 + 5)
      .attr("text-anchor", "end")
      .attr("fill", "#999999")
      .text(d => 'R' + formatter(d.value))
      .style("cursor", "pointer");


    groups.selectAll("rect.bar, rect.background, text.label, text.value")
      .on("mouseover", (e, d) => {
        d3.selectAll('rect.bar[data-year="' + d.year + '"]').attr("fill", "#54298b");
        d3.selectAll('text.year[data-year="' + d.year + '"]').attr("fill", "#333333");
        d3.selectAll('text.value[data-year="' + d.year + '"]').attr("fill", "#333333");
      })
      .on("mouseout", (e, d) => {
        d3.selectAll('rect.bar[data-year="' + d.year + '"]').attr("fill", "#e1dce8");
        d3.selectAll('text.year[data-year="' + d.year + '"]').attr("fill", "#999999");
        d3.selectAll('text.value[data-year="' + d.year + '"]').attr("fill", "#999999");
      });
  }
}
