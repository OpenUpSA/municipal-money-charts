import BarChart  from '../components/MunicipalCharts/BarChart';
import * as data1 from './data/bar-chart-1.json';
import * as data2 from './data/bar-chart-2.json';
import * as dataColors from './data/bar-chart-colors.json';
const d3Format = require('d3-format')

const chart = new BarChart()
const dataOptions = {
    'Data 1': data1.default,
    'Data 2': data2.default,
    'Data Colored': dataColors.default,
    'Empty Data': []
}

const formatOptions = {
    'R currency': d3Format.formatLocale({
        decimal: '.',
        thousands: ' ',
        grouping: [3],
        currency: ['R', ''],
    }).format('$,'),
    'default currency': d3Format.format('($.2f')
}

const story = ({ width, smallBreakpoint, dataName, format, destroy }) => {
    chart.data(dataOptions[dataName]).format(formatOptions[format]).smallBreakpoint(smallBreakpoint).width(width)

    if (destroy) {
        chart.destroy()
    }

    return chart.node
} 

export default story

story.storyName = "Bar Chart"

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
    format: {
        control: {
            type: 'select',
            options: Object.keys(formatOptions)
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
    smallBreakpoint: 300,
    dataName: Object.keys(dataOptions)[0],
    format: Object.keys(formatOptions)[0],
    destroy: false
}