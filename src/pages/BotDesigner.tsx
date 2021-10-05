/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
import { chatblock_set } from 'store/botdesigner/actions';
import { useHistory } from 'react-router-dom'
import paths from 'common/constants/paths';
import { apiUrls } from 'common/constants';

const BotDesigner: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    
    const origin = new URL(apiUrls.CHATFLOW).origin;
    const pathname = new URL(apiUrls.CHATFLOW).pathname

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
    
    const [frame, setFrame] = useState(false);
    const [url, setUrl] = useState('');
    
    useEffect(() => {
        postCrossDomainMessage(localStorage.getItem('accessToken'));
        setUrl(`${origin}${pathname}`);
    },[frame])

    return (
        <div style={{height: '100%'}}>
            <iframe
                id="ifr"
                title='botdesigner'    
                src={url}
                style={{height: '100%', width: '100%', border: 'none'}}
                onLoad={() => setFrame(true)}
            >
            </iframe>
        </div>
    )
}

export default BotDesigner;