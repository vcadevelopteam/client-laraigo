/* eslint-disable react-hooks/exhaustive-deps */
import TableZyx from 'components/fields/table-simple';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import ClearIcon from '@material-ui/icons/Clear';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { FC, useEffect, useState } from 'react';
import { langKeys } from 'lang/keys';
import { useTranslation } from 'react-i18next';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { Dictionary, IChannel } from '@types';
import Button from '@material-ui/core/Button';
import React from 'react';
import { TemplateBreadcrumbs, TemplateIcons } from 'components';
import { getCollection, resetAllMain } from 'store/main/actions';
import { getChannelSel } from 'common/helpers/requestBodies';
import { checkPaymentPlan, deleteChannel } from 'store/channel/actions';

export const Channels: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const paymentPlanResult = useSelector(state => state.channel.checkPaymentPlan);
    const executeResult = useSelector(state => state.channel.channelList);
    const mainResult = useSelector(state => state.main);
    const user = useSelector(state => state.login.validateToken.user);

    const roledesc = user?.roledesc || "";

    const [typeWhatsApp, setTypeWhatsApp] = useState('DIALOG');
    const [canRegister, setCanRegister] = useState(false);
    const [waitCheck, setWaitCheck] = useState(false);
    const [waitSave, setWaitSave] = useState(false);
    const history = useHistory();
    const arrayBread = [
        { id: "view-0", name: t(langKeys.configuration_plural) },
        { id: "view-1", name: t(langKeys.channel_plural) },
    ];
    function redirectFunc(view: string) {
        if (view === "view-0") {
            history.push(paths.CONFIGURATION)
            return;
        }
    }

    const fetchData = () => dispatch(getCollection(getChannelSel(0)));

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();

                dispatch(showBackdrop(false));
                setWaitSave(false);
                //dispatch(getCollection(getChannelSel(0)));
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(deleteChannel({
                method: "UFN_COMMUNICATIONCHANNEL_INS",
                parameters: {
                    ...row, id: row.communicationchannelid, description: row.communicationchanneldesc, operation: 'DELETE', status: 'ELIMINADO', voximplantcallsupervision: false
                }
            }));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleEdit = (row: IChannel) => {
        if (row.type === 'WHAT' && row.status === 'PENDIENTE' && roledesc === "SUPERADMIN") {
            var whatsAppData = {
                typeWhatsApp: 'SMOOCH',
                row: row
            }
            history.push({ pathname: paths.CHANNELS_EDIT_WHATSAPP.resolve(row.communicationchannelid), state: whatsAppData });
        }
        else {
            let pathname = paths.CHANNELS_EDIT.resolve(row.communicationchannelid);
            if(row.type === "CHAZ") pathname =  paths.CHANNELS_EDIT_CHATWEB.resolve(row.communicationchannelid);
            if(row.type === "FORM")pathname =  paths.CHANNELS_EDIT_WEBFORM.resolve(row.communicationchannelid);

            history.push({
                pathname,
                state: row,
            });
        }
    }

    const checkLimit = () => {
        dispatch(checkPaymentPlan({
            method: "UFN_COMMUNICATIONCHANNEL_PAYMENTPLAN_CHECK",
            parameters: {
                corpid: (user?.corpid || 0),
                orgid: (user?.orgid || 0),
            }
        }));
        setWaitCheck(true);
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'communicationchannelid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            viewFunction={() => { }}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.corporation),
                accessor: 'corpdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.organization),
                accessor: 'orgdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.communicationchannel),
                accessor: 'typedesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.communicationchanneldesc),
                accessor: 'communicationchanneldesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
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
                    setTypeWhatsApp(paymentPlanResult.value.providerWhatsApp);
                    setCanRegister(paymentPlanResult.value.createChannel);
                    if (!paymentPlanResult.value.createChannel) {
                        dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.channellimit) }))
                        dispatch(showBackdrop(false));
                        setWaitCheck(false);
                    }
                }
            } else if (paymentPlanResult.error) {
                const errormessage = t(paymentPlanResult.code || "error_unexpected_error", { module: t(langKeys.property).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitCheck(false);
            }
        }
    }, [paymentPlanResult, waitCheck]);

    useEffect(() => {
        if (canRegister) {
            setCanRegister(false);

            var restrictionInformation = {
                typeWhatsApp: typeWhatsApp,
                row: null
            }

            history.push(paths.CHANNELS_ADD, restrictionInformation);
        }
    }, [canRegister]);

    return (
        <div style={{ width: "100%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TemplateBreadcrumbs
                    breadcrumbs={arrayBread}
                    handleClick={redirectFunc}
                />
            </div>
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.channel_plural, { count: 2 })}
                ButtonsElement={() => (
                    <Button
                        disabled={mainResult.mainData.loading}
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => history.push(paths.CONFIGURATION)}
                    >{t(langKeys.back)}</Button>
                )}
                data={mainResult.mainData.data}
                download={true}
                onClickRow={handleEdit}
                loading={mainResult.mainData.loading}
                register={true}
                hoverShadow={true}
                handleRegister={() => checkLimit()}
            />
        </div>
    );
};

export default Channels