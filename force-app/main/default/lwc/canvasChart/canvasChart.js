/* eslint-disable @lwc/lwc/no-document-query */
/* eslint-disable no-else-return */
/* eslint-disable vars-on-top */
import {
    LightningElement,
    api
} from 'lwc';
import {
    loadScript,
    loadStyle
} from 'lightning/platformResourceLoader';
import Chart from '@salesforce/resourceUrl/chartJs';
export default class CanvasChart extends LightningElement {
    error;
    chart;
    chartJsInitialized = false;
    @api chartComponent;
    @api chartData;
    @api defaultMonth;
    config;
    /* fires after every render of the component. */

    renderedCallback() {
        var _self = this;
        if (this.chartJsInitialized) {
            return;
        }
        /* Load Static Resource For Script*/
        Promise.all([
                loadScript(this, Chart + '/Chart.min.js'),
                loadStyle(this, Chart + '/Chart.min.css')
            ]).then(() => {
                this.chartJsInitialized = true;
                // disable Chart.js CSS injection
                if (_self.chartData !== undefined) {
                    let monthData = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ];
                    let monthList = this.defaultMonth;
                    let listOfChart = this.chartData;
                    console.log(monthList, listOfChart);
                    this.config = {
                        type: 'bar',
                        data: {
                            labels: listOfChart.chartLabel,
                            datasets: [{
                                label: listOfChart.labelA,
                                data: [...listOfChart.dataA],
                                order: 2,
                                backgroundColor: [
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)'
                                ],
                                borderColor: [
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)',
                                    'rgba(217,217,217,1)'
                                ]
                            }, {
                                label: listOfChart.labelB,
                                data: [...listOfChart.dataB],
                                backgroundColor: [
                                    'rgb(255,255,255, 0)'
                                ],
                                borderColor: [
                                    'rgba(122, 187, 74, 1)'
                                ],
                                type: 'line',
                                pointStyle: 'line',
                                order: 1,
                                borderCapStyle: 'round',
                                options: {
                                    legend: {
                                        labels: {
                                            usePointStyle: true
                                        }
                                    }
                                }
                            }]
                        },
                        options: {
                            legend: {
                                labels: {
                                        usePointStyle: true,
                                        padding: 15,
                                        fontSize: 14,
                                        fontColor: '#1D1D1D',
                                        fontFamily: 'Proxima Nova',
                                        fontWeight: '800'
                                },
                                position: 'right',
                                align: 'end'
                            },
                            // legendCallback: function(chart){
                            //     var text = [];
                            //     text.push('<div class="_legend' + chart.id + '">');
                            //    for (var i = 0; i < chart.data.datasets.length; i++) {
                            //       console.log(chart.data.labels , chart.data.labels.length)
                            //      text.push(`<div><div class="legendValue"><span class='symbol-${chart.data.datasets[i].label}' style="background-color:${chart.data.datasets[i].backgroundColor[0]}">&nbsp;&nbsp;&nbsp;&nbsp;</span>`);
                                  
                            //       if (chart.data.datasets[i].label) {
                            //        text.push('<span class="label">' + chart.data.datasets[i].label + '</span>');
                            //      }
                          
                            //      text.push('</div></div><div class="clear"></div>');
                            //    }
                          
                            //    text.push('</div>');
                          
                            //    return text.join('');
                            // },
                            tooltips: {
                                backgroundColor: 'rgba(0, 128, 0, 0.7)',
                                bodyFontFamily: 'Proxima Nova',
                                titleFontFamily: 'Proxima Nova',
                                mode: 'label',
                                titleFontSize: 16,
                                cornerRadius: 0,
                                titleFontColor: '#FFF',
                                bodyFontColor: '#FFF',
                                displayColors: false,
                                borderColor: 'rgba(0, 150, 0)',
                                xPadding: 8,
                                yPadding: 8,
                                usePointStyle: true,
                                callbacks: {
                                    labelColor: function(tooltipItem, chart) {
                                        var dataset = chart.config.data.datasets[tooltipItem.datasetIndex]
                                        return {
                                            borderColor: dataset.borderColor,
                                            backgroundColor: dataset.backgroundColor
                                        };
                                    },
                                
                                    title: function (tooltipItem, data) {
                                        var tooltipTitle;
                                        var titleInitial = data.labels[tooltipItem[0].index];
                                        var titleIndex = tooltipItem[0].index;
                                        monthData.forEach((element) => {
                                            monthList.forEach((ymonth, index) => {
                                                var m = ymonth;
                                                var charString = m.charAt(0);
                                                if (charString === titleInitial) {
                                                    if (titleIndex === index) {
                                                        if (m === element.substring(0, 3)) {
                                                            tooltipTitle = element;
                                                        }
                                                    }
                                                }
                                            })
                                        })
                                        return tooltipTitle;
                                    },
                                    label: function (tooltipItem, data) {
                                        console.log("label", data.datasets[tooltipItem.datasetIndex].label, tooltipItem)
                                        //tooltipItem.yLabel = tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        if (_self.chartComponent === 'Reimbursement') {
                                            return data.datasets[tooltipItem.datasetIndex].label + ': $' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        } else {
                                            return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        }

                                    }
                                }
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        autoSkip: false,
                                        maxRotation: 0,
                                        minRotation: 0,
                                        fontSize: 13,
                                        fontFamily: 'Proxima Nova',
                                        fontColor: '#1D1D1D'
                                    }
                                }],
                                yAxes: [{
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        lineHeight: '1.6',
                                        fontSize: 13,
                                        fontFamily: 'Proxima Nova',
                                        fontColor: '#1D1D1D',
                                        userCallback: function(value) {
                                            // Convert the number to a string and splite the string every 3 charaters from the end
                                            value = value.toString();
                                            value = value.split(/(?=(?:...)*$)/);
                                            value = value.join(',');
                                            if (_self.chartComponent === 'Reimbursement') {
                                                return '$' + value;
                                            }else{
                                                return value;
                                            }
                                        }
                                    }
                                }],
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    }
                
               // window.Chart.platform.disableCSSInjection = true;
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    ctx.canvas.width = 'auto';
                    ctx.canvas.height = 200;
                    this.refs.chartRef.appendChild(canvas);
                    this.chart = new window.Chart(ctx, this.config);
                   
                    // const legend = document.createElement('div');
                    // legend.className = 'legend_wrapper';
                    //ctx.canvas.width = 'content-box;'; /*246*/
                   // ctx.canvas.height = 200;
                    // this.refs.chartRef.appendChild(canvas);
                    // canvas.prepend(legend);
                  
                    // window.document.querySelector('.legend_wrapper').innerHTML = this.chart.generateLegend();
                    //console.log("Chart js ", this.chart, window.document.querySelector('.legend_wrapper'))
                   // legend.innerHTML = this.chart.generateLegend();
                }
            })
            .catch((error) => {
                this.error = error;
            });
    }

    updateDataset(e, datasetIndex){
        var defaultLegendClickHandler = window.Chart.defaults.global.legend.onClick;
        var index = datasetIndex;
        console.log("Chart js method ", e, datasetIndex, index)
        if (index > 1) {
            defaultLegendClickHandler(e, datasetIndex);
        }else{
            var ci = this.chart;
            var meta = ci.getDatasetMeta(0);    
            var result= (meta.data[datasetIndex].hidden === true) ? false : true;
            if(result === true)
            {
                meta.data[datasetIndex].hidden = true;
                e.target.parentNode.querySelector(e.path[0].id).style.textDecoration = "line-through";
            }else{
                e.target.parentNode.querySelector(e.path[0].id).style.textDecoration = "";
                meta.data[datasetIndex].hidden = false;
            }
            
            ci.update();   
        }
    }

}