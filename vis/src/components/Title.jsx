export default function Title(props) {
    const { title, style } = props;

    return (
        <>
            <h1 className={`font-extrabold text-center shadow-lg ` + `${style}`} >{title}</h1>
        </>
    )
} 