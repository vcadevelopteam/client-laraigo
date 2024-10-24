import { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
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
import { Property } from "../index";
import { useChannelItemStyles } from "pages/person/styles";
import { SimpleTabProps } from "pages/person/model";

const AuditTab: FC<SimpleTabProps> = ({ person }) => {
    const { t } = useTranslation();
    const classes = useChannelItemStyles();
    return (
        <div style={{ width: "100%", border: "solid grey 1px", borderRadius: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Property
                    style={{width: 250}}
                    icon={<CalendarTodayIcon style={{ fill: '#8F92A1' }} />}
                    classesAlt={classes}
                    title={<Trans i18nKey={"personalizedreport_person.createdate"} />}
                    subtitle={new Date(person.createdate).toLocaleString()}
                    m={1}
                />
                <Property
                    style={{width: 250}}
                    icon={<MailOutlineIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={"Comunicación por mail"}
                    subtitle={person.email ? "ACTIVO" : "INACTIVO"}
                    m={1}
                />
                <Property
                    style={{width: 250}}
                    icon={<RecentActorsIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={"Id " + t(langKeys.person).toLocaleLowerCase()}
                    subtitle={person.personid}
                    m={1}
                />

            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Property
                    style={{width: 250}}
                    icon={<CalendarTodayIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={<Trans i18nKey={langKeys.modificationDate} />}
                    subtitle={new Date(person.changedate).toLocaleString()}
                    m={1}
                />
                <Property
                    style={{width: 250}}
                    icon={<WhatsAppIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={"Comunicación por hsm"}
                    subtitle={person.phonewhatsapp ? "ACTIVO" : "INACTIVO"}
                    m={1}
                />
                <Property
                    style={{width: 250}}
                    icon={<WebOutlinedIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={<Trans i18nKey={langKeys.status} />}
                    subtitle={person.status}
                    m={1}
                />

            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Property
                    style={{width: 250}}
                    icon={<CalendarTodayIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={<Trans i18nKey={langKeys.lastContactDate} />}
                    subtitle={person.lastcontact ? new Date(person.lastcontact).toLocaleString() : ''}
                    m={1}
                />
                <Property
                    style={{width: 250}}
                    icon={<TapAndPlayIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={<Trans i18nKey={langKeys.lastCommunicationChannel} />}
                    subtitle={person.lastcommunicationchannel}
                    m={1}
                />
                <Property
                    style={{width: 250}}
                    icon={<PeopleAltOutlinedIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={<Trans i18nKey={langKeys.attention_group} />}
                    subtitle={person.groups}
                    m={1}
                />

            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Property
                    style={{width: 250}}
                    icon={<PersonOutlineIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={<Trans i18nKey={langKeys.modifiedBy} />}
                    subtitle={person.changeby}
                    m={1}
                />
                <Property
                    style={{width: 250}}
                    icon={<PersonOutlineIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={<Trans i18nKey={langKeys.createdBy} />}
                    subtitle={person.createby}
                    m={1}
                />
                <Property
                    style={{width: 250}}
                    icon={<PaymentOutlinedIcon style={{ fill: '#8F92A1', height: 35, width: 35 }} />}
                    classesAlt={classes}
                    title={"Descripción persona"}
                    subtitle={person.description}
                    m={1}
                />

            </div>

        </div>
    );
}
export default AuditTab;