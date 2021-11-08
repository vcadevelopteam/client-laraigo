import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { showSnackbar } from 'store/popus/actions';
import { editChannel, resetEditChannel } from 'store/channel/actions';
import { getEditChannel } from 'common/helpers';
import { useHistory, useLocation } from 'react-router';
import { IChannel } from '@types';
import paths from 'common/constants/paths';
import { Box, Breadcrumbs, Button, Link, makeStyles } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { ColorInput, FieldEdit } from 'components';

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
    const classes = useFinalStepStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const [enable, setenable] = useState(false);
    const edit = useSelector(state => state.channel.editChannel);

    const [name, setName] = useState("");
    const [auto, setAuto] = useState(false);
    const [hexIconColor, setHexIconColor] = useState("");

    const channel = location.state as IChannel | null;

    useEffect(() => {
        console.log(channel);
        if (!channel) {
            history.push(paths.CHANNELS);
        } else {
            setName(channel.communicationchanneldesc);
            setAuto(true);
            setenable(true);
            channel.coloricon && setHexIconColor(channel.coloricon);
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
                success: false,
            }));
        } else if (edit.success) {
            dispatch(showSnackbar({
                message: "Se edito con exito",
                show: true,
                success: true,
            }));
            history.push(paths.CHANNELS);
        }
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
        console.log(enable);
        return <div />;
    }

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="textSecondary" key="mainview" href="/" onClick={handleGoBack}>
                    {"<< Previous"}
                </Link>
            </Breadcrumbs>
            <div>
                <div className={classes.title}>
                    Edita el canal de comunicación
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
