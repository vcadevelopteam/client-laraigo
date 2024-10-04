import { makeStyles } from '@material-ui/core/styles';
import { openLink } from 'network/service/linkcount';
import { FC, useEffect } from 'react';

const useStyles = makeStyles(() => ({
    spinner: {
        height: 60,
        width: 60,
        border: '7px solid',
        borderRadius: '50%',
        borderColor: 'red black black black',
        animation: '$rotate 1.5s linear infinite',
    },
    '@keyframes rotate': {
        to: { transform: 'rotate(365deg)' },
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
}));

export const RedirectLink: FC = () => {
    const classes = useStyles();
    const url = new URLSearchParams(window.location.search);
    const middleUrl = window.location.href.split("&params=")[0];
    const urlToOpen = middleUrl.split("redirect?to=")[1];
    const paramsString = url.get("params");
    const [corpId, orgId, messageTemplateId, historyId, type, linkId] = paramsString ? paramsString.split('-') : [];

    useEffect(() => {
        openLink({
            corpid: parseInt(corpId),
            orgid: parseInt(orgId),
            messagetemplateid: parseInt(messageTemplateId),
            historyid: parseInt(historyId),
            type: type === '1' ? 'CAMPAIGN' : 'HSM',
            link_id: parseInt(linkId),
        })
        const timer = setTimeout(() => {
            window.location.href = urlToOpen;
        }, 3000);

        return () => clearTimeout(timer);
    }, [urlToOpen]);

    return (
        <div className={classes.center}>
            <div className={classes.spinner}></div>
            <div style={{marginTop: 20, fontWeight: 'bold', fontSize: 20}}>Redireccionando a la url...</div>
        </div>
    )
}

export default RedirectLink;