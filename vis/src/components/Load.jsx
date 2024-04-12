// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const Load = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rows = await d3.csv("../public/data/1015.csv", d3.autoType);
                setData(processing(rows))
                
            } catch (err) {
                console.log("Fetch error")
            }
        }   

        fetchData();
    }, []);

    function processing(rows) {
        if (!rows) {
            return []
        }
        
        const raw = []
        for (let i = 0; i < rows.length; ++i) {
            const row = rows[i]
            raw.push({
                "time": row.time,
                "value": row.PM25,
            })
        }

        return raw
    }

    return (
        <div>
            <h1>{1}</h1>
        </div>
    );
};

export default Load;
