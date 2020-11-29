import { muniDataIn } from '../assets/data.js';
import SimpleBarChart from '../components/MuniMoneyChart/SimpleBarChart';

export default {
    title: 'SimpleBarChart',
}

export const simple = ({ category }) => {
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'simpleBarChart')
    document.body.appendChild(wrapper)

    muniDataIn.mainMuni['custom_1'] = {
        data:[
            {
                value: 32,
                fillColor: "blue"
            },
            {
                value: 68,
                fillColor: "green"
            }
        ]
    }

    muniDataIn.mainMuni['custom_2'] = {
        data:[
            {
                value: 72,
                fillColor: "blue"
            },
            {
                value: 28,
                fillColor: "green"
            }
        ]
    }
    let medianChart = new SimpleBarChart(wrapper).width(400).height(150).data(muniDataIn.mainMuni[category].data)

    // setTimeout(() =>{
    //     medianChart.data(

    //     ])
    // },5000)
    // console.log(medianChart)
    // wrapper.appendChild(medianChart);



    return wrapper;
}
simple.argTypes = {
    category: {
        control: {
            type: 'select',
            options: [
                'custom_1',
                'custom_2',
                'cash_balance',
                'cash_coverage',
                'operating_budget',
                'capital_budget',
                'repairs_maintenance',
                'wasteful_expenditure',
                'current_ratio',
                'liquidity_ratio'
            ],
        },
    },
}

simple.args = {
    category: 'cash_balance'
}
simple.storyName = "SimpleBarChart"