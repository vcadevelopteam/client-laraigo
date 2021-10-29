/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useDispatch } from 'react-redux';
import { chatblock_set } from 'store/botdesigner/actions';
import { useHistory } from 'react-router-dom'
import paths from 'common/constants/paths';
import { apiUrls } from 'common/constants';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const origin = new URL(apiUrls.CHATFLOW).origin;
const pathname = new URL(apiUrls.CHATFLOW).pathname
const url = `${origin}${pathname}`;

const BotDesigner: FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();

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
        win?.contentWindow.postMessage({ 'jwt': msg }, origin);
        return undefined;
    }

    const [frame, setFrame] = useState(false);

    useEffect(() => {
        if (frame) {
            postCrossDomainMessage(localStorage.getItem('accessToken'));
        }
    }, [frame])

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Backdrop style={{ zIndex: 999999999, color: '#fff', position: 'absolute' }} open={!frame}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <iframe
                id="ifr"
                title='botdesigner'
                src={url}
                style={{ height: '100%', width: '100%', border: 'none' }}
                onLoad={() => {
                    setFrame(true);
                }}
            >
            </iframe>
        </div>
    )
}

export default BotDesigner;