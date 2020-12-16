import GroupedBarChart  from '../components/MunicipalCharts/GroupedIntensityBarChart'
import * as data1 from './data/grouped-intensity-bar-chart-1.json'
import * as data2 from './data/grouped-intensity-bar-chart-1-positive.json'
import * as data3 from './data/grouped-intensity-bar-chart-1-negative.json'
const d3Format = require('d3-format')

const chart = new GroupedBarChart()
const dataOptions = {
    'Colored': data1.default,
    'All positive': data2.default,
    'All negative': data3.default
}

const positivePrefix = function (format) {
    return function (value) {
        return `${value > 0 ? '+' : ''}${format(value)}`
    }
}

const formatOptions = {
    'short': positivePrefix(d3Format.format('.2s')),
    'full': positivePrefix(d3Format.format(''))
}

const labelFormatOptions = {
    '%': positivePrefix(d3Format.format('.0%')),
    'No format': positivePrefix(d3Format.format(''))
}

const highlightOptions = {
    'Empty': '',
    'Original to Adjusted budget': 'Original to Adjusted budget',
    'Original budget to Audited outcome': 'Original budget to Audited outcome',
    'Interest Earned - Outstanding Debtors': 'Interest Earned - Outstanding Debtors'
}

const intensityLabelOptions = {
    'percentage_change': 'percentage_change',
    'amount': 'amount'
}

const barGroupingOptions = {
    'item': 'item',
    'comparison': 'comparison'
}


const story = ({ width, smallBreakpoint, dataName, format, highlight, intensityLabelField, barGroupingField, xAxisLabel, labelFormat, destroy }) => {
    chart.data(dataOptions[dataName])
        .format(formatOptions[format])
        .smallBreakpoint(smallBreakpoint)
        .width(width)
        .highlight(highlightOptions[highlight])
        .intensityLabelField(intensityLabelOptions[intensityLabelField])
        .barGroupingField(barGroupingOptions[barGroupingField])
        .xAxisLabel(xAxisLabel)
        .labelFormat(labelFormatOptions[labelFormat])

    if (destroy) {
        chart.destroy()
    }

    return chart.node
} 

story.storyName = "Grouped Intensity Bar Chart"
export default story

story.argTypes = {
    width: {
        control: {
            type: 'number'
        }
    },
    smallBreakpoint: {
        control: {
            type: 'number'
        },
    },
    dataName: {
        control: {
            type: 'select',
            options: Object.keys(dataOptions)
        }
    },
    highlight: {
        control: {
            type: 'select',
            options: Object.keys(highlightOptions)
        }
    },
    format: {
        control: {
            type: 'select',
            options: Object.keys(formatOptions)
        }
    },
    labelFormat: {
        control: {
            type: 'select',
            options: Object.keys(labelFormatOptions)
        }
    },
    intensityLabelField: {
        control: {
            type: 'select',
            options: Object.keys(intensityLabelOptions)
        }
    },
    barGroupingField: {
        control: {
            type: 'select',
            options: Object.keys(barGroupingOptions)
        }
    },
    xAxisLabel: {
        control: {
            type: 'text'
        }
    },
    destroy: {
        control: {
            type: 'boolean'
        }
    }
}

story.args = {
    width: '',
    smallBreakpoint: 500,
    dataName: Object.keys(dataOptions)[0],
    highlight: Object.keys(highlightOptions)[0],
    format: Object.keys(formatOptions)[0],
    labelFormat: Object.keys(labelFormatOptions)[0],
    intensityLabelField: Object.keys(intensityLabelOptions)[0],
    barGroupingField: Object.keys(barGroupingOptions)[0],
    xAxisLabel: 'Original budget',
    destroy: false
}