import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile

const FlowDesigner: FC = () => {
    const postCrossDomainMessage = (msg: any) => {
        var win: any = document?.getElementById('ifr');
        win?.contentWindow.postMessage({'jwt': msg}, "https://zyxmedev.com");
        return undefined;
    }
    
    const [frame, setFrame] = useState(false)
    const [url, setUrl] = useState('')
    
    useEffect(() => {
        postCrossDomainMessage(localStorage.getItem('accessToken'));
        setUrl('https://zyxmedev.com/chatweb/chatflow')
    },[frame])

    return (
        <div style={{height: '100%'}}>
            <iframe
                id="ifr"
                title='flowdesigner'    
                src={url}
                style={{height: '100%', width: '100%', border: 'none'}}
                onLoad={() => setFrame(true)}
            >
            </iframe>
        </div>
    )
}

export default FlowDesigner;