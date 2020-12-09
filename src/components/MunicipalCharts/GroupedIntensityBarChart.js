import MunicipalChart from './MunicipalChart.js'
import ResizeObserver from 'resize-observer-polyfill'
import * as d3 from 'd3'

export default class GroupedIntencityBarChart extends MunicipalChart {
  constructor (target) {
    super(target)

    d3.select(this.node).call(node => {
      this._axis = node.append('div').classed('axis', true)
      this._axisLabel =  this._axis.append('div').classed('axis-label', true)
      this._table = node.append('div').classed('table', true)
    })

    this._highlight = null
    this._intensityLabelField = 'amount'
    this._barGroupingField = 'comparison'
    this._xAxisLabel = 'Intencity Chart'

    this._labelResizeObserver = new ResizeObserver(this.labelResizeHandler())
    this._barResizeObserver = new ResizeObserver(this.barResizeHandler())
  }

  labelResizeHandler () {
    const table = this._table
    const axis = this._axis

    return function () {
      const labels = table.selectAll('.row-label-body')
      const maxWidth = d3.max(labels.nodes(), node => node.clientWidth)
      table.selectAll('.row-label').style('width', `${maxWidth}px`)
      axis.style('right', `${table.select('.row-label').node().clientWidth}px`)
    }
  }

  barResizeHandler () {
    return function (entries) {
      for (const entry of entries) {
          const barWidth = entry.contentRect.width
          d3.select(entry.target).select('.bar-label').classed('external', function () {
            return this.clientWidth > barWidth
          })
      }
    }
  }

  updateProvider () {
    const labelResizeObserver = this._labelResizeObserver
    const barResizeObserver = this._barResizeObserver
    const minMaxAmount = this.minMax('amount')
    const minMaxLabel = this.minMax(this._intensityLabelField)
    const transitionDuration = 700
    const intensityLabelField = this._intensityLabelField
    const format = this.format()

    labelResizeObserver.disconnect()
    barResizeObserver.disconnect()

    const labelSaturation = (d) => {
      const minSaturation = 0.4
      return minSaturation + Math.abs(d[this._intensityLabelField]) / Math.max(Math.abs(minMaxLabel.min), Math.abs(minMaxLabel.max)) * (1 - minSaturation)
    }

    const updateLabelBody = label => {
      label.selectAll('.row-label-body')
        .data(d => [d])
        .join('div')
        .each(function () {
          labelResizeObserver.observe(this)
        })
        .classed('row-label-body', true)
        .text(d => d[intensityLabelField])
    }

    const updateLabel = row => {
      row.selectAll('.row-label')
        .data(d => [d])
        .join('div')
        .call(updateLabelBody)
        .classed('row-label', true)
        .transition()
        .duration(transitionDuration)
        .style('opacity', d => labelSaturation(d))
    }

    const updateBarLabel = bar => {
      bar.selectAll('.bar-label')
        .data(d => [d])
        .join('div')
        .classed('bar-label', true)
        .text(d => format(d.amount))
    }

    const updateBar = track => {
      track.selectAll('.bar')
        .data(d => [d])
        .join(
          enter => enter.append('div')
            .style('width', '0%')
            .style('transform', 'translateX(0%)')
        )
        .each(function () {
          barResizeObserver.observe(this)
        })
        .call(updateBarLabel)
        .classed('bar', true)
        .classed('negative', d => d.amount < 0)
        .transition()
        .duration(transitionDuration)
        .style('background-color', d => d.color)
        .style('width', d => `${Math.abs(d.amount) / minMaxAmount.diff * 100}%`)
        .style('left', d => `${(Math.abs(minMaxAmount.min) / minMaxAmount.diff + Math.min(0, d.amount / minMaxAmount.diff)) * 100}%`)
    }

    const updateBarTrack = row => {
      row.selectAll('.bar-track')
        .data(d => [d])
        .join('div')
        .classed('bar-track', true)
        .call(updateBar)
    }

    const updateGroupChart = groupChart => {
      groupChart.selectAll('.chart-row')
        .data(d => d.series)
        .join('div')
        .classed('chart-row', true)
        .call(updateBarTrack)
        .call(updateLabel)
    }

    const updateGroup = group => {
      group.selectAll('.group-label')
      .data(d => [d])
      .join('div')
        .classed('group-label', true)
        .text(d => d.group)

      group.selectAll('.group-chart')
        .data(d => [d])
        .join('div')
        .classed('group-chart', true)
        .call(updateGroupChart)
    }

    this._table.selectAll('.table-group')
      .data(this.groups())
      .join('div')
        .classed('table-group', true)
        .call(updateGroup)

      this._axisLabel
        .text(this._xAxisLabel)
        .transition()
        .duration(transitionDuration)
        .style('left', `${Math.abs(minMaxAmount.min) / minMaxAmount.diff * 100}%`)
  }

  highlight (name) {
    if (!arguments.length) {
      return this._highlight
    }

    this._highlight = name
    this.update()
    return this
  }

  intensityLabelField (value) {
    if (!arguments.length) {
      return this._intensityLabelField
    }

    this._intensityLabelField = value
    this.update()
    return this
  }

  barGroupingField (value) {
    if (!arguments.length) {
      return this._barGroupingField
    }

    this._barGroupingField = value
    this.update()
    return this
  }

  xAxisLabel (value) {
    if (!arguments.length) {
      return this._xAxisLabel
    }

    this._xAxisLabel = value
    this.update()
    return this
  }

  minMax (field) {
    const values = this.data().reduce((acc, curr) => {
      acc.min = Math.min(acc.min, curr[field] || 0)
      acc.max = Math.max(acc.max, curr[field] || 0)
      return acc
    }, { min: 0, max: 0 })

    return Object.assign(values, { diff: values.max - values.min })
  }

  groups () {
    return Array.from(this.d3.group(this.data(), d => d[this._barGroupingField]), ([group, series]) => ({ group, series }))
  }
}