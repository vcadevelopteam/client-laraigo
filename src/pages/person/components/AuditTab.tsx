import { Grid, makeStyles } from "@material-ui/core";
import { IPerson } from "@types";
import { FC } from "react";
import { Property } from "./Property";
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import TapAndPlayIcon from '@material-ui/icons/TapAndPlay';
import RecentActorsIcon from '@material-ui/icons/RecentActors';
import WebOutlinedIcon from '@material-ui/icons/WebOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';

interface AuditTabProps {
    person: IPerson;
}

const useChannelItemStyles = makeStyles(theme => ({
    root: {
        border: '#EBEAED solid 1px',
        borderRadius: 5,
        padding: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        paddingLeft: theme.spacing(3),
        display: "flex",
        alignItems: "center"

    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexGrow: 1,
    },
    propTitle: {
        fontWeight: 400,
        fontSize: 14,
        color: '#8F92A1',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemLabel: {
        color: '#8F92A1',
        fontSize: 14,
        fontWeight: 400,
        margin: 0,
    },
    itemText: {
        color: theme.palette.text.primary,
        fontSize: 15,
        fontWeight: 400,
        margin: '6px 0',
    },
    subtitle: {
        display: 'flex',
        flexDirection: 'row',
        gap: '0.5em',
        alignItems: 'center',
    },
    propSubtitle: {
        color: theme.palette.text.primary,
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
    },
    buttonphone: {
        padding: 0,
        '&:hover': {
            color: "#7721ad",
        },
    }, propertyRoot: {
        display: 'flex',
        flexDirection: 'row',
        stroke: '#8F92A1',
        alignItems: 'center',
        overflowWrap: 'anywhere',
    },
    leadingContainer: {
        height: 40,
        width: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        stroke: '#8F92A1',
        fill: '#8F92A1',
    },
    propSubtitleTicket: {
        fontWeight: 400,
        fontSize: 15,
        margin: 0,
        width: '100%',
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
}));

export const AuditTab: FC<AuditTabProps> = ({ person }) => {
    const classes = useChannelItemStyles();
    return (
        <Grid container direction="row" style={{ border: "solid grey 1px", borderRadius: 15 }}>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<CalendarTodayIcon style={{ fill: '#8F92A1' }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={"personalizedreport_person.createdate"} />}
                            subtitle={new Date(person.createdate).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<CalendarTodayIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={langKeys.modificationDate} />}
                            subtitle={new Date(person.changedate).toLocaleString()}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<CalendarTodayIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={langKeys.lastContactDate} />}
                            subtitle={person.lastcontact ? new Date(person.lastcontact).toLocaleString() : ''}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Property
                            icon={<PersonOutlineIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={langKeys.modifiedBy} />}
                            subtitle={person.changeby}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<MailOutlineIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={"Comunicación por mail"}
                            subtitle={person.email?"ACTIVO":"INACTIVO"}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<WhatsAppIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={"Comunicación por hsm"}
                            subtitle={person.phonewhatsapp?"ACTIVO":"INACTIVO"}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<TapAndPlayIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={langKeys.lastCommunicationChannel} />}
                            subtitle={person.lastcommunicationchannel}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<PersonOutlineIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={langKeys.createdBy} />}
                            subtitle={person.createby}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid container direction="column">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<RecentActorsIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={langKeys.personid} />}
                            subtitle={person.personid}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<WebOutlinedIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={langKeys.status} />}
                            subtitle={person.status}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  style={{marginBottom: 40}}>
                        <Property
                            icon={<PeopleAltOutlinedIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={<Trans i18nKey={langKeys.attention_group} />}
                            subtitle={person.groups}
                            m={1}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Property
                            icon={<PaymentOutlinedIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                            classesAlt={classes}
                            title={"Descripción persona"}
                            subtitle={person.description}
                            m={1}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}