import React, { useEffect } from 'react';
import './Chart.css'
import Chart from 'chart.js';

var chart;

export function initializeChart(data, labels) {
    var ctx = document.getElementById('heart-rate-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Heart Rate',
                data,
                borderColor: [
                    'rgba(223, 71, 50, 1)'
                ],
                backgroundColor: [
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive:true,
            legend : {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

export function addData(label, data) {
    console.log('ADD DATA ', label, data)
    if(!chart) {
        return;
    }
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

export default function ChartViewComponent(props) {
    useEffect(() => {
       initializeChart(props.data, props.labels);
      });
    return (
        <div className="chart-container">
            <canvas id="heart-rate-chart" height="400" style={ {width: "100%"}}></canvas>
        </div>
    );
}