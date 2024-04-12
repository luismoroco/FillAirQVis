// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import StationTimePlot from './StationTimePlot';
import Axios from "axios";


export default function StationMapper() {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get("http://127.0.0.1:5000/vis/info/map");
                setStations(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }; 

        fetchData().then();
    }, []);

    return (
        <>
            {stations && stations.length > 0 && (
                <StationTimePlot color={'DarkSlateGrey'} stations={stations} />
            )}
            {stations && stations.length > 0 && (
                <StationTimePlot stations={stations} />
            )}
        </>
    );
}
