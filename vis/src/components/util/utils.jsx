export default function NanPercent(props) {
    const { nan } = props;
    let color = "";
    if (nan <= 5) {
        color = "green";
    } else if (nan > 5 && nan <= 10) {
        color = "orange";
    } else if (nan >= 20) {
        color = "red";
    }

    return (
        <p className={`font-medium text-${String(color)}-600`}>{`${nan} %`}</p>
    );
}

export const getFillColor = (number) => {
    if (number >= 100)
        return 'white'
    if (number < 5) {
        return 'green';
    } else if (number >= 5 && number < 10) {
        return 'orange';
    } else {
        return 'red';
    }
};

export const getShape = (cont_len, total) => {
    if (cont_len <= 0.3 * total)
        return 'M 0,0 l -5,8 l 10,0 z' // triangle
    if (cont_len > 0.3 * total && cont_len <= 0.6 * total)
        return 'M -5,-5 l 10,0 l 0,10 l -10,0 z' // square
    else
        return 'M 0,0 m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0' //circle
}

export const circleIcon = (number, cont_len, total) => ({
    path: getShape(cont_len, total),
    fillColor: getFillColor(number),
    fillOpacity: 1,
    strokeWeight: 2,
    scale: 2,
});

export const spacing = "";

export const variab = [
    {name: "PM25"},
    {name: "PM10"},
    {name: "NO2"},
    {name: "CO"},
    {name: "O3"},
    {name: "SO2"},
]