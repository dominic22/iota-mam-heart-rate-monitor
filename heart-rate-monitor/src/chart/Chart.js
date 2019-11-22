import React, { useEffect } from 'react';
import './Chart.css'
import Chart from 'chart.js';

export function initializeChart() {
    var ctx = document.getElementById('heart-rate-chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Heart Rate',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
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

export default function ChartViewComponent() {
    useEffect(() => {
       initializeChart();
      });
    return (
        <div className="chart-container">
            <canvas id="heart-rate-chart" height="400" style={ {width: "100%"}}></canvas>
        </div>
    );
}