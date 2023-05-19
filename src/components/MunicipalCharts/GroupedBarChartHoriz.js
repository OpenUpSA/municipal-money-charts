import MunicipalChart from './MunicipalChart.js'

import * as d3 from 'd3'

export default class GroupedBarChartHoriz extends MunicipalChart {
  constructor(target) {
    super(target)
    
  }

  updateProvider() {

    

    setTimeout(() => {

      d3.select(".grouped-bar-chart-horiz svg").remove();  

      const containerWidth = d3.select(".grouped-bar-chart-horiz").node().getBoundingClientRect().width;

      const margin = { top: containerWidth <= 400 ? 20 : 0, right: 0, bottom: 0, left: containerWidth <= 400 ? 0 : 200 };
      const width = containerWidth - margin.left - margin.right;
      const itemPadding = 10;
      const itemHeight = 16;

      const height1 = ((this.data().length * 4) * itemHeight);
      const height2 = ((this.data().length * 4) * itemPadding);
      const height3 = (((this.data().length - 1) * 20));

      const height = (height1 + height2 + height3) - margin.top - margin.bottom;
      
      const formatter = d3.formatPrefix(".2s", 1e3);
      const svg = d3.select(".grouped-bar-chart-horiz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const x = d3.scaleLinear()
        .domain([0, d3.max(this.data(), d => d3.max(d.values, v => v.value))])
        .range([0, width]);

      const y = d3.scaleBand()
        .domain(this.data().map(d => d.category))
        .range([0, height])
        .paddingInner(0.25);

      // Y axis
      svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(-180, 0)`)
        .call(d3.axisLeft(y));

      d3.select(".y-axis path").remove();
      d3.selectAll(".y-axis line").remove();
      d3.selectAll(".y-axis text")
        .attr("transform", `translate(0, -${(y.bandwidth() / 4) + itemPadding})`);


      // Add a group for each category.
      const groups = svg.selectAll("g.category")
        .data(this.data())
        .enter()
        .append("g")
        .attr("class", "category")
        .attr("transform", function (d) {
          return `translate(0, ${y(d.category)})`;
        });

      
      // Add each category's name to the group for responsiveness
      groups.selectAll("text.category")
        .data(d => [d])
        .enter()
        .append("text")
        .attr("class", "category")
        .attr("x", 0)
        .attr("y", -10)
        .attr("dy", "0.35em")
        .text(d => d.category)
        .style("display", containerWidth <= 400 ? "block" : "none");


      // Add each category's background bars to the group
      groups.selectAll("rect.background")
        .data(d => d.values)
        .enter()
        .append("rect")
        .attr("class", "background")
        .attr("data-year", d => d.year)
        .attr("x", d => containerWidth <= 400 ? x(0) + 35 : x(0))
        .attr("y", (d, i) => i * (y.bandwidth() / 4))
        .attr("width", d => x.range()[1])
        .attr("height", '16px')
        .attr("rx", 2)
        .attr("ry", 2);

      // Add each category's bars to the group
      groups.selectAll("rect.bar")
        .data(d => d.values)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-year", d => d.year)
        .attr("x", d => containerWidth <= 400 ? x(0) + 35 : x(0))
        .attr("y", (d, i) => i * (y.bandwidth() / 4))
        .attr("width", d => x(d.value) > 110 ? x(d.value) - 110 : x(d.value) - 10)
        .attr("height", '16px')
        .attr("fill", "#e1dce8")
        .attr("rx", 2)
        .attr("ry", 2);


      // Add each category's years to the group
      groups.selectAll(".year")
        .data(d => d.values)
        .enter()
        .append("text")
        .attr("class", "year")
        .attr("data-year", d => d.year)
        .attr("x", d => containerWidth <= 400 ? x(0) : x(0) - 50)
        .attr("y", (d, i) => i * (y.bandwidth() / 4) + (y.bandwidth() / 4) / 2)
        .text(d => d.year);


      // Add each category's bar's value to the group
      groups.selectAll(".value")
        .data(d => d.values)
        .enter()
        .append("text")
        .attr("class", "value")
        .attr("data-year", d => d.year)
        .attr("x", d => x.range()[1] - 10)
        .attr("y", (d, i) => i * (y.bandwidth() / 4) + (y.bandwidth() / 4) / 2)
        .text(d => 'R' + formatter(d.value));

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

        // on Resize stop
        let resizeTimer;
        window.addEventListener("resize", () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            this.updateProvider();
          }, 250);
        });

    }, 500);
  }

 

  

  
}