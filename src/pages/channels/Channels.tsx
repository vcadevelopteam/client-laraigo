import React, { FC, useEffect, useState } from "react";
import { checkPaymentPlan, deleteChannel } from "store/channel/actions";
import { Dictionary, IChannel } from "@types";

import { getChannelSel } from "common/helpers/requestBodies";
import { getCollection, resetAllMain } from "store/main/actions";
import { langKeys } from "lang/keys";
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import { TemplateIcons } from "components";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelector } from "hooks";
import { useTranslation } from "react-i18next";

import paths from "common/constants/paths";
import TableZyx from "components/fields/table-simple";
import SettingsIcon from '@material-ui/icons/Settings';

export const Channels: FC = () => {
    const { t } = useTranslation();

    const [canRegister, setCanRegister] = useState(false);
    const [waitCheck, setWaitCheck] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const dispatch = useDispatch();
    const executeResult = useSelector((state) => state.channel.channelList);
    const fetchData = () => dispatch(getCollection(getChannelSel(0)));
    const history = useHistory();
    const mainResult = useSelector((state) => state.main);
    const paymentPlanResult = useSelector((state) => state.channel.checkPaymentPlan);
    const user = useSelector((state) => state.login.validateToken.user);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
                fetchData();
            } else if (executeResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(executeResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.property).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(
                deleteChannel({
                    method: "UFN_COMMUNICATIONCHANNEL_INS",
                    parameters: {
                        ...row,
                        description: row.communicationchanneldesc,
                        id: row.communicationchannelid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                        voximplantcallsupervision: false,
                    },
                })
            );
            dispatch(showBackdrop(true));
            setWaitSave(true);
        };

        dispatch(
            manageConfirmation({
                callback,
                question: t(langKeys.confirmation_delete),
                visible: true,
            })
        );
    };

    const handleEdit = (row: IChannel) => {
        if (row.status === "INACTIVO") {
            let pathname;

            if (row.type === "ANDR") {
                pathname = paths.CHANNELS_EDIT_ANDROID.resolve(row.communicationchannelid);
            }

            if (row.type === "APPL") {
                pathname = paths.CHANNELS_EDIT_IOS.resolve(row.communicationchannelid);
            }

            if (row.type === "APPS") {
                pathname = paths.CHANNELS_EDIT_APPSTORE.resolve(row.communicationchannelid);
            }

            if (row.type === "BLOG") {
                pathname = paths.CHANNELS_EDIT_BLOGGER.resolve(row.communicationchannelid);
            }

            if (row.type === "GOBU") {
                pathname = paths.CHANNELS_EDIT_BUSINESS.resolve(row.communicationchannelid);
            }

            if (row.type === "CHAZ") {
                pathname = paths.CHANNELS_EDIT_CHATWEB.resolve(row.communicationchannelid);
            }

            if (row.type === "MAIL") {
                pathname = paths.CHANNELS_EDIT_EMAIL.resolve(row.communicationchannelid);
            }

            if (row.type === "FBWA") {
                pathname = paths.CHANNELS_EDIT_FACEBOOK.resolve(row.communicationchannelid);
            }

            if (row.type === "INST") {
                pathname = paths.CHANNELS_EDIT_INSTAGRAM.resolve(row.communicationchannelid);
            }

            if (row.type === "INDM") {
                pathname = paths.CHANNELS_EDIT_INSTAGRAMDM.resolve(row.communicationchannelid);
            }

            if (row.type === "LNKD") {
                pathname = paths.CHANNELS_EDIT_LINKEDIN.resolve(row.communicationchannelid);
            }

            if (row.type === "FBDM") {
                pathname = paths.CHANNELS_EDIT_MESSENGER.resolve(row.communicationchannelid);
            }

            if (row.type === "FBLD") {
                pathname = paths.CHANNELS_EDIT_FACEBOOK_LEAD.resolve(row.communicationchannelid);
            }

            if (row.type === "PLAY") {
                pathname = paths.CHANNELS_EDIT_PLAYSTORE.resolve(row.communicationchannelid);
            }

            if (row.type === "SMSI") {
                pathname = paths.CHANNELS_EDIT_SMS.resolve(row.communicationchannelid);
            }

            if (row.type === "TEAM") {
                pathname = paths.CHANNELS_EDIT_TEAMS.resolve(row.communicationchannelid);
            }

            if (row.type === "TELE") {
                pathname = paths.CHANNELS_EDIT_TELEGRAM.resolve(row.communicationchannelid);
            }

            if (row.type === "TKTT") {
                pathname = paths.CHANNELS_EDIT_TIKTOK.resolve(row.communicationchannelid);
            }

            if (row.type === "TWIT") {
                pathname = paths.CHANNELS_EDIT_TWITTER.resolve(row.communicationchannelid);
            }

            if (row.type === "TWDM") {
                pathname = paths.CHANNELS_EDIT_TWITTERDM.resolve(row.communicationchannelid);
            }

            if (row.type === "VOXI") {
                pathname = paths.CHANNELS_EDIT_PHONE.resolve(row.communicationchannelid);
            }

            if (row.type === "FORM") {
                pathname = paths.CHANNELS_EDIT_WEBFORM.resolve(row.communicationchannelid);
            }

            if (row.type === "WHAT") {
                pathname = paths.CHANNELS_EDIT_WHATSAPP.resolve(row.communicationchannelid);
            }

            if (row.type === "WHAD") {
                pathname = paths.CHANNELS_EDIT_WHATSAPPONBOARDING.resolve(row.communicationchannelid);
            }

            if (row.type === "FBWM") {
                pathname = paths.CHANNELS_EDIT_FACEBOOKWORKPLACE.resolve(row.communicationchannelid);
            }

            if (row.type === "FBWP") {
                pathname = paths.CHANNELS_EDIT_FACEBOOKDM.resolve(row.communicationchannelid);
            }

            if (row.type === "YOUT") {
                pathname = paths.CHANNELS_EDIT_YOUTUBE.resolve(row.communicationchannelid);
            }

            if (pathname) {
                history.push({
                    pathname,
                    state: {
                        row,
                    },
                });
            }
        } else {
            let pathname = paths.CHANNELS_EDIT.resolve(row.communicationchannelid);

            if (row.type === "CHAZ") {
                pathname = paths.CHANNELS_EDIT_CHATWEB.resolve(row.communicationchannelid);
            }

            if (row.type === "FORM") {
                pathname = paths.CHANNELS_EDIT_WEBFORM.resolve(row.communicationchannelid);
            }

            history.push({
                pathname,
                state: row,
            });
        }
    };

    const checkLimit = () => {
        dispatch(
            checkPaymentPlan({
                method: "UFN_COMMUNICATIONCHANNEL_PAYMENTPLAN_CHECK",
                parameters: {
                    corpid: user?.corpid ?? 0,
                    orgid: user?.orgid ?? 0,
                },
            })
        );
        setWaitCheck(true);
    };

    const columns = React.useMemo(
        () => [
            {
                accessor: "communicationchannelid",
                isComponent: true,
                minWidth: 60,
                NoFilter: true,
                width: "1%",
                Cell: (props: { cell: { row: { original: IChannel } } }) => {
                    const row = props.cell.row.original || {}; 
                    return (
                        <TemplateIcons deleteFunction={() => handleDelete(row)} editFunction={() => handleEdit(row)} />
                    );
                },
            },
            {
                accessor: "corpdesc",
                Header: t(langKeys.corporation),
                NoFilter: true,
            },
            {
                accessor: "orgdesc",
                Header: t(langKeys.organization),
                NoFilter: true,
            },
            {
                accessor: "typedesc",
                Header: t(langKeys.communicationchannel),
                NoFilter: true,
            },
            {
                NoFilter: true,
                Header: t(langKeys.communicationchanneldesc),
                accessor: "communicationchanneldesc",
            },
            {
                accessor: "status",
                Header: t(langKeys.status),
                NoFilter: true,
                prefixTranslation: "status_",
                Cell: (props: { cell: { row: { original: IChannel } } }) => {
                    const row = props.cell.row.original || {}; 
                    return <span>{(t(`status_${row.status}`.toLowerCase()) || "").toUpperCase()}</span>;
                },
            },
            {
                Header: "",
                accessor: 'haveflow',
                NoFilter: true,
                isComponent: true,
                Cell: (props: { cell: { row: { original: { haveflow: boolean; }; }; }; }) => {
                    const { haveflow } = props.cell.row.original || {}; 
                    if (haveflow) {
                        return <div></div>
                    } else {
                        return <div style={{ display: "flex", alignItems: "center", color: "#7721ad", fontWeight: "bold" }}><SettingsIcon />{t(langKeys.configure)}</div>
                    }
                }
            },
        ],
        []
    );

    useEffect(() => {
        fetchData();

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitCheck) {
            if (!paymentPlanResult.loading && !paymentPlanResult.error) {
                if (paymentPlanResult.value) {
                    setCanRegister(paymentPlanResult.value.createChannel);

                    if (!paymentPlanResult.value.createChannel) {
                        dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.channellimit) }));
                        dispatch(showBackdrop(false));
                        setWaitCheck(false);
                    }
                }
            } else if (paymentPlanResult.error) {
                dispatch(
                    showSnackbar({
                        severity: "error",
                        show: true,
                        message: t(paymentPlanResult.code ?? "error_unexpected_error", {
                            module: t(langKeys.property).toLocaleLowerCase(),
                        }),
                    })
                );
                dispatch(showBackdrop(false));
                setWaitCheck(false);
            }
        }
    }, [paymentPlanResult, waitCheck]);

    useEffect(() => {
        if (canRegister) {
            setCanRegister(false);

            history.push(paths.CHANNELS_ADD, {
                row: null,
                typeWhatsApp: "NONE",
            });
        }
    }, [canRegister]);

    return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", flex: 1 }}>
            <TableZyx
                columns={columns}
                data={mainResult.mainData.data}
                download={true}
                handleRegister={() => checkLimit()}
                hoverShadow={true}
                loading={mainResult.mainData.loading}
                onClickRow={handleEdit}
                register={true}
                titlemodule={t(langKeys.channel_plural, { count: 2 })}
            />
        </div>
    );
};

export default Channels;