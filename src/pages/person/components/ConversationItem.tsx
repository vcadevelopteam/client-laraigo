import { Collapse, Grid, IconButton, makeStyles, Tooltip } from "@material-ui/core";
import { Dictionary } from "@types";
import DialogInteractions from "components/inbox/DialogInteractions";
import { useSelector } from "hooks";
import { CallRecordIcon } from "icons";
import { langKeys } from "lang/keys";
import { VoximplantService } from "network";
import { FC, useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/popus/actions";
import { Property } from "./index";
import { GetIcon } from "components";
import { ArrowDropDown } from "@material-ui/icons";
import { ConversationItemProps } from "../model";
import { useConversationsItemStyles } from "../styles";

const ConversationItem: FC<ConversationItemProps> = ({ conversation, person }) => {
    const classes = useConversationsItemStyles();
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const mainResult = useSelector(state => state.main);
    const [rowSelected, setRowSelected] = useState<Dictionary | null>(null);
    const openDialogInteractions = useCallback((row: any) => {
        setOpenModal(true);
        setRowSelected({ ...row, displayname: person.name, ticketnum: row.ticketnum })
    }, [mainResult]);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const showVoxi = conversation.channeltype === "VOXI" && conversation.postexternalid && conversation.callanswereddate
    const downloadCallRecord = async (ticket: Dictionary) => {

        try {
            const axios_result = await VoximplantService.getCallRecord({ call_session_history_id: ticket.postexternalid });
            if (axios_result.status === 200) {
                let buff = Buffer.from(axios_result.data, 'base64');
                const blob = new Blob([buff], { type: axios_result.headers['content-type'].split(';').find((x: string) => x.includes('audio')) });
                const objectUrl = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = objectUrl;
                a.download = ticket.ticketnum;
                a.click();
            }
        }
        catch (error: any) {
            const errormessage = t(error?.response?.data?.code || "error_unexpected_error")
            dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
        }
    }

    return (
        <div className={classes.root}>
            <DialogInteractions
                openModal={openModal}
                setOpenModal={setOpenModal}
                ticket={rowSelected}
            />
            <Grid container direction="row">

                <Grid item xs={12} sm={12} md={showVoxi?1:3} lg={showVoxi?1:3} xl={showVoxi?1:3} style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
                    <GetIcon channelType={conversation.channeltype} width={40} height={40} color='#8F92A1' />
                </Grid>

                {(showVoxi) &&
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <Tooltip title={t(langKeys.download_record) || ""}>
                            <IconButton size="small" onClick={() => downloadCallRecord(conversation)} style={{ paddingTop: 15, paddingLeft: 20 }}
                            >
                                <CallRecordIcon style={{ fill: '#7721AD' }} />
                            </IconButton>
                        </Tooltip>

                    </Grid>}
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property subtitle={conversation.ticketnum} isLink={true} onClick={() => openDialogInteractions(conversation)} />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        subtitle={conversation.asesorfinal}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        subtitle={new Date(conversation.fechainicio).toLocaleString()}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <Property
                        subtitle={conversation.fechafin && new Date(conversation.fechafin).toLocaleString()}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                    <div className={classes.icon}>
                        <IconButton size="medium" onClick={() => setOpen(!open)}>
                            <ArrowDropDown />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <Collapse in={open}>
                <div className={classes.collapseContainer}>
                    <h3><Trans i18nKey={langKeys.ticketInformation} /></h3>
                    <Grid container direction="column">
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            TMO
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.tmo}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.status} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.status}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.tmeAgent} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.tme}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.closetype} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.closetype}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.tmrAgent} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.tmr}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.initialAgent} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.asesorinicial}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row">
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            {/* <Trans i18nKey={langKeys.avgResponseTimeOfClient} /> */}
                                            <Trans i18nKey={langKeys.tmrClient} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.tiempopromediorespuestapersona}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className={classes.containerstyle}>
                                <Grid container direction="row">
                                    <Grid item xs={12} sm={6} md={6} lg={3} xl={2}>
                                        <span className={classes.infoLabel}>
                                            <Trans i18nKey={langKeys.finalAgent} />
                                        </span>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={9} xl={10}>
                                        <span>{conversation.asesorfinal}</span>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Collapse>
        </div>
    );
}

export default ConversationItem;