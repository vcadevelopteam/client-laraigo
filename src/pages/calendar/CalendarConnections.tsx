/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { GoogleCalendarIcon } from 'icons';
import { apiUrls } from 'common/constants';
import GoogleLogIn from 'components/fields/GoogleLogIn';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { calendarGoogleDisconnect, calendarGoogleLogIn } from 'store/calendar/actions';
import { CircularProgress, Typography } from '@material-ui/core';
import { getCollectionAux } from 'store/main/actions';
import { selBookingIntegrationSel } from 'common/helpers';
const isIncremental = window.location.href.includes("incremental")

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
    },
    containerDescription: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '10px',
    },
    containerDescriptionTitle: {
        fontSize: 24
    },
    containerDescriptionSubtitle: {
        fontSize: 14,
        fontWeight: 500
    },
    integrationIcon: {
        width: '50px',
        height: '50px'
    },
    integrationRow: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: "center",
        gap: '10px 64px',
        background: '#fff',
        padding: '20px',
        marginBottom: '20px',
    },
    integrationItem: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center",
        gap: '16px',
    },
    integrationText: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: "center",
        gap: '5px 32px',
    },
    integrationTitle: {
        flexBasis: '200px',
        fontSize: '20px',
    },
    integrationDescription: {
        flexBasis: '250px',
        fontSize: '16px',
        color: '#989898',
    },
    integrationInformation: {
        fontSize: '16px',
        color: '#2E2C34',
        ' & > p': {
            fontWeight: 'bold',
        },
        ' & > p > span': {
            fontWeight: 'normal',
        }
    },
    integrationButton: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    }
}));

interface CalendarConnectionsProps {
    row: Dictionary | null;

    dataGrid: any[];
    setDataGrid: (value: any[]) => void;

    calendarGoogleActive: boolean;
    setCalendarGoogleActive: (value: boolean) => void;
}

interface CalendarIntegrationData {
    calendarintegrationid: number;
    calendareventid: number;
    email: string;
    person_name: string;
}

const CalendarConnections: React.FC<CalendarConnectionsProps> = ({
    row,

    dataGrid,
    setDataGrid,

    calendarGoogleActive,
    setCalendarGoogleActive
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();
    
    const resCalendarGoogleValidate = useSelector(state => state.calendar.requestGoogleValidate);
    const resCalendarGoogleLogIn = useSelector(state => state.calendar.requestGoogleLogIn);
    const resCalendarGoogleDisconnect = useSelector(state => state.calendar.requestGoogleDisconnect);
    const [waitGoogleLogIn, setWaitGoogleLogIn] = useState(false);
    const [waitGoogleDisconnect, setWaitGoogleDisconnect] = useState(false);
    const mainResultAux = useSelector(state => state.main.mainAux);
    const [integrationData, setIntegrationData] = useState<CalendarIntegrationData[]>([])

    useEffect(() => {
        dispatch(getCollectionAux(selBookingIntegrationSel(row?.calendareventid)))
    }, [row])

    useEffect(() => {
        if (!mainResultAux.loading && !mainResultAux.error) {
            setIntegrationData(mainResultAux.data as CalendarIntegrationData[])
        }
    }, [mainResultAux])

    const googleConfirmDisconnect = (calendareventid: number, calendarintegrationid: number) => {
        const callback = () => {
            dispatch(calendarGoogleDisconnect({ calendareventid, calendarintegrationid }))
            dispatch(showBackdrop(true));
            setWaitGoogleDisconnect(true);  
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.calendar_confirmation_disconnect),
            callback
        }))
    }

    useEffect(() => {
        if (waitGoogleLogIn) {
            if (!resCalendarGoogleLogIn.loading) {
                setDataGrid(
                    dataGrid.map(dg => ({
                        ...dg,
                        credentialsdate: dg.calendareventid === row?.calendareventid
                        ? new Date().toISOString()
                        : dg.credentialsdate
                    }))
                )
                setWaitGoogleLogIn(false)
                if (!resCalendarGoogleLogIn.error) {
                    setCalendarGoogleActive(true)
                    dispatch(getCollectionAux(selBookingIntegrationSel(row?.calendareventid)))
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                }
            }
        }
    }, [resCalendarGoogleLogIn])

    useEffect(() => {
        if (waitGoogleDisconnect) {
            if (!resCalendarGoogleDisconnect.loading) {
                setDataGrid(
                    dataGrid.map(dg => ({
                        ...dg,
                        credentialsdate: dg.calendareventid === row?.calendareventid
                        ? null
                        : dg.credentialsdate
                    }))
                )
                setWaitGoogleDisconnect(false)
                dispatch(showBackdrop(false))
                if (!resCalendarGoogleDisconnect.error) {
                    setCalendarGoogleActive(false)
                    dispatch(getCollectionAux(selBookingIntegrationSel(row?.calendareventid)))
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                }
            }
        }
    }, [resCalendarGoogleDisconnect])
    
    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx" style={{ background: '#fff', marginBottom: 0}}>
                <div className={classes.containerDescription}>
                    <Typography className={classes.containerDescriptionTitle} color="primary">
                        {t(langKeys.calendar_connections_title)}
                    </Typography>
                    <Typography className={classes.containerDescriptionSubtitle} color="textPrimary">
                        {t(langKeys.calendar_connections_subtitle)}
                    </Typography>
                </div>
            </div>
            {!mainResultAux.loading && integrationData.map((item) => (
                <div key={item.calendarintegrationid} className={classes.integrationRow}>
                    <div className={classes.integrationItem}>
                        <div>
                            <GoogleCalendarIcon className={classes.integrationIcon} />
                        </div>
                        <div className={classes.integrationText}>
                            <div className={classes.integrationTitle}>
                                Google Calendar
                            </div>
                            <div className={classes.integrationDescription}>
                                Gmail - G Suite
                            </div>
                            <div className={classes.integrationInformation}>
                                {item.person_name && (
                                    <Typography>
                                        {t(langKeys.assigned_agent)}: <span>{item.person_name}</span>
                                    </Typography>
                                )}
                                <Typography>
                                    {t(langKeys.agent_email)}: <span>{item.email}</span>
                                </Typography>
                            </div>
                        </div>
                    </div>
                    {!isIncremental &&
                        <Button
                            className={classes.integrationButton}
                            variant="contained"
                            disabled={resCalendarGoogleValidate.loading}
                            color="primary"
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => googleConfirmDisconnect(row?.calendareventid, item.calendarintegrationid)}
                        >
                            {t(langKeys.disconnect)} 
                        </Button>
                    }
                </div>
            ))}

            <div className={classes.integrationRow}>
                <div className={classes.integrationItem}>
                    <div>
                        <GoogleCalendarIcon className={classes.integrationIcon} />
                    </div>
                    <div className={classes.integrationText}>
                        <div className={classes.integrationTitle}>
                            Google Calendar
                        </div>
                        <div className={classes.integrationDescription}>
                            Gmail - G Suite
                        </div>
                    </div>
                </div>
                {!isIncremental &&
                    <div>
                        <GoogleOAuthProvider clientId={apiUrls.GOOGLECLIENTID_CALENDAR}>
                            <GoogleLogIn
                                label="Conectar"
                                scope={'https://www.googleapis.com/auth/calendar'}
                                googleDispatch={(e) => {
                                    dispatch(calendarGoogleLogIn({ ...e, id: row?.calendareventid }))
                                    setWaitGoogleLogIn(true);
                                }}
                                data={{id: row?.calendareventid, data_code: row?.code }}
                            />
                        </GoogleOAuthProvider>
                    </div>
                }
            </div>
            {mainResultAux.loading && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CircularProgress />
                </div>
            )}
        </div>
    )
}

export default CalendarConnections;