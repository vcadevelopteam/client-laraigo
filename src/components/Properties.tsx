import React from 'react'; // we need this to make JSX compile

type ParamsProps = {
    title: string,
    paragraph: string
}

const Properties = ({ title, paragraph }: ParamsProps) => {

    return <aside>
        <h2>{title || "PROPIEDADES"}</h2>
        <p>
            {paragraph || ""}
        </p>
    </aside>
}

export default Properties;