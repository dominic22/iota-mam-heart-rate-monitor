import React, { useEffect } from 'react';
import './Chart.css'
import Chart from 'chart.js';

export const mode = 'restricted';
export const secretKey = 'SECRETBIG'; // secret always upper case!
export const provider = 'https://nodes.devnet.iota.org';
var chart;
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&key=${secretKey.padEnd(81, '9')}&root=`;

const customTooltips = function (tooltip) {
  // Tooltip Element
  var tooltipEl = document.getElementById('chartjs-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.innerHTML = '<div class="tooltip-wrapper"></div>';
    this._chart.canvas.parentNode.appendChild(tooltipEl);
  }

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltip.yAlign) {
    tooltipEl.classList.add(tooltip.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  function getBody(bodyItem) {
    return bodyItem.lines;
  }

  // Set Text
  if (tooltip.body) {
    var titleLines = tooltip.title || [];
    var bodyLines = tooltip.body.map(getBody);

    let innerHtml = '';

    innerHtml += '<div class="label">'  + titleLines[0] +'</div>'

    bodyLines.forEach(function (body, i) {
      const span = '<div class="chartjs-tooltip-key">' + body +'</div>';
      innerHtml += span;
      const index = chart.data.datasets[0].root && chart.data.datasets[0].root.length - 1;
      const href = mamExplorerLink + chart.data.datasets[0].root[index];
      innerHtml += '<div class="chartjs-tooltip-root"><a href="' + href + '" target="_blank">open explorer</a></div>'
    });

    var tooltipWrapper = tooltipEl.querySelector('div.tooltip-wrapper');
    tooltipWrapper.innerHTML = innerHtml;
  }

  var positionY = this._chart.canvas.offsetTop;
  var positionX = this._chart.canvas.offsetLeft;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
  tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
  tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
  tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
};

export function initializeChart(data, labels) {
  var ctx = document.getElementById('heart-rate-chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Heart Rate',
        data,
        root: [],
        borderColor: [
          'rgba(223, 71, 50, 1)'
        ],
        backgroundColor: ['rgba(0, 0, 0, 0.2)'],
        borderWidth: 1,
        pointHoverRadius: 6,
        pointHoverBorderColor: 'rgba(223, 71, 50, 1)',
      }]
    },
    options: {
      responsive: true,
      hover: {
        intersect: false,
      },
      title: {
        display: true,
        text: '',
        padding: 20,
        fontColor: '#ffffff',
        fontSize: 22,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        fontStyle: 'normal'
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: '#ffffff',
          },
        }],
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            beginAtZero: true
          }
        }]
      },
      tooltips: {
        enabled: false,
        intersect: false,
        custom: customTooltips
      }
    }
  });
}

export function addData(label, data, title, nextRoot) {
  console.log('ADD DATA ', label, data)
  if (!chart) {
    return;
  }
  if (title) {
    chart.options.title.text = title;
  }
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
    dataset.root.push(nextRoot);
  });
  chart.update();
}

export default function ChartViewComponent(props) {
  useEffect(() => {
    initializeChart(props.data, props.labels);
  });
  return (
    <div className="chart-wrapper">
      <div className="chart-container">
        <canvas id="heart-rate-chart" height="400" style={{ width: '100%' }}></canvas>
      </div>
    </div>
  );
}
