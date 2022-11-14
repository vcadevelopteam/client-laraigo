/* eslint-disable react-hooks/exhaustive-deps */
import Checkbox from '@material-ui/core/Checkbox';
import DateFnsUtils from '@date-io/date-fns';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { FC, Fragment, useEffect, useState } from "react";

import { AccountCircle, CameraAlt, ChatBubble, Delete, Edit, Facebook, Instagram, LinkedIn, MusicNote, PlayCircleOutlineSharp, Replay, Reply, Save, Send, ThumbUp, Timelapse, Twitter, YouTube } from '@material-ui/icons';
import { AntTab, DialogZyx, FieldEdit, FieldEditAdvanced, FieldSelect, FieldView } from 'components';
import { Button, Tabs } from "@material-ui/core";
import { dataActivities, dataFeelings } from 'common/helpers';
import { Dictionary } from '@types';
import { FacebookColor, InstagramColor, LinkedInColor, TikTokColor, TwitterColor, YouTubeColor } from "icons";
import { getCollection, resetAllMain } from 'store/main/actions';
import { getCommChannelLst } from 'common/helpers';
import { getLocaleDateString, localesLaraigo } from 'common/helpers';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';
import { useSelector } from 'hooks';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    button: {
        fontSize: '14px',
        fontWeight: 500,
        marginLeft: '4px',
        marginRight: '4px',
        padding: 12,
        textTransform: 'initial',
        width: 'auto',
    },
    containerLeft: {
        [theme.breakpoints.down('xs')]: {
            minWidth: '100vw',
            height: '100vh',
        },
        border: '1px solid #762AA9',
        borderRadius: '4px',
        flex: 1,
        margin: 4,
        marginBottom: '28px',
        overflowY: 'auto',
    },
    root: {
        backgroundColor: 'white',
        flex: 1,
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: 16,
        width: '100%',
    },
}));

export const PostCreatorPublish: FC = () => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const mainResult = useSelector(state => state.main.mainData);

    const [dataChannel, setDataChannel] = useState<Dictionary[]>([]);
    const [pageMode, setPageMode] = useState('TEXT');
    const [pageSelected, setPageSelected] = useState(0);
    const [waitLoad, setWaitLoad] = useState(false);

    const fetchData = () => {
        dispatch(getCollection(getCommChannelLst()));
        dispatch(showBackdrop(true));
        setWaitLoad(true);
    };

    useEffect(() => {
        fetchData();

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitLoad) {
            if (!mainResult.loading && !mainResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setWaitLoad(false);

                setDataChannel(mainResult.data || []);
            } else if (mainResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(mainResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitLoad(false);
            }
        }
    }, [mainResult, waitLoad])

    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
                <Tabs
                    indicatorColor="primary"
                    onChange={(_, value) => {
                        setPageSelected(value);
                        if (value === 0) {
                            setPageMode('TEXT');
                        }
                        if (value === 1) {
                            setPageMode('IMAGE');
                        }
                        if (value === 2) {
                            setPageMode('VIDEO');
                        }
                    }}
                    style={{ border: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    value={pageSelected}
                    variant="fullWidth"
                >
                    <AntTab label={t(langKeys.postcreator_publish_text)} />
                    <AntTab label={t(langKeys.postcreator_publish_textimage)} />
                    <AntTab label={t(langKeys.postcreator_publish_textvideo)} />
                </Tabs>
                <div style={{ marginTop: 4 }}>
                    <PublishPostGeneric dataChannel={dataChannel} dataRow={null} pageMode={pageMode} />
                </div>
            </div>
        </React.Fragment>
    )
}

const PublishPostGeneric: React.FC<{ dataChannel: Dictionary[], dataRow: any, pageMode: string }> = ({ dataChannel, dataRow, pageMode }) => {
    const classes = useStyles();

    const { t } = useTranslation();

    const [allowedChannel, setAllowedChannel] = useState<Dictionary[]>([]);
    const [customizeType, setCustomizeType] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [previewType, setPreviewType] = useState('FACEBOOKPREVIEW');
    const [showFacebook, setShowFacebook] = useState(false);
    const [showInstagram, setShowInstagram] = useState(false);
    const [showLinkedIn, setShowLinkedIn] = useState(false);
    const [showTikTok, setShowTikTok] = useState(false);
    const [showTwitter, setShowTwitter] = useState(false);
    const [showYouTube, setShowYouTube] = useState(false);

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({
        defaultValues: {
            activity: dataRow?.activity || '',
            channeldata: dataRow?.channeldata || [],
            mediadata: dataRow?.mediadata || [],
            mediatype: dataRow?.mediatype || pageMode,
            sentiment: dataRow?.sentiment || '',
            textbody: dataRow?.textbody || '',
            textcustomfacebook: dataRow?.textcustomfacebook || '',
            textcustominstagram: dataRow?.textcustominstagram || '',
            textcustomlinkedin: dataRow?.textcustomlinkedin || '',
            textcustomtiktok: dataRow?.textcustomtiktok || '',
            textcustomtwitter: dataRow?.textcustomtwitter || '',
            textcustomyoutube: dataRow?.textcustomyoutube || '',
            texttitle: dataRow?.texttitle || '',
        }
    });

    React.useEffect(() => {
        register('activity');
        register('channeldata');
        register('mediadata');
        register('mediatype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('sentiment');
        register('textbody', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('textcustomfacebook');
        register('textcustominstagram');
        register('textcustomlinkedin');
        register('textcustomtiktok');
        register('textcustomtwitter');
        register('textcustomyoutube');
        register('texttitle', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    useEffect(() => {
        setValue('channeldata', []);
        setAllowedChannel([]);

        if (pageMode === "TEXT") {
            if (dataChannel.length > 0) {
                var filterData = dataChannel.filter(channel => channel.type === 'FBWA' || channel.type === 'TWIT' || channel.type === 'LNKD')?.sort((a, b) => a.type - b.type);
                setAllowedChannel(filterData.map(channel => ({ ...channel, checked: false })));
                setShowFacebook(true);
                setShowInstagram(false);
                setShowLinkedIn(true);
                setShowTikTok(false);
                setShowTwitter(true);
                setShowYouTube(false);
            }
        }
        if (pageMode === "IMAGE") {
            if (dataChannel.length > 0) {
                var filterData = dataChannel.filter(channel => channel.type === 'FBWA' || channel.type === 'TWIT' || channel.type === 'LNKD' || channel.type === 'INST')?.sort((a, b) => a.type - b.type);
                setAllowedChannel(filterData.map(channel => ({ ...channel, checked: false })));
                setShowFacebook(true);
                setShowInstagram(true);
                setShowLinkedIn(true);
                setShowTikTok(false);
                setShowTwitter(true);
                setShowYouTube(false);
            }
        }
        if (pageMode === "VIDEO") {
            if (dataChannel.length > 0) {
                var filterData = dataChannel.filter(channel => channel.type === 'FBWA' || channel.type === 'TWIT' || channel.type === 'LNKD' || channel.type === 'INST' || channel.type === 'TKTK' || channel.type === 'YOUT')?.sort((a, b) => a.type - b.type);
                setAllowedChannel(filterData.map(channel => ({ ...channel, checked: false })));
                setShowFacebook(true);
                setShowInstagram(true);
                setShowLinkedIn(true);
                setShowTikTok(true);
                setShowTwitter(true);
                setShowYouTube(true);
            }
        }
    }, [dataChannel, pageMode])

    return (
        <div style={{ width: '100%' }}>
            <SavePostModalGeneric
                data={null}
                openModal={openModal}
                setOpenModal={setOpenModal}
                onTrigger={() => { }}
            />
            <Fragment>
                <div style={{ display: "flex", flexDirection: 'row', height: '100%', overflow: 'overlay', flexWrap: 'wrap' }}>
                    <div className={classes.containerLeft}>
                        <div className={classes.root}>
                            <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.postcreator_publish_pages)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>
                            <div className="row-zyx">
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {allowedChannel?.map(function (channel) {
                                        return <div style={{ width: '100%', flex: '50%' }}>
                                            <FormControlLabel
                                                control={(
                                                    <Checkbox
                                                        checked={getValues('channeldata').filter((filtered: any) => filtered.communicationchannelid === channel.communicationchannelid).length > 0}
                                                        color="primary"
                                                        onChange={(e) => {
                                                            if (channel.communicationchannelid) {
                                                                let channelClean = getValues('channeldata');
                                                                channelClean = channelClean.filter((filtered: any) => filtered.communicationchannelid !== channel.communicationchannelid);
                                                                setValue('channeldata', channelClean);

                                                                if (e.target.checked) {
                                                                    let channelAdd = getValues('channeldata');
                                                                    channelAdd.push(channel);
                                                                    setValue('channeldata', channelAdd);
                                                                }
                                                            }

                                                            trigger('channeldata');
                                                        }}
                                                        name={channel.communicationchannelid} />
                                                )}
                                                label={
                                                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                                        {channel.type === 'FBWA' && <FacebookColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                        {channel.type === 'INST' && <InstagramColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                        {channel.type === 'LNKD' && <LinkedInColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                        {channel.type === 'TKTK' && <TikTokColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                        {channel.type === 'TWIT' && <TwitterColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                        {channel.type === 'YOUT' && <YouTubeColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                        <span>{channel.communicationchanneldesc}</span>
                                                    </div>
                                                }
                                            />

                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '0px', paddingLeft: '6px' }}>
                                <FieldEdit
                                    className="col-12"
                                    error={errors?.texttitle?.message}
                                    label={t(langKeys.title)}
                                    onChange={(value) => setValue('texttitle', value)}
                                    valueDefault={getValues('texttitle')}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '0px', height: '10px', paddingLeft: '2px' }}>
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    value={t(langKeys.text)}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                <FieldEditAdvanced
                                    className="col-12"
                                    disabled={false}
                                    emoji={true}
                                    error={errors?.textbody?.message}
                                    hashtag={true}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => {
                                        setValue('textbody', value);
                                        setValue('textcustomfacebook', value);
                                        setValue('textcustominstagram', value);
                                        setValue('textcustomlinkedin', value);
                                        setValue('textcustomtiktok', value);
                                        setValue('textcustomtwitter', value);
                                        setValue('textcustomyoutube', value);

                                        trigger('textcustomfacebook');
                                        trigger('textcustominstagram');
                                        trigger('textcustomlinkedin');
                                        trigger('textcustomtiktok');
                                        trigger('textcustomtwitter');
                                        trigger('textcustomyoutube');
                                    }}
                                    rows={(pageMode === 'TEXT' ? 12 : 6)}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    valueDefault={getValues('textbody')}
                                />
                            </div>
                            <div className="row-zyx" style={{ marginTop: '0px', marginLeft: '6px' }}>
                                <span>
                                    {t(langKeys.postcreator_publish_textrecommendation)}
                                </span>
                                <span>
                                    {t(langKeys.postcreator_publish_textrecommendation01)}
                                </span>
                            </div>
                            {pageMode === 'IMAGE' && <>
                                <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_image)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
                                <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ maxHeight: '60px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                Imagen.jpg<br />480 x 240
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ maxHeight: '60px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                Imagen.jpg<br />480 x 240
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ maxHeight: '60px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                Imagen.jpg<br />480 x 240
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Edit color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_edit)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Delete color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_delete)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<CameraAlt color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_addimage)}
                                    </Button>
                                </div>
                            </>}
                            {pageMode === 'VIDEO' && <>
                                <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_video)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
                                <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ maxHeight: '60px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                Video.mp4<br />480 x 240
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Edit color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_edit)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<Delete color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_delete)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<PlayCircleOutlineSharp color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    >{t(langKeys.postcreator_publish_addvideo)}
                                    </Button>
                                </div>
                            </>}
                        </div>
                    </div>
                    <div className={classes.containerLeft}>
                        <div className={classes.root}>
                            <div className="row-zyx" style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                {showFacebook && <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('Facebook') }}
                                    startIcon={<Facebook color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'Facebook'}
                                >{t(langKeys.postcreator_publish_facebook)}
                                </Button>}
                                {showInstagram && <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('Instagram') }}
                                    startIcon={<Instagram color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'Instagram'}
                                >{t(langKeys.postcreator_publish_instagram)}
                                </Button>}
                                {showLinkedIn && <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('LinkedIn') }}
                                    startIcon={<LinkedIn color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'LinkedIn'}
                                >{t(langKeys.postcreator_publish_linkedin)}
                                </Button>}
                                {showTikTok && <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('TikTok') }}
                                    startIcon={<MusicNote color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'TikTok'}
                                >{t(langKeys.postcreator_publish_tiktok)}
                                </Button>}
                                {showTwitter && <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('Twitter') }}
                                    startIcon={<Twitter color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'Twitter'}
                                >{t(langKeys.postcreator_publish_twitter)}
                                </Button>}
                                {showYouTube && <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setCustomizeType('YouTube') }}
                                    startIcon={<YouTube color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    disabled={customizeType === 'YouTube'}
                                >{t(langKeys.postcreator_publish_youtube)}
                                </Button>}
                            </div>
                            {customizeType !== "" && <div className="row-zyx" style={{ marginBottom: '0px', height: '10px' }}>
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.postcreator_publish_customizepost).replace('#CHANNELTYPE#', customizeType)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>}
                            {customizeType !== "" && <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                {customizeType === "Facebook" && <FieldEditAdvanced
                                    className="col-12"
                                    disabled={false}
                                    emoji={true}
                                    error={errors?.textcustomfacebook?.message}
                                    hashtag={true}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => setValue('textcustomfacebook', value)}
                                    rows={18}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    valueDefault={getValues('textcustomfacebook')}
                                />}
                                {customizeType === "Instagram" && <FieldEditAdvanced
                                    className="col-12"
                                    disabled={false}
                                    emoji={true}
                                    error={errors?.textcustominstagram?.message}
                                    hashtag={true}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => setValue('textcustominstagram', value)}
                                    rows={18}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    valueDefault={getValues('textcustominstagram')}
                                />}
                                {customizeType === "LinkedIn" && <FieldEditAdvanced
                                    className="col-12"
                                    disabled={false}
                                    emoji={true}
                                    error={errors?.textcustomlinkedin?.message}
                                    hashtag={true}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => setValue('textcustomlinkedin', value)}
                                    rows={18}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    valueDefault={getValues('textcustomlinkedin')}
                                />}
                                {customizeType === "TikTok" && <FieldEditAdvanced
                                    className="col-12"
                                    disabled={false}
                                    emoji={true}
                                    error={errors?.textcustomtiktok?.message}
                                    hashtag={true}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => setValue('textcustomtiktok', value)}
                                    rows={18}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    valueDefault={getValues('textcustomtiktok')}
                                />}
                                {customizeType === "Twitter" && <FieldEditAdvanced
                                    className="col-12"
                                    disabled={false}
                                    emoji={true}
                                    error={errors?.textcustomtwitter?.message}
                                    hashtag={true}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => setValue('textcustomtwitter', value)}
                                    rows={18}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    valueDefault={getValues('textcustomtwitter')}
                                />}
                                {customizeType === "YouTube" && <FieldEditAdvanced
                                    className="col-12"
                                    disabled={false}
                                    emoji={true}
                                    error={errors?.textcustomyoutube?.message}
                                    hashtag={true}
                                    label={''}
                                    maxLength={2200}
                                    onChange={(value) => setValue('textcustomyoutube', value)}
                                    rows={18}
                                    style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                    valueDefault={getValues('textcustomyoutube')}
                                />}
                            </div>}
                            {customizeType === 'Facebook' && <div className="row-zyx">
                                <FieldSelect
                                    data={dataActivities}
                                    error={errors?.activity?.message}
                                    label={t(langKeys.postcreator_publish_activity)}
                                    onChange={(value) => { setValue('activity', value?.value); }}
                                    optionDesc="description"
                                    optionValue="value"
                                    style={{ width: '100%', paddingLeft: '6px', paddingRight: '6px' }}
                                    valueDefault={getValues('activity')}
                                    variant="outlined"
                                    uset={true}
                                    prefixTranslation={'posthistory_'}
                                />
                            </div>}
                            {customizeType === 'Facebook' && <div className="row-zyx">
                                <FieldSelect
                                    data={dataFeelings}
                                    error={errors?.sentiment?.message}
                                    label={t(langKeys.postcreator_publish_sentiment)}
                                    onChange={(value) => { setValue('sentiment', value?.value); }}
                                    optionDesc="description"
                                    optionValue="value"
                                    style={{ width: '100%', paddingLeft: '6px', paddingRight: '6px' }}
                                    valueDefault={getValues('sentiment')}
                                    variant="outlined"
                                    uset={true}
                                    prefixTranslation={'posthistory_'}
                                />
                            </div>}
                        </div>
                    </div>
                    <div className={classes.containerLeft}>
                        <div className={classes.root} style={{ backgroundColor: '#EBEBEB' }}>
                            <div className="row-zyx">
                                <FieldSelect
                                    label={t(langKeys.postcreator_publish_previewmode)}
                                    style={{ width: '100%', backgroundColor: 'white' }}
                                    valueDefault={previewType}
                                    variant="outlined"
                                    onChange={(value) => { setPreviewType(value?.value) }}
                                    data={[
                                        {
                                            description: t(langKeys.postcreator_publish_mockupfacebook),
                                            value: "FACEBOOKPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockupinstagram),
                                            value: "INSTAGRAMPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockuptwitter),
                                            value: "TWITTERPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockuplinkedin),
                                            value: "LINKEDINPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockupyoutube),
                                            value: "YOUTUBEPREVIEW",
                                        },
                                        {
                                            description: t(langKeys.postcreator_publish_mockuptiktok),
                                            value: "TIKTOKPREVIEW",
                                        },
                                    ]}
                                    optionDesc="description"
                                    optionValue="value"
                                />
                            </div>
                            <div className="row-zyx">
                                <FieldView
                                    className="col-12"
                                    label={''}
                                    value={t(langKeys.postcreator_publish_preview)}
                                    styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                />
                            </div>
                            {previewType === 'FACEBOOKPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '18px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>{t(langKeys.postcreator_publish_facebookmockup_time)}<button
                                                    style={{ border: 'none', marginLeft: '4px', width: '20px', height: '20px', backgroundImage: 'url(https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/e08a19e1-7653-4cb2-9523-68fed2d48217/FacebookWorld.png)', backgroundSize: '20px 20px' }}
                                                >
                                                </button></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '10px' }}>
                                        <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                            <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</div>
                                        </div>
                                    </div>
                                    {(pageMode === 'IMAGE' || pageMode === 'VIDEO') && <div style={{ maxWidth: '100%' }}>
                                        <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '10px', marginTop: '6px' }}>
                                        <div style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ThumbUp style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_like)}</b></div>
                                        <div style={{ width: '34%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChatBubble style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_comment)}</b></div>
                                        <div style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Reply style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_share)}</b></div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'INSTAGRAMPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '18px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '36px', width: '36px', borderRadius: '50%', border: '2px solid #F43C9E', padding: '2px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <b>{t(langKeys.postcreator_publish_officialpage)}</b>
                                            </div>
                                        </div>
                                    </div>
                                    {(pageMode === 'IMAGE' || pageMode === 'VIDEO') && <div style={{ maxWidth: '100%' }}>
                                        <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <img alt="" style={{ maxWidth: '100%', margin: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/334a434c-c07c-4904-8c49-9e425c7b3f8d/InstagramButton1.png"></img>
                                        <img alt="" style={{ maxWidth: '100%', margin: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/9a5d369c-3ffc-4f2e-84e9-bb10a4072a16/InstagramButton2.png"></img>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px', paddingLeft: '5px', paddingRight: '10px', paddingTop: '6px' }}>
                                        <div style={{ height: '100%', paddingLeft: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                            <div style={{ width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'TWITTERPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', flexBasis: 'auto', flexShrink: 0, margin: 12 }}>
                                        <div style={{ flexBasis: '48px', flexGrow: 0, marginRight: '12px', alignItems: 'center', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative' }}>
                                            <div style={{ height: '100%', display: 'flex' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                        </div>
                                        <div style={{ flexBasis: '0px', flexGrow: 1, alignItems: 'stretch', display: 'flex', flexDirection: 'column', position: 'relative', paddingRight: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', flexBasis: 'auto', flexShrink: 0 }}>
                                                <b>{t(langKeys.postcreator_publish_officialpage)}</b> @{t(langKeys.postcreator_publish_officialpage)} · 24h
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', flexBasis: 'auto', flexShrink: 0 }}>
                                                <div style={{ height: '100%', paddingTop: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</div>
                                                </div>
                                            </div>
                                            {(pageMode === 'IMAGE' || pageMode === 'VIDEO') && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                                <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '200px', borderRadius: '8px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>}
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <img alt="" style={{ maxWidth: '100%', marginTop: 6, marginLeft: 6, marginRight: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/6c942c26-3778-47fc-9284-7814a7981b1a/TwitterButton1.png"></img>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'LINKEDINPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '4px', paddingLeft: '18px', paddingTop: '18px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>{t(langKeys.postcreator_publish_linkedin_time)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '10px' }}>
                                        <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                            <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</div>
                                        </div>
                                    </div>
                                    {(pageMode === 'IMAGE' || pageMode === 'VIDEO') && <div style={{ maxWidth: '100%' }}>
                                        <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <img alt="" style={{ maxWidth: '100%', marginLeft: 16, marginBottom: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/60b26115-5c3a-4097-a29c-0db8f0967240/LinkedInButton1.png"></img>
                                        <img alt="" style={{ maxWidth: '100%', marginRight: 16, marginBottom: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/b9c67f51-5291-4fb6-a76a-d295ad8dac98/LinkedInButton2.png"></img>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '14px', marginTop: '6px', fontSize: '12px' }}>
                                        <div style={{ width: '12%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><AccountCircle style={{ height: '16px', width: '16px' }} /></div>
                                        <div style={{ width: '22%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ThumbUp style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_like)}</b></div>
                                        <div style={{ width: '22%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChatBubble style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_comment)}</b></div>
                                        <div style={{ width: '22%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Replay style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_repost)}</b></div>
                                        <div style={{ width: '22%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Send style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_send)}</b></div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'YOUTUBEPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', border: '1px solid #959595' }}>
                                    {(pageMode === 'IMAGE' || pageMode === 'VIDEO') && <div style={{ maxWidth: '100%' }}>
                                        <img alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '10px' }}>
                                        <div style={{ width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingLeft: '6px' }}>
                                            <b>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</b>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '6px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>16k {t(langKeys.postcreator_publish_youtube_subscribers)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                            {previewType === 'TIKTOKPREVIEW' && <div className="row-zyx">
                                <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', paddingBottom: '16px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '6px' }}>
                                        <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                <img alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                            </div>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</div>
                                            </div>
                                        </div>
                                    </div>
                                    {(pageMode === 'IMAGE' || pageMode === 'VIDEO') && <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                        <img alt="" style={{ maxWidth: '80%', display: 'flex', width: '80%', maxHeight: '340px', paddingLeft: 'auto', paddingRight: 'auto', borderRadius: '8px' }} src="https://1.bp.blogspot.com/-YLDLu1GApmQ/Tm-cKFIKE1I/AAAAAAAAEvQ/bp1zLkKJ6Cg/w1200-h630-p-k-no-nu/Purple+solid+color+backgrounds+1.png"></img>
                                    </div>}
                                </div>
                            </div>}
                            <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    onClick={() => { setOpenModal(true); }}
                                >{t(langKeys.postcreator_publish_draft)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Timelapse color="secondary" />}
                                    style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center' }}
                                    onClick={() => { setOpenModal(true); }}
                                >{t(langKeys.postcreator_publish_program)}
                                </Button>
                                <Button
                                    className={classes.button}
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Send color="secondary" />}
                                    style={{ backgroundColor: "#11ABF1", display: 'flex', alignItems: 'center' }}
                                    onClick={() => { setOpenModal(true); }}
                                >{t(langKeys.postcreator_publish_publish)}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment >
        </div>
    )
}

const SavePostModalGeneric: FC<{ data: any, openModal: boolean, setOpenModal: (param: any) => void, onTrigger: () => void }> = ({ data, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    return (
        <DialogZyx
            open={openModal}
            title={t(langKeys.regulatepayment)}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
            buttonText2={t(langKeys.save)}
            handleClickButton2={() => { }}
            button2Type="submit"
        >
            <React.Fragment>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo() as any)[navigator.language.split('-')[0]]}>
                    <KeyboardDatePicker
                        invalidDateMessage={t(langKeys.invalid_date_format)}
                        format={getLocaleDateString()}
                        value={null}
                        onChange={(e: any) => {
                        }}
                        style={{ minWidth: '150px' }}
                    />
                </MuiPickersUtilsProvider>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo())[navigator.language.split('-')[0]]}>
                    <KeyboardTimePicker
                        ampm={false}
                        views={['hours', 'minutes', 'seconds']}
                        format="HH:mm:ss"
                        error={false}
                        helperText={''}
                        value={null}
                        onChange={(e: any) => { }}
                        style={{ minWidth: '150px' }}
                    />
                </MuiPickersUtilsProvider>
            </React.Fragment>
        </DialogZyx>
    )
}

export default PostCreatorPublish;