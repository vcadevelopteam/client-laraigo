/* eslint-disable react-hooks/exhaustive-deps */
import Checkbox from '@material-ui/core/Checkbox';
import DateFnsUtils from '@date-io/date-fns';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { FC, Fragment, useEffect, useState, useCallback } from "react";

import { CameraAltOutlined, ChatBubbleOutline, Delete, Facebook, Instagram, LinkedIn, PlayCircleOutlineSharp, ReplayOutlined, ReplyOutlined, Save, Send, SendOutlined, ThumbUpOutlined, Timelapse, Twitter, YouTube, Schedule } from '@material-ui/icons';
import { AntTab, DialogZyx, FieldEdit, FieldEditAdvanced, FieldSelect, FieldView } from 'components';
import { Button, Tabs } from "@material-ui/core";
import { dataActivities } from 'common/helpers';
import { dataFeelings } from 'common/helpers/dataFeeling';
import { Dictionary } from '@types';
import { FacebookColor, FacebookWorkplace, InstagramColor, LinkedInColor, TikTokColor, TwitterColor, WorkplaceMessengerIcon, YouTubeColor } from "icons";
import { getCollection, resetAllMain, uploadFileMetadata } from 'store/main/actions';
import { getCommChannelLst } from 'common/helpers';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { langKeys } from "lang/keys";
import { localesLaraigo } from 'common/helpers';
import { makeStyles } from '@material-ui/core/styles';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { schedulePost } from 'store/posthistory/actions';
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
    buttonSocial: {
        alignItems: 'center',
        backgroundColor: "#BAB8B8",
        color: "#FFFFFF",
        display: 'flex',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '10px',
        marginLeft: '4px',
        marginRight: '4px',
        padding: 12,
        textTransform: 'initial',
        width: 'auto',
        '&:disabled': {
            backgroundColor: "#197BC8",
            color: "#FFFFFF",
        },
        '&:hover': {
            backgroundColor: "#BAB8B8",
            color: "#FFFFFF",
        },
    },
    buttonMedia: {
        alignItems: 'center',
        backgroundColor: "#762AA9",
        color: "#FFFFFF",
        display: 'flex',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '10px',
        marginLeft: '4px',
        marginRight: '4px',
        padding: 12,
        textTransform: 'initial',
        width: 'auto',
        '&:disabled': {
            backgroundColor: "#EBEAEA",
            color: "#757575",
        },
        '&:hover': {
            backgroundColor: "#762AA9",
            color: "#FFFFFF",
        },
    },
    containerDetail: {
        background: '#fff',
        padding: theme.spacing(2),
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

export const PostCreatorPublish: FC<{ setViewSelected: (id: string) => void }> = ({ setViewSelected }) => {
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
                dispatch(showSnackbar({ show: true, severity: "error", message: t(mainResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() }) }));
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
                    <PublishPostGeneric dataChannel={dataChannel} dataRow={null} pageMode={pageMode} setViewSelected={setViewSelected} />
                </div>
            </div>
        </React.Fragment>
    )
}

const PublishPostGeneric: React.FC<{ dataChannel: Dictionary[], dataRow: any, pageMode: string, setViewSelected: (id: string) => void }> = ({ dataChannel, dataRow, pageMode, setViewSelected }) => {
    const dispatch = useDispatch();

    const classes = useStyles();

    const { t } = useTranslation();

    const uploadResult = useSelector(state => state.main.uploadFile);

    const [allowedChannel, setAllowedChannel] = useState<Dictionary[]>([]);
    const [customizeType, setCustomizeType] = useState('Facebook');
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [filteredFeelings, setFilteredFeelings] = useState<any>([]);
    const [mediaDisabled, setMediaDisabled] = useState(false);
    const [modalData, setModalData] = useState<any>(null);
    const [modalType, setModalType] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [previewType, setPreviewType] = useState('FACEBOOKPREVIEW');
    const [showFacebook, setShowFacebook] = useState(true);
    const [showWorkplace, setshowWorkplace] = useState(false);
    const [showInstagram, setShowInstagram] = useState(false);
    const [showLinkedIn, setShowLinkedIn] = useState(false);
    const [showTikTok, setShowTikTok] = useState(false);
    const [showTwitter, setShowTwitter] = useState(false);
    const [showYouTube, setShowYouTube] = useState(false);
    const [tikTokEnabled] = useState(true);
    const [waitUploadFile, setWaitUploadFile] = useState(false);

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({
        defaultValues: {
            activity: dataRow?.activity || '',
            channeldata: dataRow?.channeldata || [],
            mediadata: dataRow?.mediadata || [],
            mediatype: dataRow?.mediatype || pageMode,
            sentiment: dataRow?.sentiment || '',
            textbody: dataRow?.textbody || '',
            textcustomfacebook: dataRow?.textcustomfacebook || '',
            textcustomworkplace: dataRow?.textcustomworkplace || '',
            textcustominstagram: dataRow?.textcustominstagram || '',
            textcustomlinkedin: dataRow?.textcustomlinkedin || '',
            textcustomtiktok: dataRow?.textcustomtiktok || '',
            textcustomtwitter: dataRow?.textcustomtwitter || '',
            textcustomyoutube: dataRow?.textcustomyoutube || '',
            texttitle: dataRow?.texttitle || '',
            scheduledate: dataRow?.scheduledate || null,
            scheduletime: dataRow?.scheduletime || null,
        }
    });

    React.useEffect(() => {
        register('activity');
        register('channeldata');
        register('mediadata');
        register('mediatype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('sentiment', { validate: (value) => ((value && value.length) || !getValues('activity')) || t(langKeys.field_required) });
        register('textbody', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('textcustomfacebook');
        register('textcustomworkplace');
        register('textcustominstagram');
        register('textcustomlinkedin');
        register('textcustomtiktok');
        register('textcustomtwitter');
        register('textcustomyoutube');
        register('texttitle', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [register]);

    const onModalSuccess = (savemode: string) => {
        setOpenModal(false);
        setViewSelected(`postcreator_posthistory_${savemode}`);
    }

    const handleDeleteMedia = async () => {
        const input = document.getElementById('attachmentInput') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
        setFileAttachment(null);
        var dataAttached = (getValues('mediadata') || []);
        dataAttached.pop();
        setValue('mediadata', dataAttached);
        await trigger('mediadata');
    }

    const onSubmit = handleSubmit((data) => {
        if (data.channeldata.length === 0 || !data.channeldata) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.posthistory_missingchannel) }));
            return;
        }

        if ((data.mediadata.length === 0 || !data.mediadata) && data.mediatype !== "TEXT") {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.posthistory_missingmedia) }));
            return;
        }

        setModalData(data);
        setOpenModal(true);
    });

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById('attachmentInput');
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachment(file);
            let fileData = new FormData();
            fileData.append('file', file, file.name);
            dispatch(uploadFileMetadata(fileData));
            dispatch(showBackdrop(true));
            setWaitUploadFile(true);
        }
    }, [])

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                var dataAttached = (getValues('mediadata') || []);
                dataAttached.push({ url: uploadResult?.url, height: uploadResult?.height, width: uploadResult?.width, name: uploadResult?.name, thumbnail: uploadResult?.thumbnail });
                setValue('mediadata', dataAttached);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.success) }));
                dispatch(showBackdrop(false));
                setWaitUploadFile(false);
                setFileAttachment(null);
            } else if (uploadResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(uploadResult.code || 'error_unexpected_error') }));
                dispatch(showBackdrop(false));
                setWaitUploadFile(false);
                setFileAttachment(null);
            }
        }
    }, [waitUploadFile, uploadResult])

    useEffect(() => {
        setMediaDisabled((waitUploadFile || fileAttachment !== null) || (pageMode === 'IMAGE' ? (getValues('mediadata') || []).length >= 3 : (getValues('mediadata') || []).length >= 1));
    }, [waitUploadFile, fileAttachment, pageMode, getValues('mediadata')])

    useEffect(() => {
        setValue('mediatype', pageMode);
        setValue('channeldata', []);
        setValue('mediadata', []);
        setAllowedChannel([]);

        if (pageMode === "TEXT") {
            if (dataChannel.length > 0) {
                let filterData = dataChannel.filter(channel => channel.type === 'FBWA'|| channel.type === 'FBWM' || channel.type === 'TWIT' || channel.type === 'LNKD')?.sort((a, b) => a.type - b.type);
                setAllowedChannel(filterData.map(channel => ({ ...channel, checked: false })));
                setShowFacebook(true);
                setshowWorkplace(true);
                setShowInstagram(false);
                setShowLinkedIn(true);
                setShowTikTok(false);
                setShowTwitter(true);
                setShowYouTube(false);
            }
        }
        if (pageMode === "IMAGE") {
            if (dataChannel.length > 0) {
                let filterData = dataChannel.filter(channel => channel.type === 'FBWA' || channel.type === 'TWIT' || channel.type === 'LNKD' || channel.type === 'INST')?.sort((a, b) => a.type - b.type);
                setAllowedChannel(filterData.map(channel => ({ ...channel, checked: false })));
                setShowFacebook(true);
                setshowWorkplace(false);
                setShowInstagram(true);
                setShowLinkedIn(true);
                setShowTikTok(false);
                setShowTwitter(true);
                setShowYouTube(false);
            }
        }
        if (pageMode === "VIDEO") {
            if (dataChannel.length > 0) {
                let filterData = dataChannel.filter(channel => channel.type === 'FBWA' || channel.type === 'TWIT' || channel.type === 'LNKD' || channel.type === 'INST' || channel.type === 'TKTK' || channel.type === 'TKTA' || channel.type === 'YOUT')?.sort((a, b) => a.type - b.type);
                setAllowedChannel(filterData.map(channel => ({ ...channel, checked: false })));
                setShowFacebook(true);
                setshowWorkplace(false);
                setShowInstagram(true);
                setShowLinkedIn(true);
                setShowTikTok(true);
                setShowTwitter(true);
                setShowYouTube(true);
            }
        }
    }, [dataChannel, pageMode])

    function getFilteredFeelings() {
        const feelings = dataFeelings.filter(feeling => feeling.activity_id === getValues('activity'));
        setFilteredFeelings(feelings);
    }

    return (
        <div style={{ width: '100%' }}>
            <SavePostModalGeneric
                modalData={modalData}
                modalType={modalType}
                openModal={openModal}
                setOpenModal={setOpenModal}
                onTrigger={onModalSuccess}
            />
            <form onSubmit={onSubmit} style={{ width: '100%' }}>
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
                                                            {channel.type === 'FBWM' && <WorkplaceMessengerIcon style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                            {channel.type === 'INST' && <InstagramColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                            {channel.type === 'LNKD' && <LinkedInColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                            {channel.type === 'TKTK' && <TikTokColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                                            {channel.type === 'TKTA' && <TikTokColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
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
                                <div className="row-zyx" style={{ marginBottom: '26px', height: '10px', paddingLeft: '2px' }}>
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                        value={t(langKeys.title)}
                                    />
                                </div>
                                <div className="row-zyx" style={{ marginBottom: '0px', paddingLeft: '6px' }}>
                                    <FieldEdit
                                        className="col-12"
                                        error={errors?.texttitle?.message}
                                        label={''}
                                        onChange={(value) => { setValue('texttitle', value); trigger('texttitle'); }}
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
                                            setValue('textcustomworkplace', value);
                                            setValue('textcustominstagram', value);
                                            setValue('textcustomlinkedin', value);
                                            setValue('textcustomtiktok', value);
                                            setValue('textcustomtwitter', value);
                                            setValue('textcustomyoutube', value);

                                            trigger('textcustomfacebook');
                                            trigger('textcustomworkplace');
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
                                    {pageMode === 'IMAGE' && <span>
                                        {t(langKeys.postcreator_publish_textrecommendation02)}
                                    </span>}
                                    {pageMode === 'IMAGE' && <span>
                                        {t(langKeys.postcreator_publish_textrecommendation03)}
                                    </span>}
                                    {pageMode === 'VIDEO' && <span>
                                        {t(langKeys.postcreator_publish_textrecommendation04)}
                                    </span>}
                                    {pageMode === 'VIDEO' && <span>
                                        {t(langKeys.postcreator_publish_textrecommendation05)}
                                    </span>}
                                </div>
                                {(pageMode === 'IMAGE' || pageMode === 'VIDEO') && <>
                                    {pageMode === 'IMAGE' && <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                        <FieldView
                                            className="col-12"
                                            label={''}
                                            value={t(langKeys.postcreator_publish_image)}
                                            styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                        />
                                    </div>}
                                    {pageMode === 'VIDEO' && <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                        <FieldView
                                            className="col-12"
                                            label={''}
                                            value={t(langKeys.postcreator_publish_video)}
                                            styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                        />
                                    </div>}
                                    <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                        {getValues('mediadata')?.map(function (media: any) {
                                            return <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                                <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                        <img loading='eager' alt="" style={{ maxHeight: '60px' }} src={media.thumbnail}></img>
                                                    </div>
                                                    <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                        {media.name}<br />{media.width} x {media.height}
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                    <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            className={classes.button}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Delete style={{ color: "#757575" }} />}
                                            style={{ backgroundColor: "#EBEAEA", color: "#757575", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                            onClick={handleDeleteMedia}
                                        >{t(langKeys.postcreator_publish_delete)}
                                        </Button>
                                        <React.Fragment>
                                            <input
                                                accept={pageMode === 'IMAGE' ? "image/*" : "video/*"}
                                                id="attachmentInput"
                                                onChange={(e) => onChangeAttachment(e.target.files)}
                                                style={{ display: 'none' }}
                                                type="file"
                                            />
                                            <Button
                                                className={classes.buttonMedia}
                                                color="primary"
                                                disabled={mediaDisabled}
                                                onClick={onClickAttachment}
                                                startIcon={pageMode === 'IMAGE' ? <CameraAltOutlined style={{ color: (mediaDisabled ? "#757575" : "#FFFFFF") }} /> : <PlayCircleOutlineSharp style={{ color: (mediaDisabled ? "#757575" : "#FFFFFF") }} />}
                                                variant="contained"
                                            >{pageMode === 'IMAGE' ? t(langKeys.postcreator_publish_addimage) : t(langKeys.postcreator_publish_addvideo)}
                                            </Button>
                                        </React.Fragment>
                                    </div>
                                </>}
                            </div>
                        </div>
                        <div className={classes.containerLeft}>
                            <div className={classes.root}>
                                <div className="row-zyx">
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_customizemode)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
                                <div className="row-zyx" style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                    {showFacebook && <Button
                                        className={classes.buttonSocial}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('Facebook') }}
                                        startIcon={<Facebook color="secondary" />}
                                        disabled={customizeType === 'Facebook'}
                                    >{t(langKeys.postcreator_publish_facebook)}
                                    </Button>}
                                    {showWorkplace && <Button
                                        className={classes.buttonSocial}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('Workplace') }}
                                        startIcon={<FacebookWorkplace fill="white" />}
                                        disabled={customizeType === 'Workplace'}
                                    >{t(langKeys.postcreator_publish_workplace)}
                                    </Button>}
                                    {showInstagram && <Button
                                        className={classes.buttonSocial}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('Instagram') }}
                                        startIcon={<Instagram color="secondary" />}
                                        disabled={customizeType === 'Instagram'}
                                    >{t(langKeys.postcreator_publish_instagram)}
                                    </Button>}
                                    {showLinkedIn && <Button
                                        className={classes.buttonSocial}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('LinkedIn') }}
                                        startIcon={<LinkedIn color="secondary" />}
                                        disabled={customizeType === 'LinkedIn'}
                                    >{t(langKeys.postcreator_publish_linkedin)}
                                    </Button>}
                                    {(showTikTok && tikTokEnabled) && <Button
                                        className={classes.buttonSocial}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('TikTok') }}
                                        startIcon={<svg
                                            fill={"#FFFFFF"}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 50 50"
                                            width="20px"
                                            height="20px"
                                        >
                                            <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
                                        </svg>}
                                        disabled={customizeType === 'TikTok'}
                                    >{t(langKeys.postcreator_publish_tiktok)}
                                    </Button>}
                                    {showTwitter && <Button
                                        className={classes.buttonSocial}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('Twitter') }}
                                        startIcon={<Twitter color="secondary" />}
                                        disabled={customizeType === 'Twitter'}
                                    >{t(langKeys.postcreator_publish_twitter)}
                                    </Button>}
                                    {showYouTube && <Button
                                        className={classes.buttonSocial}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('YouTube') }}
                                        startIcon={<YouTube color="secondary" />}
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
                                        onChange={(value) => { setValue('textcustomfacebook', value); trigger('textcustomfacebook'); }}
                                        rows={18}
                                        style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                        valueDefault={getValues('textcustomfacebook')}
                                    />}
                                    {customizeType === "Workplace" && <FieldEditAdvanced
                                        className="col-12"
                                        disabled={false}
                                        emoji={true}
                                        error={errors?.textcustomworkplace?.message}
                                        hashtag={true}
                                        label={''}
                                        maxLength={2200}
                                        onChange={(value) => { setValue('textcustomworkplace', value); trigger('textcustomworkplace'); }}
                                        rows={18}
                                        style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                        valueDefault={getValues('textcustomworkplace')}
                                    />}
                                    {customizeType === "Instagram" && <FieldEditAdvanced
                                        className="col-12"
                                        disabled={false}
                                        emoji={true}
                                        error={errors?.textcustominstagram?.message}
                                        hashtag={true}
                                        label={''}
                                        maxLength={2200}
                                        onChange={(value) => { setValue('textcustominstagram', value); trigger('textcustominstagram'); }}
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
                                        onChange={(value) => { setValue('textcustomlinkedin', value); trigger('textcustomlinkedin'); }}
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
                                        onChange={(value) => { setValue('textcustomtiktok', value); trigger('textcustomtiktok'); }}
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
                                        onChange={(value) => { setValue('textcustomtwitter', value); trigger('textcustomtwitter'); }}
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
                                        onChange={(value) => { setValue('textcustomyoutube', value); trigger('textcustomyoutube'); }}
                                        rows={18}
                                        style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                        valueDefault={getValues('textcustomyoutube')}
                                    />}
                                </div>}
                                {(customizeType === 'Facebook' && pageMode !== 'VIDEO') && <div className="row-zyx">
                                    <FieldSelect
                                        data={dataActivities}
                                        error={errors?.activity?.message}
                                        label={t(langKeys.postcreator_publish_activity)}
                                        onChange={(value) => { setValue('activity', value?.activity_id); getFilteredFeelings(); }}
                                        optionDesc="activity_name"
                                        optionValue="activity_id"
                                        style={{ width: '100%', paddingLeft: '6px', paddingRight: '6px' }}
                                        valueDefault={getValues('activity')}
                                        variant="outlined"
                                        uset={true}
                                        prefixTranslation={'posthistory_'}
                                    />
                                </div>}
                                {(customizeType === 'Facebook' && pageMode !== 'VIDEO') && <div className="row-zyx">
                                    <FieldSelect
                                        data={filteredFeelings?.length > 0 ? filteredFeelings : []}
                                        error={errors?.sentiment?.message}
                                        label={t(langKeys.postcreator_publish_sentiment)}
                                        onChange={(value) => { setValue('sentiment', value?.feeling_id); }}
                                        optionDesc="feeling_name"
                                        optionValue="feeling_id"
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
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_previewmode)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
                                <div className="row-zyx">
                                    <FieldSelect
                                        label={''}
                                        style={{ width: '100%', backgroundColor: 'white', marginBottom: '20px' }}
                                        valueDefault={previewType}
                                        variant="outlined"
                                        onChange={(value) => { setPreviewType(value?.value) }}
                                        data={[
                                            {
                                                description: t(langKeys.postcreator_publish_mockupfacebook),
                                                value: "FACEBOOKPREVIEW",
                                            },
                                            {
                                                description: 'Muro Workplace',
                                                value: "WORKPLACEPREVIEW",
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
                                {previewType === 'FACEBOOKPREVIEW' && <div className="row-zyx">
                                    <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '18px' }}>
                                            <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                    <img loading='eager' alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/79df4f1c-c776-4c99-b8f8-47460a24d89e/Laraigo%2003.png"></img>
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
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textcustomfacebook')}</div>
                                            </div>
                                        </div>
                                        {((pageMode === 'IMAGE' || pageMode === 'VIDEO') && (getValues('mediadata') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto', objectFit: 'cover' }} src={getValues('mediadata')[0].thumbnail}></img>
                                        </div>}
                                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '10px', marginTop: '6px' }}>
                                            <div style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ThumbUpOutlined style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_like)}</b></div>
                                            <div style={{ width: '34%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChatBubbleOutline style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_comment)}</b></div>
                                            <div style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ReplyOutlined style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_share)}</b></div>
                                        </div>
                                    </div>
                                </div>}
                                {previewType === 'WORKPLACEPREVIEW' && <div className="row-zyx">
                                    <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '18px' }}>
                                            <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                    <img loading='eager' alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/79df4f1c-c776-4c99-b8f8-47460a24d89e/Laraigo%2003.png"></img>
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
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textcustomworkplace')}</div>
                                            </div>
                                        </div>
                                        {((pageMode === 'IMAGE' || pageMode === 'VIDEO') && (getValues('mediadata') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto', objectFit: 'cover' }} src={getValues('mediadata')[0].thumbnail}></img>
                                        </div>}
                                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '10px', marginTop: '6px' }}>
                                            <div style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ThumbUpOutlined style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_like)}</b></div>
                                            <div style={{ width: '34%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChatBubbleOutline style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_comment)}</b></div>
                                            <div style={{ width: '33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ReplyOutlined style={{ marginRight: '6px' }} /><b>{t(langKeys.postcreator_publish_facebookmockup_share)}</b></div>
                                        </div>
                                    </div>
                                </div>}
                                {previewType === 'INSTAGRAMPREVIEW' && <div className="row-zyx">
                                    <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '18px' }}>
                                            <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                    <img loading='eager' alt="" style={{ height: '36px', width: '36px', borderRadius: '50%', border: '2px solid #F43C9E', padding: '2px' }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/79df4f1c-c776-4c99-b8f8-47460a24d89e/Laraigo%2003.png"></img>
                                                </div>
                                                <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <b>{t(langKeys.postcreator_publish_officialpage)}</b>
                                                </div>
                                            </div>
                                        </div>
                                        {((pageMode === 'IMAGE' || pageMode === 'VIDEO') && (getValues('mediadata') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto', objectFit: 'cover' }} src={getValues('mediadata')[0].thumbnail}></img>
                                        </div>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', margin: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/334a434c-c07c-4904-8c49-9e425c7b3f8d/InstagramButton1.png"></img>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', margin: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/9a5d369c-3ffc-4f2e-84e9-bb10a4072a16/InstagramButton2.png"></img>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px', paddingLeft: '5px', paddingRight: '10px', paddingTop: '6px' }}>
                                            <div style={{ height: '100%', paddingLeft: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                <div style={{ width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b> {getValues('textcustominstagram')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                                {previewType === 'TWITTERPREVIEW' && <div className="row-zyx">
                                    <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', border: '1px solid #959595' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', flexBasis: 'auto', flexShrink: 0, margin: 12 }}>
                                            <div style={{ flexBasis: '48px', flexGrow: 0, marginRight: '12px', alignItems: 'center', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'relative' }}>
                                                <div style={{ height: '100%', display: 'flex' }}>
                                                    <img loading='eager' alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/79df4f1c-c776-4c99-b8f8-47460a24d89e/Laraigo%2003.png"></img>
                                                </div>
                                            </div>
                                            <div style={{ flexBasis: '0px', flexGrow: 1, alignItems: 'stretch', display: 'flex', flexDirection: 'column', position: 'relative', paddingRight: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', flexBasis: 'auto', flexShrink: 0 }}>
                                                    <b>{t(langKeys.postcreator_publish_officialpage)}</b> @{t(langKeys.postcreator_publish_officialpage)} · 24h
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', flexDirection: 'row', flexBasis: 'auto', flexShrink: 0 }}>
                                                    <div style={{ height: '100%', paddingTop: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                        <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textcustomtwitter')}</div>
                                                    </div>
                                                </div>
                                                {((pageMode === 'IMAGE' || pageMode === 'VIDEO') && (getValues('mediadata') || []).length > 0) && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                                    <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }} src={getValues('mediadata')[0].thumbnail}></img>
                                                </div>}
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <img loading='eager' alt="" style={{ maxWidth: '100%', marginTop: 6, marginLeft: 6, marginRight: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/6c942c26-3778-47fc-9284-7814a7981b1a/TwitterButton1.png"></img>
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
                                                    <img loading='eager' alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/79df4f1c-c776-4c99-b8f8-47460a24d89e/Laraigo%2003.png"></img>
                                                </div>
                                                <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>{t(langKeys.postcreator_publish_linkedin_time)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '12px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '10px' }}>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textcustomlinkedin')}</div>
                                            </div>
                                        </div>
                                        {((pageMode === 'IMAGE' || pageMode === 'VIDEO') && (getValues('mediadata') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto', objectFit: 'cover' }} src={getValues('mediadata')[0].thumbnail}></img>
                                        </div>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', marginLeft: 16, marginBottom: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/60b26115-5c3a-4097-a29c-0db8f0967240/LinkedInButton1.png"></img>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', marginRight: 16, marginBottom: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/b9c67f51-5291-4fb6-a76a-d295ad8dac98/LinkedInButton2.png"></img>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '14px', marginTop: '6px', fontSize: '12px' }}>
                                            <div style={{ width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ThumbUpOutlined style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_like)}</b></div>
                                            <div style={{ width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ChatBubbleOutline style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_comment)}</b></div>
                                            <div style={{ width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><ReplayOutlined style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_repost)}</b></div>
                                            <div style={{ width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><SendOutlined style={{ height: '16px', width: '16px', marginRight: '2px' }} /><b>{t(langKeys.postcreator_publish_linkedin_send)}</b></div>
                                        </div>
                                    </div>
                                </div>}
                                {previewType === 'YOUTUBEPREVIEW' && <div className="row-zyx">
                                    <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', backgroundColor: 'white', border: '1px solid #959595' }}>
                                        {((pageMode === 'IMAGE' || pageMode === 'VIDEO') && (getValues('mediadata') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto', objectFit: 'cover' }} src={getValues('mediadata')[0].thumbnail}></img>
                                        </div>}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '10px' }}>
                                            <div style={{ width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', paddingLeft: '6px' }}>
                                                <b>{getValues('texttitle')}</b>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '6px' }}>
                                            <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                    <img loading='eager' alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/79df4f1c-c776-4c99-b8f8-47460a24d89e/Laraigo%2003.png"></img>
                                                </div>
                                                <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line', marginBottom: '10px' }}>
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>16k {t(langKeys.postcreator_publish_youtube_subscribers)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '10px', paddingRight: '20px', paddingTop: '4px' }}>
                                            <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textcustomyoutube')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                                {previewType === 'TIKTOKPREVIEW' && <div className="row-zyx">
                                    <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', paddingTop: '10px', paddingBottom: '16px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #959595' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px', paddingLeft: '18px', paddingTop: '6px' }}>
                                            <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                                <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                    <img loading='eager' alt="" style={{ height: '40px', width: '40px', borderRadius: '50%' }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/79df4f1c-c776-4c99-b8f8-47460a24d89e/Laraigo%2003.png"></img>
                                                </div>
                                                <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line', marginBottom: '10px' }}>
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b></div>
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>{getValues('textcustomtiktok')}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {((pageMode === 'IMAGE' || pageMode === 'VIDEO') && (getValues('mediadata') || []).length > 0) && <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '80%', display: 'flex', width: '80%', maxHeight: '340px', paddingLeft: 'auto', paddingRight: 'auto', borderRadius: '8px', objectFit: 'cover' }} src={getValues('mediadata')[0].thumbnail}></img>
                                        </div>}
                                    </div>
                                </div>}
                                <div className="row-zyx" style={{ marginTop: '-6px' }}>
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_preview)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
                                <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Save color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        type="submit"
                                        onClick={() => { setModalType('DRAFT') }}
                                    >{t(langKeys.postcreator_publish_draft)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Schedule color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        type="submit"
                                        onClick={() => { setModalType('PROGRAM') }}
                                    >{t(langKeys.postcreator_publish_program)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Send color="secondary" />}
                                        style={{ backgroundColor: "#11ABF1", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        type="submit"
                                        onClick={() => { setModalType('PUBLISH') }}
                                    >{t(langKeys.postcreator_publish_publish)}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment >
            </form>
        </div >
    )
}

const SavePostModalGeneric: FC<{ modalData: any, modalType: string, openModal: boolean, setOpenModal: (param: any) => void, onTrigger: (savemode: string) => void }> = ({ modalData, modalType, openModal, setOpenModal, onTrigger }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const resultSchedule = useSelector(state => state.postHistory.requestSchedulePost);

    const [modalDate, setModalDate] = useState(null);
    const [modalTime, setModalTime] = useState(null);

    const [waitSave, setWaitSave] = useState(false);
    const [insertMode, setInsertMode] = useState('DRAFT');

    const handleInsert = (type: string) => {
        setInsertMode(type);

        if (!modalDate || !modalTime) {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.posthistory_missingdatetime) }));
            return;
        }

        const callback = () => {
            dispatch(schedulePost({ data: modalData, date: modalDate, time: modalTime, type: type, publication: 'POST' }));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    }

    useEffect(() => {
        if (waitSave) {
            if (!resultSchedule.loading && !resultSchedule.error) {
                dispatch(showBackdrop(false));
                setWaitSave(false);
                onTrigger(insertMode === 'DRAFT' ? '2' : '1');
            } else if (resultSchedule.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(resultSchedule.code || "error_unexpected_error", { module: t(langKeys.person).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [resultSchedule, waitSave]);

    return (
        <DialogZyx
            button2Type="button"
            buttonText1={t(langKeys.postcreator_publish_program_cancel)}
            buttonText2={modalType === "PUBLISH" ? t(langKeys.postcreator_publish_confirm_draft) : ''}
            buttonText3={modalType === "PUBLISH" ? t(langKeys.postcreator_publish_confirm_save) : t(langKeys.postcreator_publish_program_save)}
            handleClickButton1={() => setOpenModal(false)}
            handleClickButton2={() => { handleInsert('DRAFT'); }}
            handleClickButton3={() => { modalType === "DRAFT" ? handleInsert('DRAFT') : handleInsert('PUBLISH'); }}
            open={openModal}
            title={modalType === "DRAFT" ? t(langKeys.postcreator_publish_draft_title) : (modalType === "PROGRAM" ? t(langKeys.postcreator_publish_program_title) : t(langKeys.postcreator_publish_confirm_title))}
            showClose={true}
        >
            <div className={classes.containerDetail}>
                <h4 style={{ marginTop: '2px' }}>{modalType === "DRAFT" ? t(langKeys.postcreator_publish_draft_description) : (modalType === "PROGRAM" ? t(langKeys.postcreator_publish_program_description) : t(langKeys.postcreator_publish_confirm_description))}</h4>
                <div className="row-zyx">
                    {modalData?.channeldata?.map(function (channel: any) {
                        return <div style={{ width: '100%', flex: '50%' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                {channel.type === 'FBWA' && <FacebookColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                {channel.type === 'FBWM' && <WorkplaceMessengerIcon style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                {channel.type === 'INST' && <InstagramColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                {channel.type === 'LNKD' && <LinkedInColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                {channel.type === 'TKTK' && <TikTokColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                {channel.type === 'TKTA' && <TikTokColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                {channel.type === 'TWIT' && <TwitterColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                {channel.type === 'YOUT' && <YouTubeColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                <span>{channel.communicationchanneldesc}</span>
                            </div>
                        </div>
                    })}
                </div>
                <div className="row-zyx">
                    <React.Fragment>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo() as any)[navigator.language.split('-')[0]]}>
                            <KeyboardDatePicker
                                className="col-6"
                                format="d MMMM yyyy"
                                invalidDateMessage={t(langKeys.invalid_date_format)}
                                label={t(langKeys.date)}
                                value={modalDate}
                                onChange={(e: any) => {
                                    setModalDate(e);
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo())[navigator.language.split('-')[0]]}>
                            <KeyboardTimePicker
                                ampm={false}
                                className="col-6"
                                error={false}
                                format="HH:mm:ss"
                                label={t(langKeys.time)}
                                value={modalTime}
                                views={['hours', 'minutes', 'seconds']}
                                onChange={(e: any) => {
                                    setModalTime(e);
                                }}
                                keyboardIcon={<Timelapse />}
                            />
                        </MuiPickersUtilsProvider>
                    </React.Fragment>
                </div>
                <div className="row-zyx">
                    <h3 style={{ marginBottom: '2px' }}>{modalData?.texttitle}</h3>
                    <h4 style={{ marginTop: '2px' }}>{modalData?.textbody}</h4>
                </div>
            </div>
        </DialogZyx>
    )
}

export default PostCreatorPublish;