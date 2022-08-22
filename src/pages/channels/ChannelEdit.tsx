import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { showSnackbar } from 'store/popus/actions';
import { editChannel, resetEditChannel } from 'store/channel/actions';
import { getEditChannel } from 'common/helpers';
import { useHistory, useLocation } from 'react-router';
import { IChannel } from '@types';
import { Box, Breadcrumbs, Button, Link, makeStyles } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { ColorInput, FieldEdit, FieldView } from 'components';
import { formatNumber } from 'common/helpers';

import paths from 'common/constants/paths';

const useFinalStepStyles = makeStyles(theme => ({
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "2em",
        color: "#7721ad",
        padding: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "800px",
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        width: "180px"
    },
}));

const ChannelEdit: FC = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const classes = useFinalStepStyles();
    const edit = useSelector(state => state.channel.editChannel);
    const history = useHistory();
    const location = useLocation();
    const channel = location.state as IChannel | null;

    const [name, setName] = useState("");
    const [auto, setAuto] = useState(false);
    const [hexIconColor, setHexIconColor] = useState("");
    const [serviceCredentials, setServiceCredentials] = useState<any>({});

    useEffect(() => {
        if (!channel) {
            history.push(paths.CHANNELS);
        } else {
            setName(channel.communicationchanneldesc);
            setAuto(true);
            channel.coloricon && setHexIconColor(channel.coloricon);
            if (channel.servicecredentials) {
                setServiceCredentials(JSON.parse(channel.servicecredentials));
            }
        }

        return () => {
            dispatch(resetEditChannel());
        };
    }, [history, channel, dispatch]);

    useEffect(() => {
        if (edit.loading) return;
        if (edit.error === true) {
            dispatch(showSnackbar({
                message: edit.message!,
                show: true,
                severity: "error"
            }));
        } else if (edit.success) {
            dispatch(showSnackbar({
                message: t(langKeys.communicationchannel_editsuccess),
                show: true,
                severity: "success"
            }));
            history.push(paths.CHANNELS);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [edit, history, dispatch]);

    const handleSubmit = useCallback(() => {
        if (!channel) return;
        const id = channel!.communicationchannelid;
        const body = getEditChannel(id, channel, name, auto, hexIconColor);
        dispatch(editChannel(body));
    }, [name, hexIconColor, auto, channel, dispatch]);

    const handleGoBack = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        history.push(paths.CHANNELS);
    }, [history]);

    if (!channel) {
        return <div />;
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                    {t(langKeys.previoustext)}
                </Link>
            </Breadcrumbs>
            <div>
                <div className={classes.title}>
                    {t(langKeys.communicationchannel_edit)}
                </div>
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <FieldEdit
                        onChange={(value) => setName(value)}
                        label={t(langKeys.givechannelname)}
                        className="col-6"
                        disabled={edit.loading}
                        valueDefault={channel!.communicationchanneldesc}
                    />
                </div>
                {channel?.phone && <>
                    <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldView
                            label={t(langKeys.phone)}
                            className="col-6"
                            value={channel!.phone}
                        />
                    </div>
                </>}
                {channel?.type === "VOXI" && <>
                    {serviceCredentials?.countryname && <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldView
                            label={t(langKeys.country)}
                            className="col-6"
                            value={serviceCredentials?.countryname}
                        />
                    </div>}
                    {serviceCredentials?.categoryname && <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldView
                            label={t(langKeys.category)}
                            className="col-6"
                            value={t(serviceCredentials?.categoryname)}
                        />
                    </div>}
                    {serviceCredentials?.statename && <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldView
                            label={t(langKeys.voximplant_state)}
                            className="col-6"
                            value={serviceCredentials?.statename}
                        />
                    </div>}
                    {serviceCredentials?.regionname && <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldView
                            label={t(langKeys.voximplant_region)}
                            className="col-6"
                            value={serviceCredentials?.regionname}
                        />
                    </div>}
                    {serviceCredentials?.costvca && <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldView
                            label={t(langKeys.voximplant_pricealert)}
                            className="col-6"
                            value={`$${formatNumber(parseFloat(serviceCredentials?.costvca || 0))}`}
                        />
                    </div>}
                </>}
                {(channel?.type === "FBDM" || channel?.type === "FBWA") && <>
                    {serviceCredentials?.siteId && <div className="row-zyx">
                        <div className="col-3"></div>
                        <FieldView
                            label={t(langKeys.url)}
                            className="col-6"
                            value={`https://www.facebook.com/${serviceCredentials?.siteId}`}
                        />
                    </div>}
                </>}
                <div className="row-zyx">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                            {t(langKeys.givechannelcolor)}
                        </Box>
                        <ColorInput hex={hexIconColor} onChange={e => setHexIconColor(e.hex)} />
                    </div>
                </div>
                <div style={{ paddingLeft: "80%" }}>
                    <Button
                        onClick={handleSubmit}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={edit.loading}
                    >
                        <Trans i18nKey={langKeys.finishreg} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChannelEdit;
