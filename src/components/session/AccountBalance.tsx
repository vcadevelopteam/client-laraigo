import React, { FC, useState, useEffect } from "react";
import { createStyles, IconButton, makeStyles, Paper } from "@material-ui/core";
import { Trans } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from 'hooks';
import { emitEvent, connectAgentUI, connectAgentAPI } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { DialogZyx, FieldSelect, FieldEditMulti } from 'components';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import { manageStatusVox } from "store/voximplant/actions";
import { useHistory } from "react-router-dom";
import paths from "common/constants/paths";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            backgroundColor: '#F9F9FA', padding: '10px 12px', display: 'flex', height: 42
        },
        connectionText: {
            fontSize: 14,
        },
    }),
);

const DialogReasonsDisconnection: React.FC<{
    setOpenModal: (param: any) => void;
    openModal: boolean;
}> = ({ setOpenModal, openModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const userConnected = useSelector(state => state.inbox.userConnected);
    const domains = useSelector(state => state.login.validateToken.user?.domains);
    const voxiConnection = useSelector(state => state.voximplant.connection);

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (openModal) {
            reset({
                motive: '',
                observation: ''
            })
            register('motive', { validate: (value) => ((value && value.length) || t(langKeys.field_required)) });
            register('observation');
        }
    }, [openModal, register, reset, t])

    const onSubmit = handleSubmit((data) => {
        dispatch(connectAgentAPI(!userConnected, data.observation, data.motive));
        dispatch(connectAgentUI(!userConnected));
        if (!voxiConnection.error) {
            dispatch(manageStatusVox(!userConnected));
        }
        dispatch(emitEvent({
            event: 'connectAgent',
            data: {
                isconnected: !userConnected,
                motive: data.motive,
                userid: 0,
                orgid: 0
            }
        }));
        setOpenModal(false);
    });

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.reasons_disconnection)}
            buttonText1={t(langKeys.cancel)}
            buttonText2={t(langKeys.save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={onSubmit}
            button2Type="submit"
        >
            <div className="row-zyx">
                <FieldSelect
                    label={t(langKeys.ticket_reason)}
                    className="col-12"
                    valueDefault={getValues('motive')}
                    onChange={(value) => setValue('motive', value ? value.domainvalue : '')}
                    error={errors?.motive?.message}
                    data={domains?.reasons_disconnection || []}
                    optionDesc="domaindesc"
                    optionValue="domainvalue"
                />
                <FieldEditMulti
                    label={t(langKeys.observation)}
                    valueDefault={getValues('observation')}
                    className="col-12"
                    onChange={(value) => setValue('observation', value)}
                    maxLength={1024}
                />
            </div>
        </DialogZyx>)
}

const AccountBalance: FC = () => {
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const history = useHistory();
    const user = useSelector(state => state.login.validateToken.user);

    return (
        <>
            <DialogReasonsDisconnection
                openModal={openDialog}
                setOpenModal={setOpenDialog}
            />
            {(user?.balance?.showBalance) && <>
                <Paper elevation={0} className={classes.root}>
                    <label className={classes.connectionText}><Trans>{langKeys.recharge1}</Trans></label>
                    <div style={{ width: 6 }} />
                    <div style={{ color: (user?.balance?.balanceNotificationEnabled && ((user?.balance?.balanceCurrent || 0) <= (user?.balance?.balanceNotificationMinimum || 0))) ? "red" : "black", fontWeight: (user?.balance?.balanceNotificationEnabled && ((user?.balance?.balanceCurrent || 0) <= (user?.balance?.balanceNotificationMinimum || 0))) ? "bold" : "normal", border: "solid grey 1px", padding: "0 15px", marginLeft: 5, borderRadius: 10, paddingRight: 3 }}>${(user?.balance?.balanceCurrent || 0).toFixed(4)}
                        <IconButton
                            aria-label="recharge"
                            style={{
                                margin: 0,
                                padding: 0,
                                paddingLeft: 5,
                            }}
                            onClick={() => {
                                history.push(paths.INVOICE + "?recharge=true");
                            }}>
                            <ControlPointIcon color="primary" style={{ height: 20, width: 20 }} />
                        </IconButton>
                    </div>
                </Paper>
            </>}
        </>
    );
};

export default AccountBalance;
