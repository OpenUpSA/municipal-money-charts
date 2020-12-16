import PercentageStackedChart  from '../components/MunicipalCharts/PercentageStackedChart';

import * as data2Items from './data/percentage-bar-chart_2-items.json';
import * as data2ItemsTiny from './data/percentage-bar-chart_2-items-tiny.json';
import * as data3Items from './data/percentage-bar-chart_3-items.json';
import * as data3ItemsTiny from './data/percentage-bar-chart_3-items-tiny.json';
import * as data3ItemsColors from './data/percentage-bar-chart_3-items-colors.json';

const chart = new PercentageStackedChart()
const dataOptions = {
    '2 Items': data2Items.default,
    '2 Items Tiny': data2ItemsTiny.default,
    '3 Items': data3Items.default,
    '3 Items Tiny': data3ItemsTiny.default,
    '3 Items Colored': data3ItemsColors.default
}

const mainLabelOptions = {
    "Default": d => [d.amount, d.label],
    "Option 1": d => ['Some Text']
}

const subLabelOptions = {
    "Default": d => [`${d.label ? d.label + ': ' : ''} ${d.amount}`],
    "Option 1": d => [`Number of people on the moon: ${d.amount}`]
}

const story = ({ width, dataName, mainLabel, subLabel, destroy }) => {
    chart.data(dataOptions[dataName]).width(width).mainLabel(mainLabelOptions[mainLabel]).subLabel(subLabelOptions[subLabel])

    if (destroy) {
        chart.destroy()
    }

    return chart.node
}

export default story

story.argTypes = {
    width: {
        control: {
            type: 'number'
        }
    },
    dataName: {
        control: {
            type: 'select',
            options: Object.keys(dataOptions)
        }
    },
    mainLabel: {
        control: {
            type: 'select',
            options: Object.keys(mainLabelOptions)
        }
    },
    subLabel: {
        control: {
            type: 'select',
            options: Object.keys(subLabelOptions)
        }
    },
    destroy: {
        control: 'boolean'
    }
}

story.args = {
    width: '',
    dataName: Object.keys(dataOptions)[0],
    mainLabel: Object.keys(mainLabelOptions)[0],
    subLabel: Object.keys(subLabelOptions)[0],
    destroy: false
}

story.storyName = "Percentage Stacked Chart"