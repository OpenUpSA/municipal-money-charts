import MunicipalChart from './MunicipalChart.js'
import ResizeObserver from 'resize-observer-polyfill'
import * as d3 from 'd3'

export default class GroupedBarChart extends MunicipalChart {
  constructor(target) {
    super(target)

    this._seriesField = 'budget_phase'
    this._groupBars = 'financial_year'
    this._ticksNum = 7
    this._highlight = null

    var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    d3.select(this.node).call(node => {
      this._xAxis = node.append('div').classed('x-axis', true)
      this._yAxis = node.append('div').classed('y-axis', true)
      this._plot = node.append('div').classed('plot', true)
    })
  }
}