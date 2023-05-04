import GroupedBarChartHoriz from '../components/MunicipalCharts/GroupedBarChartHoriz';
import * as data1 from './data/grouped-bar-chart-horiz-1.json';
const d3Format = require('d3-format')

const chart = new GroupedBarChartHoriz()
const dataOptions = {
    'Data 1': data1.default,
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

const story = ({ width, dataName, format, destroy }) => {
    chart.data(dataOptions[dataName]).format(formatOptions[format]).width(width)

    return chart.node
}

export default story

story.storyName = "Grouped Bar Chart Horizontal"

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
    }
}

story.args = {
    width: '',
    dataName: Object.keys(dataOptions)[0],
    format: Object.keys(formatOptions)[0]
}