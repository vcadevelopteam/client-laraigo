/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
import { chatblock_set } from 'store/flowdesigner/actions';
import { useHistory } from 'react-router-dom'
import paths from 'common/constants/paths';

const FlowDesigner: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    
    //const origin = 'https://localhost:4200';
    const origin = 'https://zyxmelinux.zyxmeapp.com';
    //const path = '';
    const path = '/chatflow';

    const receiveCrossDomainMessage = (event: any) => {
        if (event?.origin === origin) {
            dispatch(chatblock_set(event.data.chatblock));
            history.push(paths.VARIABLECONFIGURATION);
        }
    }

    useEffect(() => {
        window.addEventListener('message', (event) => receiveCrossDomainMessage(event));
    }, [])

    const postCrossDomainMessage = (msg: any) => {
        var win: any = document?.getElementById('ifr');
        win?.contentWindow.postMessage({'jwt': msg}, origin);
        return undefined;
    }
    
    const [frame, setFrame] = useState(false)
    const [url, setUrl] = useState('')
    
    useEffect(() => {
        postCrossDomainMessage(localStorage.getItem('accessToken'));
        setUrl(`${origin}/${path}`);
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