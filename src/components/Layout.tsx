import React from 'react'; // we need this to make JSX compile

type ParamsProps = {
    title: string,
    paragraph: string
}

const Layout = ({ title, paragraph }: ParamsProps) => {

    return <aside>
        <h2>{title}</h2>
        <p>
            {paragraph}
        </p>
    </aside>
}

export default Layout;