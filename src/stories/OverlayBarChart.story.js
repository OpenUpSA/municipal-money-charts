import OverlayBarChart  from '../components/MunicipalCharts/OverlayBarChart';
const d3Format = require('d3-format')
import * as data1 from './data/overlay-bar-chart-1.json';
import * as data2 from './data/overlay-bar-chart-2.json';
import * as dataColors from './data/overlay-bar-chart-colors.json';
import * as dataMissing from './data/overlay-bar-chart-missing-data.json';

const chart = new OverlayBarChart()

const dataOptions = {
    'Data 1': data1.default,
    'Data 2': data2.default,
    'Data Colored': dataColors.default,
    'Data missing': dataMissing.default,
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

const phases = ["Amount budgeted", "Transferred up to 2021 Q3", "Spent up to 2021 Q3"]
const phasesForMissing = ["Budget", "Transferred", "Spent"]

const orderOptions = {
    'Not set': null,
    [phases.join(' -> ')]: phases,
    [phases.slice().reverse().join(' -> ')]: phases.slice().reverse(),
    [`${phasesForMissing.join(' -> ')} (for missng data)`]: phasesForMissing
}

const story = ({ width, smallBreakpoint, dataName, format, order, destroy }) => {
    chart.data(dataOptions[dataName])
        .format(formatOptions[format])
        .smallBreakpoint(smallBreakpoint)
        .width(width)
        .seriesOrder(orderOptions[order])

    if (destroy) {
        chart.destroy()
    }

    return chart.node
}

export default story

story.storyName = "Overlay Bar Chart"

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
    order: {
        control: {
            type: 'select',
            options: Object.keys(orderOptions)
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
    order: Object.keys(orderOptions)[0],
    destroy: false
}
