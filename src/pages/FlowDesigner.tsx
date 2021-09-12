import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile

const FlowDesigner: FC = () => {
    const postCrossDomainMessage = (msg: any) => {
        var win: any = document?.getElementById('ifr');
        win?.contentWindow.postMessage({'jwt': msg}, "https://zyxmedev.com");
        return undefined;
    }
    
    const [frame, setFrame] = useState(false)
    
    useEffect(() => {
        postCrossDomainMessage(localStorage.getItem('accessToken'));
    },[frame])

    return (
        <div style={{height: '100%'}}>
            <iframe
                id="ifr"
                title='flowdesigner'    
                src="https://zyxmedev.com/chatweb/chatflow/#/block"
                style={{height: '100%', width: '100%', border: 'none'}}
                onLoad={() => setFrame(true)}
            >
            </iframe>
        </div>
    )
}

export default FlowDesigner;