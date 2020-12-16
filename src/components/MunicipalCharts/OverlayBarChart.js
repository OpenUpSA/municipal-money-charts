import MunicipalChart from './MunicipalChart.js'
import ResizeObserver from 'resize-observer-polyfill'
import * as d3 from 'd3'

export default class OverlayBarChart extends MunicipalChart {
  constructor (target) {
    super(target)
    this._seriesOrder = null
    this._seriesField = 'item'
    this._barClasses = ['main', 'top', 'bottom']
    this._valueResizeObserver = new ResizeObserver(this.valueResizeHandler())
  }

  valueResizeHandler () {
    return entries => {
      let maxWidth = entries.reduce((maxWidth, entry) => {
        return Math.max(maxWidth, entry.contentRect.width)
      }, 0)

      d3.selectAll('.item-value').style('min-width', `${maxWidth}px`)
    }
  }

  updateProvider () {
    const valueResizeObserver = this._valueResizeObserver
    const format = this._format
    const barClasses = this._barClasses
    const items = this.orderData(
        this.groupData(this.data(), this._seriesField)
    )
    const maxBarValue = this.maxBarValue()
    const mainBarValue = (d) => {
      return (!d.data[barClasses[0]] || d.data[barClasses[0]].amount === null) ? 'Not available' : format(d.data[barClasses[0]].amount)
    }

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
            .classed('item-track', true)
            .each(function (d) {
              d3.select(this)
              .selectAll('.item-series')
              .data([d])
              .join('div')
              .classed('item-series', true)
                .selectAll('.item-bar')
                .data(Object.values(d.data))
                .join(enter => enter.append('div').style('width', '0%'))
                .attr('class', d => `bar-${d.className}`)
                .classed('item-bar', true)
                .attr('data-tooltip', d => d.amount === null ? "Not available" : format(d.amount))
                .transition()
                .duration(500)
                .style('width', d => `${d.amount / maxBarValue * 100}%`)
                .style('background-color', d => d.color)

              d3.select(this).selectAll('.item-value')
                .data([d])
                .join('span')
                .classed('item-value', true)
                .style('min-width', 'auto')
                .call(itemValue => {
                  itemValue.selectAll('.item-value-body')
                    .data(d => [d])
                    .join('div')
                    .classed('item-value-body', true)
                    .each(function () {
                      valueResizeObserver.observe(this)
                    })
                    .text(mainBarValue)
                })
            })
      })
  }

  seriesOrder (value) {
    if (!arguments.length) {
      return this._seriesOrder
    }

    this._seriesOrder = value
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

  groupData (value, key) {
    return Array.from(d3.group(value, d => d[key]), ([item, data]) => ({ item, data }))
  }

  orderData (groups) {
    const validItem = (item) => {
      return !this._seriesOrder || this._seriesOrder.find(name => item.phase === name)
    }

    const matchClass = (item, itemIndex) => {
      const index = this._seriesOrder ? this._seriesOrder.findIndex(name => item.phase === name) : itemIndex
      return Object.assign({ className: this._barClasses[index] }, item)
    }

    groups.forEach(group => {
      const validValues = group.data.filter(validItem)
      group.data = Object.fromEntries(
        d3.index(validValues.map(matchClass), d => d.className)
      )
    })

    return groups
  }


  maxBarValue () {
    return this.data().reduce((acc, curr) => Math.max(acc, curr.amount), 0)
  }

  destroy () {
    this._valueResizeObserver.disconnect()
    this.updateProvider = null
  }
}
