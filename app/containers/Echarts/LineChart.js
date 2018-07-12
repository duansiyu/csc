import React, { Component } from 'react';
import Echarts from 'native-echarts';
export default class LineChart extends Component {
    state={
        xAxisData:[],
        seriesData:[]
    }
    render() {
        // const {xAxisData,seriesData} = this.state;
        let xAxisData = this.props.option.xAxis ? this.props.option.xAxis.data :[]
        let seriesData = this.props.option.series ? this.props.option.series[0].data :[]

        var option = {
            /*grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },*/
            xAxis : [{
                type: 'category',
                boundaryGap: false,
                data: xAxisData,
                axisTick:{
                    interval:0
                },
            }],
            yAxis : [{
                type : 'value'
            }],
            series : [
                {
                    // name:'',
                    type:'line',
                    // stack: '总量',
                    // label: {
                    //     normal: {
                    //         show: true,
                    //     },
                    // },
                    lineStyle: {
                        normal: {
                            color:'#1E90FF'
                        },
                    },
                    itemStyle:{
                        normal: {
                            color:'#1E90FF'
                        },
                    },
                    areaStyle: {
                        normal: {
                            color:{
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#08c' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#1E90FF' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            }
                        }
                    },
                    data:seriesData
                }
            ]
        };

        return (
            <Echarts option={option} height={300} width={400}/>
        );
    }
}

