import './App.css'
import MatPlot from './components/MapPlot.jsx'
import StationMapper from "./components/StationMapper.jsx";
import TimePlot from "./components/TimePlot.jsx";
import { useState } from 'react';


function App() {
    const [station, setStation] = useState("");
    const [vari, setVari] = useState("");
    const [statName, setStatName] = useState("");


    return (
        <div className="w-full  flex-col bg-slate-300"  style={{ height: '100vh', width: '100vw' }}>
            <TimePlot stat={station} varia={vari} stat_name={statName}/>
            <div className="w-full h-1/3 flex flex-row">
                <div className="w-1/4 bg-gray-300">
                    <MatPlot setVar={setVari}  setStat={setStation} setStatName={setStatName}/>
                </div>
                <div className="w-3/4 flex flex-col"> 
                    <StationMapper />    
                </div>
            </div> 
        </div> 
    );
}
 
export default App;