// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function PlotlyTime({ color, stat, varia }) {
    const [data, setData] = useState([]);
    const [nanIndices, setNanIndices] = useState([]);

    const xField = 'time';
    var rawDataURL;
    var yField; 

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await d3.csv(rawDataURL);
            const formattedData = prepData(fetchedData);

            setData(formattedData);
        };

        if (stat && varia) {
            rawDataURL = `https://raw.githubusercontent.com/luismoroco/LlinpayTime/main/server-side/load/series/${stat}.csv`;
            yField = varia;
            fetchData();
        }
    }, [stat, varia]);

    function prepData(rawData) {
        const x = [];
        const y = [];
        const nanIndices = []; // Track indices of NaN values

        rawData.forEach(function (datum, i) {
            x.push(new Date(datum[xField]));
            y.push(datum[yField]);

            if (isNaN(parseFloat(datum[yField]))) { // Check for NaN values
               nanIndices.push(i);
            }
        });

        setNanIndices(nanIndices); // Update the nanIndices state

        return [
            {
                type: 'scatter',
                mode: 'lines',
                x: x,
                y: y,
                marker: {
                   color: color,
                },
            },
        ];
    }

    const config = {
        displayModeBar: false,
    };

    const shapes = nanIndices.map((index) => ({
       type: 'line',
       x0: data[0].x[index],
       x1: data[0].x[index],
       y0: 0,
       y1: 1,
       xref: 'x',
       yref: 'paper',
       line: {
         color: 'red',
         width: 1,
         dash: 'dash',
       },
     }));
    
    return (
        <div style={{ width: '100%', height: '100%', border: 'none' }}> 
            <Plot
                data={data}
                layout={{
                    width: 1315,
                    height: 250, 
                    autosize: true,
                    xaxis: {
                        rangeslider: {}, 
                    },
                    yaxis: {
                        fixedrange: true,
                    },
                    margin: {
                        l: 30,
                        r: 20,
                        b: 20,
                        t: 20,
                    },
                    shapes: shapes,
                }}
                config={config}
            />
        </div>
    );
}

export default PlotlyTime;