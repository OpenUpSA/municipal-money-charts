import MunicipalChart from './MunicipalChart.js'
import ResizeObserver from 'resize-observer-polyfill'
import * as d3 from 'd3'

export default class GroupedBarChart extends MunicipalChart {
  constructor (target) {
    super(target)

    this._seriesField = 'budget_phase'
    this._groupBars = 'financial_year'
    this._ticksNum = 7
    this._highlight = null

    d3.select(this.node).call(node => {
      this._xAxis = node.append('div').classed('x-axis', true)
      this._yAxis = node.append('div').classed('y-axis', true)
      this._plot = node.append('div').classed('plot', true)
    })

    this._valueResizeObserver = new ResizeObserver(() => this.updateBarSpace())
  }

  updateProvider () {

    d3.select(this.node)
      .datum(this.groups())

      // x-axis

      .call(node => {
        this._xAxis.selectAll('.axis-group')
          .data(node.datum())
          .join('div')
          .classed('axis-group', true)
          .text(d => d.group)
      })

      // y-axis and plot

      .call((node, maxValue, yAxis, plot, ticksNum, format, maxBars, seriesField, highlight, small, observer) => {

        // y-axis

        const scale = d3.scaleLinear()
          .domain([0, maxValue])
          .nice(ticksNum)
        
        const ticks = node.datum().length ? scale.ticks(ticksNum) : []
        const compareValue = small ? maxValue : scale.domain()[1]
        
        yAxis.selectAll('.tick')
          .data(ticks)
          .join('div')
          .classed('tick', true)
          .text(d => format(d))

        // plot

        observer.disconnect()

        // lining

        plot.selectAll('.plot-lines')
          .data([node.datum()])
          .join('div')
          .classed('plot-lines', true)
          .selectAll('.plot-line')
          .data(ticks)
          .join('div')
          .classed('plot-line', true)

        // series

        plot.selectAll('.plot-group')
          .data(node.datum())
          .join('div')
          .classed('plot-group', true)
          .attr('data-group', d => d.group)
          .each(function (d) {

            // bar

            d3.select(this).selectAll('.bar-track')
              .data(d.series)
              .join('div')
              .classed('bar-track', true)
              .classed('highlight', d => d[seriesField] === highlight)
              .each(function (d) {
                d3.select(this)
                  .selectAll('.bar')
                  .data([d])
                  .join('div')
                  .each(function (d) {

                    // I add the body to shade it separately from tooltip

                    d3.select(this)
                      .selectAll('.bar-body')
                      .data([d])
                      .join('div')
                      .classed('bar-body', true)
                      .style('background-color', d => d.color)

                    // bar value

                    d3.select(this)
                      .selectAll('.bar-value')
                      .data([d])
                      .join('div')
                      .classed('bar-value', true)
                      .text(d => format(d.amount))
                      .each(function () {
                        if (small) {

                          // looking for label change as it affects the available space with small container

                          observer.observe(this)
                        }
                      })
                  })
                  .classed('bar chart-tooltip top', true)
                  .attr('data-tooltip', d => format(d.amount))
                  .transition()
                  .style('flex-grow', d => d.amount / compareValue)
              })
              .style('flex-grow', `${1 / maxBars}`)
              
          })
      }, 
      this.maxValue(), 
      this._yAxis, 
      this._plot, 
      this._ticksNum, 
      this._format, 
      this.maxBars(),
      this._seriesField, 
      this._highlight,
      this._small,
      this._valueResizeObserver
      )

    this.updateBarSpace()
  }

  smallTrigger () {
    this.update()
  }

  updateBarSpace () {
    const maxValueWidth = this._plot.selectAll('.bar-value')
      .nodes().reduce((acc, curr) => {
        return Math.max(acc, curr.getBoundingClientRect().width)
      }, 0)

    // add padding to fit the bar and its text value

    this._plot.selectAll('.bar-track').style('padding-right', `${maxValueWidth}px`)
  }

  highlight (name) {
    if (!arguments.length) {
      return this._highlight
    }

    this._highlight = name
    this._plot.classed('highlight', !!name)
    this.update()
    return this
  }

  seriesField (value) {
    if (!arguments.length) {
      return this._seriesField
    }

    this._seriesField = value
    this.update()
    return this
  }

  groupBars(value) {
    if (!arguments.length) {
      return this._groupBars
    }

    this._groupBars = value
    this.update()
    return this
  }

  maxBars () {
    return this.groups().reduce((acc, curr) => Math.max(acc, curr.series.length), 0)
  }

  maxValue () {
    return this.data().reduce((acc, curr) => Math.max(acc, curr.amount), 0)
  }

  groups () {
    return Array.from(this.d3.group(this.data(), d => d[this._groupBars]), ([group, series]) => ({ group, series }))
  }

  destroy () {
    this._valueResizeObserver.disconnect()
    this.updateProvider = null
  }
}