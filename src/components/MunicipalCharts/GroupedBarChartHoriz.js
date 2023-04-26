import MunicipalChart from './MunicipalChart.js'
import ResizeObserver from 'resize-observer-polyfill'
import * as d3 from 'd3'

export default class GroupedBarChartHoriz extends MunicipalChart {
  constructor(target) {
    super(target)
    this._seriesField = 'item'
    this._valueResizeObserver = new ResizeObserver(this.valueResizeHandler())
  }

  valueResizeHandler() {
    return entries => {
      let maxWidth = entries.reduce((maxWidth, entry) => {
        return Math.max(maxWidth, entry.contentRect.width)
      }, 0)

      d3.selectAll('.item-value').style('min-width', `${maxWidth}px`)
    }
  }

  updateProvider() {
    const valueResizeObserver = this._valueResizeObserver
    const format = this._format
    const items = this.groupData(this.data(), this._seriesField)
    //console.log(items);
    const maxBarValue = this.maxBarValue()

    valueResizeObserver.disconnect()

    d3.select(this.node).selectAll('.item')
      .data(items)
      .join('div')
      .classed('item', true)
      .each(function (d) {
        d3.select(this)
          .selectAll('.item-label')
          .data([d])
          .join('div')
          .classed('item-label', true)
          .each(function (d) {
            d3.select(this).selectAll('.item-label-body')
              .data([d])
              .join('div')
              .classed('item-label-body', true)
              .text(d => d.item)
          })

        d3.select(this)
          .selectAll('.item-track')
          .data([d])
          .join('div')
          .classed('item-track', true) // for each item, draw a bar for each financial year
          .each(function (d) {
            console.log(d);
            d3.select(this)
              .selectAll('.item-series')
              .data([d])
              .join('div')
              .classed('item-series', true)
              .selectAll('.item-bar')
              .data(Object.values(d.data))
              .join(enter => enter.append('div').style('width', '0%'))
              .attr('class', d => `bar-main`)
              .classed('item-bar', true)
              .attr('data-tooltip', d => d.amount === null ? "Not available" : format(d.amount))
              .transition()
              .duration(500)
              .style('width', d => `${d.amount / maxBarValue * 100}%`)
              .style('background-color', d => d.color)
          })
      })
  }

  seriesField(value) {
    if (!arguments.length) {
      return this._seriesField
    }

    this._seriesField = value
    this.update()

    return this
  }

  groupData(value, key) {
    return Array.from(d3.group(value, d => d[key]), ([item, data]) => ({ item, data }))
  }

  maxBarValue() {
    return this.data().reduce((acc, curr) => Math.max(acc, curr.amount), 0)
  }
}
