import GroupedBarChart  from '../components/MunicipalCharts/GroupedBarChart';
import * as data1 from './data/grouped-bar-chart-1.json';
import * as data2 from './data/grouped-bar-chart-2.json';
import * as data3 from './data/grouped-bar-chart-3.json';
import * as dataMissingValues from './data/grouped-bar-chart-missing-values.json';

const d3Format = require('d3-format')

const chart = new GroupedBarChart()
const dataOptions = {
    'Data 1 Colored': data1.default,
    'Data 2 Colored': data2.default,
    'Data 3': data3.default,
    'Data missing values': dataMissingValues.default,
    'Empty Data': []
}

const formatOptions = {
    'short': d3Format.format('.2s'),
    'full': d3Format.format('')
}

const seriesFieldOptions = {
    "budget_phase": "budget_phase",
    "financial_year": "financial_year"
}

const highlightOptions = {
    'Empty': '',
    'Adjusted budget (budget_phase)': 'Adjusted budget',
    'Audited outcome (budget_phase)': 'Audited outcome',
    '2018-19 (financial_year)': '2018-19'
}

const groupOptions = {
    'budget_phase': 'budget_phase',
    'financial_year': 'financial_year'
}

const story = ({ width, smallBreakpoint, dataName, groupBars, seriesField, highlight, format, destroy }) => {
    chart.data(dataOptions[dataName])
        .format(formatOptions[format])
        .smallBreakpoint(smallBreakpoint)
        .width(width)
        .highlight(highlightOptions[highlight])
        .seriesField(seriesFieldOptions[seriesField])
        .groupBars(groupOptions[groupBars])

    if (destroy) {
        chart.destroy()
    }

    return chart.node
}

story.storyName = "Grouped Bar Chart"
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
    seriesField: {
        control: {
            type: 'select',
            options: Object.keys(seriesFieldOptions)
        }
    },
    groupBars: {
        control: {
            type: 'select',
            options: Object.keys(groupOptions)
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
    seriesField: Object.keys(seriesFieldOptions)[0],
    groupBars: Object.keys(groupOptions)[0],
    highlight: Object.keys(highlightOptions)[0],
    format: Object.keys(formatOptions)[0],
    destroy: false
}
