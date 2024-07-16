import React from 'react';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { showSnackbar } from 'store/popus/actions';
import { getCollection, resetAllMain } from 'store/main/actions';
import { getSecurityRules } from 'common/helpers';
import PersonalInformation from './PersonalInformation';
import ChangePassword from './ChangePassword';
import ChangePlan from './ChangePlan';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import BuildIcon from '@material-ui/icons/Build';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SecurityIcon from '@material-ui/icons/Security';
import UsageSettings from './UsageSettings';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
        background: '#fff',
    },     
    seccionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        paddingBottom: 10
    },
    hyperlinkstyle: {
        color: "-webkit-link",
        cursor: "pointer",
        textDecoration: "underline"
    }, 
    navoption: {
        backgroundColor: '#F6F6F6',
        margin:'1rem 1rem', 
        display:'flex',
        alignItems:'center',
        gap:'0.4rem',
        padding:'0.5rem 1rem', 
        borderRadius:'0.5rem', 
        cursor:'pointer',
        transition: 'all 0.1s', 
        '&:hover': {
            backgroundColor: '#A547A6',
            color:'white',
            transition: 'all 0.1s', 
        }
    },
    selectedNavoption: {
        backgroundColor: '#A547A6',
        color:'white',
    },    
}));

const UserSettings: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    const user = useSelector(state => state.login.validateToken.user);
    const [waitSave, setWaitSave] = useState(false);
    const executeResult = useSelector(state => state.main.execute);
    const [view, setView] = useState('view-1');

    const fetchData = () => dispatch(getCollection(getSecurityRules()));

    useEffect(() => {
    fetchData();
    return () => {
        dispatch(resetAllMain());
    };
    }, []);

    useEffect(() => {
    if (waitSave) {
        if (!executeResult.loading && !executeResult.error) {
        setWaitSave(false);
        dispatch(showSnackbar({ show: true, severity: 'success', message: t(langKeys.successful_cancel_suscription) }));
        } else if (executeResult.error) {
        const errormessage = t(executeResult.code || 'error_unexpected_error');
        dispatch(showSnackbar({ show: true, severity: 'error', message: errormessage }));
        setWaitSave(false);
        }
    }
    }, [executeResult]);

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ marginTop: 4 }}>{t(langKeys.accountsettings)}</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ backgroundColor: 'white', display: 'block', height: '88vh', width: '23vw', paddingTop: '1rem' }}>
                <div className={`${classes.navoption} ${view === 'view-1' ? classes.selectedNavoption : ''}`} onClick={() => setView('view-1')}>
                    <AccountBoxIcon />
                    Datos Personales
                </div>
                <div className={`${classes.navoption} ${view === 'view-2' ? classes.selectedNavoption : ''}`} onClick={() => setView('view-2')}>
                    <SecurityIcon />
                    Contraseña y Seguridad
                </div>
                <div className={`${classes.navoption} ${view === 'view-3' ? classes.selectedNavoption : ''}`} onClick={() => setView('view-3')}>
                    <MonetizationOnIcon />
                    {t(langKeys.planinformation)}
                </div>
                <div className={`${classes.navoption} ${view === 'view-4' ? classes.selectedNavoption : ''}`} onClick={() => setView('view-4')}>
                    <BuildIcon />
                    Configuración de Uso
                </div>
            </div>
            <div style={{ backgroundColor: 'white', display: 'block', height: '88vh', width: '80vw', padding: '2rem' }}>
                {view === 'view-1' && <PersonalInformation setViewSelected={setView} />}
                {view === 'view-2' && <ChangePassword setViewSelected={setView} />}
                {view === 'view-3' && <ChangePlan setViewSelected={setView} />}
                {view === 'view-4' && <UsageSettings setViewSelected={setView} />}
            </div>
            </div>           
        </div>
    );
};
  
export default UserSettings;