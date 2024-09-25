import React from 'react';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
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
    const [view, setView] = useState(() => localStorage.getItem('currentView') || 'view-1');

    useEffect(() => {
        localStorage.setItem('currentView', view);
    }, [view]);

    const fetchData = () => dispatch(getCollection(getSecurityRules()));

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <h2 style={{ marginTop: 4 }}>{t(langKeys.accountsettings)}</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ backgroundColor: 'white', display: 'block', height: '88vh', width: '23vw', paddingTop: '1rem' }}>
                    <div className={`${classes.navoption} ${view === 'view-1' ? classes.selectedNavoption : ''}`} onClick={() => setView('view-1')}>
                        <AccountBoxIcon />
                        Datos personales
                    </div>
                    <div className={`${classes.navoption} ${view === 'view-2' ? classes.selectedNavoption : ''}`} onClick={() => setView('view-2')}>
                        <SecurityIcon />
                        Contraseña y seguridad
                    </div>
                    <div className={`${classes.navoption} ${view === 'view-3' ? classes.selectedNavoption : ''}`} onClick={() => setView('view-3')}>
                        <MonetizationOnIcon />
                        {t(langKeys.planinformation)}
                    </div>
                    <div className={`${classes.navoption} ${view === 'view-4' ? classes.selectedNavoption : ''}`} onClick={() => setView('view-4')}>
                        <BuildIcon />
                        Configuración de uso
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