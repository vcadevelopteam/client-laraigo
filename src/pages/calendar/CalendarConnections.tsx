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
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
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

    const googleConfirmDisconnect = (id: number) => {
        const callback = () => {
            dispatch(calendarGoogleDisconnect({ id }))
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
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                }
            }
        }
    }, [resCalendarGoogleDisconnect])
    
    return (
        <div className={classes.containerDetail}>
            <div className="row-zyx">
                <div className={classes.containerDescription}>
                    <Typography className={classes.containerDescriptionTitle} color="primary">
                        {t(langKeys.calendar_connections_title)}
                    </Typography>
                    <Typography className={classes.containerDescriptionSubtitle} color="textPrimary">
                        {t(langKeys.calendar_connections_subtitle)}
                    </Typography>
                </div>
            </div>
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
                <div>
                    {calendarGoogleActive ?
                        <Button
                            className={classes.integrationButton}
                            variant="contained"
                            disabled={resCalendarGoogleValidate.loading}
                            color="primary"
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => googleConfirmDisconnect(row?.calendareventid)}
                        >
                            {t(langKeys.disconnect)} 
                        </Button>
                        :
                        <GoogleOAuthProvider clientId={apiUrls.GOOGLECLIENTID_CALENDAR}>
                            <GoogleLogIn
                                label="Conectar"
                                scope={'https://www.googleapis.com/auth/calendar.readonly'}
                                googleDispatch={(e) => {
                                    dispatch(calendarGoogleLogIn({ ...e, id: row?.calendareventid }))
                                    setWaitGoogleLogIn(true);
                                }}
                                data={{id: row?.calendareventid, data_code: row?.code }}
                            />
                        </GoogleOAuthProvider>
                    }
                </div>
            </div>
        </div>
    )
}

export default CalendarConnections;