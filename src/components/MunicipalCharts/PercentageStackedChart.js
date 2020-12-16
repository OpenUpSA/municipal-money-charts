import MunicipalChart from './MunicipalChart.js'
import ResizeObserver from 'resize-observer-polyfill'

export default class PercentageStackedChart extends MunicipalChart {
  constructor (target) {
    super(target)
    this._items = this.d3.select(this.node).append('div').classed('items', true).node()
    this._mainLabel = d => [d.amount, d.label]
    this._subLabel = d => [`${d.label ? d.label + ': ' : ''} ${d.amount}`]
    this._itemResizeObserver = new ResizeObserver(() => this.toggleLabels())
    this._itemResizeObserver.observe(this._items)
  }

  itemResizeHandler () {
    const d3 = this.d3
  
    return () => {
      d3.select(this._items).selectAll('.item.label-overflow').each(function (d, i) {
        d3.select(this)
          .select('.item-label.sub')
          .call(subLabel => subLabel.style('height',`${parseInt(getComputedStyle(subLabel.node()).getPropertyValue('--level-height')) * (i + 1)}px`))
      })
    }
  }

  updateProvider () {
    const d3 = this.d3
    const totalAmount = this.maxValue()
    const mainLabelFunc = this._mainLabel
    const subLabelFunc = this._subLabel
    const transitionDuration = 700

    d3.select(this._items).selectAll('.item')
      .data(this.data())
      .join(
        enter => enter.append('div').style('flex-grow', 0),
        update => update,
        exit => exit.classed('remove', true)
          .transition()
          .duration(transitionDuration)
          .style('flex-grow', 0)
          .style('margin-right', 0)
          .remove()
      )
      .each(function (d) {
        // create or update main and sub labels
        
        d3.select(this)
          .selectAll('.item-label')
          .data([mainLabelFunc(d), subLabelFunc(d)])
            .join(
              enter => enter.append('div').style('opacity', 0),
              update => update,
            )
              .classed('item-label', true)
              .classed('main', (d, i) => !i)
              .classed('sub', (d, i) => i)
              .each(function (d) {
                d3.select(this).selectAll('.item-label-space')
                  .data([d])
                  .join('div')
                  .classed('item-label-space', true)
                    .selectAll('.item-label-body')
                    .data([d])
                    .join('div')
                      .classed('item-label-body', true)
                      .selectAll('div')
                        .data(d)
                        .join('div')
                        .text(d => d)
              })
              .transition()
              .duration(transitionDuration)
              .style('opacity', 1)
      })
      .classed('item', true)
      .style('background-color', d => d.color)
      .transition()
      .duration(transitionDuration)
      .style('flex-grow', d => d.amount / totalAmount)
      .style('margin-right', '4px')

      this.toggleLabels()
  }

  toggleLabels () {
    const d3 = this.d3
    const totalAmount = this.totalAmount()
    const itemsNodeWidth = this._items.clientWidth
    var offset = 0

    d3.select(this._items).selectAll('.item').filter(':not(.remove)').each(function (itemDatum, itemIndex) {
      const itemComputedWidth = itemDatum.amount / totalAmount * itemsNodeWidth
      
      d3.select(this)
        .call(item => {
          offset += itemComputedWidth / 2
          item.select('.item-label.main .item-label-space').style('width', `${itemComputedWidth}px`)
          item.classed('label-overflow', item.select('.item-label-body').node().offsetWidth > itemComputedWidth)
          item.select('.item-label.sub')
            .style('width', `${itemComputedWidth}px`)
            .attr('data-align', function () {
              return d3.select(this).select('.item-label-body').node().clientWidth < itemComputedWidth ? 'center' : (offset / itemsNodeWidth) < 1 / 3 ? 'left' : (offset / itemsNodeWidth) < 2 / 3 ? 'center' : 'right'
            })
        })

        offset += itemComputedWidth / 2
    })

    this.orderLabels()
  }

  orderLabels () {
    const d3 = this.d3

    d3.select(this._items).selectAll('.item.label-overflow').each(function (d, i) {
      d3.select(this)
        .select('.item-label.sub')
        .call(subLabel => subLabel.style('height',`${parseInt(getComputedStyle(subLabel.node()).getPropertyValue('--level-height')) * (i + 1)}px`))
    })

    d3.select(this.node).style('height', `${this._items.scrollHeight}px`)
  }

  mainLabel (func) {
    if (!arguments.length) {
      return this._mainLabel
    }

    this._mainLabel = func
    this.update()
    return this
  }

  subLabel (func) {
    if (!arguments.length) {
      return this._subLabel
    }

    this._subLabel = func
    this.update()
    return this
  }

  maxValue () {
    return this.data().reduce((acc, curr) => Math.max(acc, curr.amount), 0)
  }

  totalAmount () {
    return this.data().reduce((acc, curr) => acc + curr.amount, 0)
  }

  destroy () {
    this._itemResizeObserver.disconnect()
    this.updateProvider = null
  }
}