import { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import "../components/style/chart.css";
import * as d3 from 'd3';

const TimePlot = ({varia, stat, stat_name}) => {
  const [data, setData] = useState([]);
  const [series, setSeries] = useState([]);
  const [seriesCounter, setSeriesCounter] = useState(0);

  const [saits, setSaits] = useState([])
  const [brits, setBrits] = useState([])
  const [gan, setGAN] = useState([])

  const RESULT_DIR = 'base_imp'


  useEffect(() => { 
    const fetch = async () => {
      const fetchedData = await d3.csv(`https://raw.githubusercontent.com/luismoroco/LlinpayTime/main/server-side/load/series/${stat}.csv`);
      const base_data = process(fetchedData);

      setData(base_data);
 

      const saits_data = await d3.csv(`https://raw.githubusercontent.com/luismoroco/LlinpayTime/main/server-side/load/${RESULT_DIR}/SAITS_${stat}.csv`);
      const saits_form = process(saits_data);
      
      setSaits(saits_form);

      const gan_data = await d3.csv(`https://raw.githubusercontent.com/luismoroco/LlinpayTime/main/server-side/load/${RESULT_DIR}/GAN_${stat}.csv`);
      const gan_form = process(gan_data);
      
      setGAN(gan_form);


      const brits_data = await d3.csv(`https://raw.githubusercontent.com/luismoroco/LlinpayTime/main/server-side/load/${RESULT_DIR}/BRITS_${stat}.csv`);
      const brit_form = process(brits_data);
      
      setBrits(brit_form);

      const newSeries = [
        { name: 'SAITS', data: saits_form },
        { name: 'GAN', data: gan_form },
        { name: 'Brits', data: brit_form },
        { name: 'BASE', data: base_data},
      ];

      setSeries(newSeries);
    }



    if (stat && varia) {
      setSeriesCounter(0);
      setSeries([]);
      fetch();
    }
  }, [stat, varia])

  function process(raw) {
    const data = [];
    raw.forEach(function (datum, i) {
      const localTime = new Date(datum["time"]);
    
      // Restar 5 horas a la hora local para convertirla a GMT
      localTime.setHours(localTime.getHours() - 5);
  
      data.push([localTime.getTime(), parseFloat(datum[varia])]);
    });

    return data
  } 


  const createRandomData = (now, max) => {
    const data = [];
    for (let i = 0; i < 100; i++) { 
      data.push([now + i * 1000, Math.round(Math.random() * max)]); 
    }
    return data; 
  };
 
  const createRandomSeries = (index) => { 
    if (!data) {
      return {
        name: `Series:${index}`,
        data: createRandomData(Date.now(), 1e8)
      }
    } 

    return {
      name: `${index}`, 
      data: data
    };
  }; 

  const handleAddSeries = () => {
    setSeriesCounter((prevCounter) => prevCounter + 1);
    setSeries((prevSeries) => [...prevSeries, createRandomSeries(seriesCounter + 1)]);
  };

  const handleRemoveSeries = () => {
    if (series.length > 0) {
      const randomIndex = Math.floor(Math.random() * series.length);
      setSeries((prevSeries) => prevSeries.filter((_, index) => index !== randomIndex));
    }
  };
 
 
  return (
    <div className="mainchart" style={{ width: '100%', height: '900px' }}>
      <HighchartsReact 
        highcharts={Highcharts} 
        options={{  
          title: {
            text: `Comparación de Métodos de imputación para ESTACION=[${stat_name}] y VARIABLE=[${varia}], ID=[${stat}]`
          },
          chart: {
            height: 900,
            zoomType: 'x',    
          },
          legend: {
            align: 'left', 
            title: {
              text: 'Leyenda' 
            }
          },
          xAxis: { 
            type: 'datetime',
            title: {
              text: 'Time'
            }
          },
          yAxis: {
            title: {
              text: 'Value'
            }
          },
          rangeSelector: {
            selected: 1
          },
          series: series.map(({ name, data }) => ({ name, data }))
        }}
      />
    </div>
  );
};


export default TimePlot;