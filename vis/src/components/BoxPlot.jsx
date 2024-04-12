// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as d3 from 'd3';

function BoxPlotPlotly({color, stat, varia}) {
    const [data, setData] = useState([]);

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
        const y = rawData.map(datum => datum[yField]);

        return [{
            y: y,
            boxpoints: 'outliers',
            jitter: 0.3,
            pointpos: -1.8,
            type: 'box',
            marker: {
                color: 'rgb(55, 56, 7)',
            },
            line: {
                color: color,
            }
        }];
    }

    const config = {
        displayModeBar: false,
    };

    return (
        <div style={{ width: '100%', height: '100%', border: 'none' }}>
            <Plot
                data={data}
                layout={{
                    width: 350,
                    height: 250,
                    autosize: true,
                    xaxis: {
                        showgrid: false,
                        zeroline: false,
                    },
                    yaxis: {
                        showline: false,
                        fixedrange: true,
                    },
                    margin: {
                        l: 0,
                        r: 0,
                        b: 0,
                        t: 0
                    }
                }}
                config={config}
            />
        </div>
    );
}

export default BoxPlotPlotly;
