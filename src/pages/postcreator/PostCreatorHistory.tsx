/* eslint-disable react-hooks/exhaustive-deps */
import ClearIcon from '@material-ui/icons/Clear';
import CloseIcon from '@material-ui/icons/Close';
import React, { FC, Fragment, useEffect, useState, useCallback } from "react";
import TableZyx from "components/fields/table-simple";
import DateFnsUtils from '@date-io/date-fns';

import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { dataActivities, dataFeelings, getLocaleDateString, localesLaraigo } from 'common/helpers';
import { AntTab, FieldSelect, DateRangePicker, GetIconColor, FieldView, FieldEdit, FieldEditAdvanced, TemplateBreadcrumbs } from 'components';
import { Avatar, Button, Tabs } from "@material-ui/core";
import { CalendarIcon } from "icons";
import { Dictionary, IRequestBody } from "@types";
import { getCollection, getMultiCollection, resetAllMain, uploadFileMetadata } from "store/main/actions";
import { getDateCleaned } from "common/helpers/functions";
import { getPostHistorySel, postHistoryIns } from "common/helpers/requestBodies";
import { langKeys } from "lang/keys";
import { makeStyles } from '@material-ui/core/styles';
import { Range } from 'react-date-range';
import { showBackdrop, showSnackbar } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { useSelector } from 'hooks';
import { useTranslation } from "react-i18next";
import { useForm } from 'react-hook-form';
import { AccountCircle, CameraAlt, ChatBubble, Delete, Facebook, Instagram, LinkedIn, MusicNote, PlayCircleOutlineSharp, Replay, Reply, Save, Send, ThumbUp, Timelapse, Twitter, YouTube } from '@material-ui/icons';
import { FacebookColor, InstagramColor, LinkedInColor, TikTokColor, TwitterColor, YouTubeColor } from "icons";

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
    itemDate: {
        border: '1px solid #bfbfc0',
        borderRadius: 4,
        color: 'rgb(143, 146, 161)',
        height: 40,
        minHeight: 40,
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

const selectionKey = 'posthistoryid';
const PostCreatorHistory: FC = () => {
    const { t } = useTranslation();

    const [pageSelected, setPageSelected] = useState(0);

    return (
        <React.Fragment>
            <div style={{ width: '100%' }}>
                <Tabs
                    indicatorColor="primary"
                    onChange={(_, value) => setPageSelected(value)}
                    style={{ border: '1px solid #EBEAED', backgroundColor: '#FFF', marginTop: 8 }}
                    textColor="primary"
                    value={pageSelected}
                    variant="fullWidth"
                >
                    <AntTab label={t(langKeys.published)} />
                    <AntTab label={t(langKeys.history_scheduled)} />
                    <AntTab label={t(langKeys.drafts)} />
                </Tabs>
                {pageSelected === 0 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'PUBLISHED'} />
                    </div>
                }
                {pageSelected === 1 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'SCHEDULED'} />
                    </div>
                }
                {pageSelected === 2 &&
                    <div style={{ marginTop: 4 }}>
                        <PublishedHistory publishType={'DRAFT'} />
                    </div>
                }
            </div>
        </React.Fragment>
    )
}
const initialRange = {
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: 'selection',
    startDate: new Date(new Date().setDate(1)),
}

const PublishedHistory: React.FC<{ publishType: string }> = ({ publishType }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const classes = useStyles();
    const mainResult = useSelector(state => state.main);
    const multiResult = useSelector(state => state.main.multiData);

    const [cleanSelected, setCleanSelected] = useState(false);
    const [dateRangeCreateDate, setDateRangeCreateDate] = useState<Range>(initialRange);
    const [filters, setfilters] = useState<any>({ type: "" });
    const [firstCall, setfirstCall] = useState(true);
    const [openDateRangeCreateDateModal, setOpenDateRangeCreateDateModal] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [waitDelete, setWaitDelete] = useState(false);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<{ row: Dictionary | null, edit: boolean }>({ row: null, edit: false });

    const fetchData = () => dispatch(getCollection(getPostHistorySel({ type: filters.type, status: publishType, datestart: dateRangeCreateDate.startDate, dateend: dateRangeCreateDate.endDate })));

    useEffect(() => {
        fetchData();
        setfirstCall(false);

        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.loading && !firstCall) {
            fetchData();
        }
    }, [filters]);

    useEffect(() => {
        if (!mainResult.mainData.loading && !firstCall && !openDateRangeCreateDateModal) {
            fetchData();
        }
    }, [openDateRangeCreateDateModal]);

    const columns = React.useMemo(() => [
        {
            accessor: 'posthistoryid',
            Header: t(langKeys.title),
            isComponent: true,
            NoFilter: true,
            width: 200,
            Cell: (props: any) => {
                const { texttitle, communicationchanneldesc, medialink, communicationchanneltype } = props.cell.row.original;
                return (
                    <div style={{ display: "flex", gap: 5 }}>
                        <div>
                            {(!!medialink?.[0]?.thumbnail) ?
                                <img loading='eager' alt="" width={50} height={50} src={medialink?.[0]?.thumbnail || ""}></img>
                                :
                                <img loading='eager' alt="" width={50} height={50} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/41ba0151-31c6-4992-88b0-7d528db01de8/textonly.png"></img>
                            }
                            <div style={{ position: "absolute", top: 35, left: 125 }}>
                                <Avatar variant="rounded" style={{ width: 25, height: 25, backgroundColor: "white" }}><GetIconColor channelType={communicationchanneltype} /></Avatar>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: "flex", fontSize: "1.1em" }}>{texttitle}</div>
                            <div style={{ display: "flex", fontSize: "1em", gap: 5 }}><Avatar style={{ width: 20, height: 20 }} />{communicationchanneldesc}</div>
                        </div>
                    </div>
                )
            }
        },
        {
            Header: t(langKeys.publicationdate),
            accessor: 'publishdate',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { publishdate } = props.cell.row.original;
                return (
                    <div style={{ height: 31 }}>
                        {new Date(publishdate).toDateString()}
                    </div>)
            }
        },
        {
            Header: t(langKeys.scope),
            accessor: 'reach',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { reach } = props.cell.row.original;
                return (
                    <div style={{ height: 45, textAlign: "center" }}>
                        <div>
                            {reach || 0}
                        </div>
                        <div>
                            {t(langKeys.peoplereached)}
                        </div>
                    </div>)
            }
        },
        {
            Header: t(langKeys.interaction_plural),
            accessor: 'interactions',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { interactions } = props.cell.row.original;
                return (
                    <div style={{ height: 31, textAlign: "center" }}>
                        {interactions || 0}
                    </div>)
            }
        },
        {
            Header: t(langKeys.likesandreactions),
            accessor: 'likesandreactions',
            width: "auto",
            NoFilter: true,
            Cell: (props: any) => {
                const { reactions } = props.cell.row.original;
                return (
                    <div style={{ height: 45, textAlign: "center" }}>
                        {Object.keys(reactions || {}).map((x) => {
                            return <div>{x.toLocaleUpperCase()}: {reactions[x]} </div>
                        })}
                        <div>
                            {reactions}
                        </div>
                    </div>)
            }
        },
    ], []);

    useEffect(() => {
        if (waitDelete) {
            if (!multiResult.loading && !multiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
                fetchData();
            } else if (multiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(multiResult.code || "error_unexpected_error", { module: t(langKeys.corporation_plural).toLocaleLowerCase() }) }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [multiResult, waitDelete])

    const handleclose = () => {
        const toDelete = mainResult.mainData.data.filter(x => Object.keys(selectedRows).includes(`${x[selectionKey]}`)) || [];
        let allRequestBody: IRequestBody[] = [];
        toDelete.forEach(x => {
            allRequestBody.push(postHistoryIns({ ...x, status: "DELETED", operation: "UPDATE" }));
        });
        setWaitDelete(true);
        dispatch(getMultiCollection(allRequestBody));
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row: row, edit: false });
    }

    if (viewSelected === "view-1") {
        return (
            <div style={{ height: '100%', width: 'inherit' }}>
                <TableZyx
                    cleanSelection={cleanSelected}
                    columns={columns}
                    data={mainResult.mainData.data}
                    download={false}
                    heightWithCheck={65}
                    initialSelectedRows={selectedRows}
                    loading={mainResult.mainData.loading}
                    onClickRow={handleView}
                    register={false}
                    selectionKey={selectionKey}
                    setCleanSelection={setCleanSelected}
                    setSelectedRows={setSelectedRows}
                    useSelection={true}
                    ButtonsElement={() => (
                        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", paddingTop: 10 }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <FieldSelect
                                    data={[
                                        { value: "POST" },
                                        { value: "STORY" },
                                    ]}
                                    label={t(langKeys.posttype)}
                                    loading={false}
                                    onChange={(value) => { setfilters({ ...filters, type: value?.value || "" }) }}
                                    optionDesc="value"
                                    optionValue="value"
                                    size="small"
                                    style={{ maxWidth: 300, minWidth: 200 }}
                                    valueDefault={filters.type}
                                    variant="outlined"
                                />
                                <Button
                                    color="primary"
                                    disabled={Object.keys(selectedRows).length === 0}
                                    onClick={handleclose}
                                    style={{ marginLeft: '5px' }}
                                    variant="contained"
                                >
                                    <CloseIcon />{t(langKeys.delete)}
                                </Button>
                            </div>
                            <div style={{ display: "flex" }}>
                                <DateRangePicker
                                    onSelect={setDateRangeCreateDate}
                                    open={openDateRangeCreateDateModal}
                                    range={dateRangeCreateDate}
                                    setOpen={setOpenDateRangeCreateDateModal}
                                >
                                    <Button
                                        className={classes.itemDate}
                                        startIcon={<CalendarIcon />}
                                        onClick={() => setOpenDateRangeCreateDateModal(!openDateRangeCreateDateModal)}
                                    >
                                        {getDateCleaned(dateRangeCreateDate.startDate!) + " - " + getDateCleaned(dateRangeCreateDate.endDate!)}
                                    </Button>
                                </DateRangePicker>
                            </div>
                        </div>
                    )}
                />
            </div>
        )
    }
    else {
        return (
            <PublishedHistoryDetail
                data={rowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
            />
        )
    }
}

const PublishedHistoryDetail: React.FC<{ data: { row: Dictionary | null, edit: boolean }; setViewSelected: (view: string) => void; fetchData: () => void, }> = ({ data: { row, edit }, setViewSelected, fetchData }) => {
    const dispatch = useDispatch();

    const classes = useStyles();

    const { t } = useTranslation();

    const uploadResult = useSelector(state => state.main.uploadFile);

    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [previewType, setPreviewType] = useState('');
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [customizeType, setCustomizeType] = useState('');

    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({
        defaultValues: {
            corpid: row?.corpid || 0,
            orgid: row?.orgid || 0,
            communicationchannelid: row?.communicationchannelid || 0,
            communicationchanneltype: row?.communicationchanneltype || '',
            posthistoryid: row?.posthistoryid || 0,
            status: row?.status || 'SCHEDULED',
            type: row?.type || '',
            publishdate: row?.publishdate || null,
            texttitle: row?.texttitle || '',
            textbody: row?.textbody || '',
            hashtag: row?.hashtag || '',
            sentiment: row?.sentiment || '',
            activity: row?.activity || '',
            mediatype: row?.mediatype || '',
            medialink: row?.medialink || [],
            operation: row ? 'UPDATE' : 'INSERT',
        }
    });

    React.useEffect(() => {
        if (row) {
            if (row?.communicationchanneltype) {
                switch (row?.communicationchanneltype) {
                    case "FBWA":
                        setPreviewType('FACEBOOKPREVIEW');
                        break;

                    case "INST":
                        setPreviewType('INSTAGRAMPREVIEW');
                        break;

                    case "LNKD":
                        setPreviewType('LINKEDINPREVIEW');
                        break;

                    case "TKTK":
                        setPreviewType('TIKTOKPREVIEW');
                        break;

                    case "YOUT":
                        setPreviewType('YOUTUBEPREVIEW');
                        break;

                    case "TWIT":
                        setPreviewType('TWITTERPREVIEW');
                        break;
                }
            }
        }
    }, [row]);

    React.useEffect(() => {
        register('corpid');
        register('orgid');
        register('communicationchannelid');
        register('communicationchanneltype');
        register('posthistoryid');
        register('status');
        register('type');
        register('publishdate');
        register('texttitle', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('textbody', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('hashtag');
        register('sentiment');
        register('activity');
        register('mediatype', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('medialink');
        register('operation');
    }, [register]);

    const handleDeleteMedia = async () => {
        const input = document.getElementById('attachmentInput') as HTMLInputElement;
        if (input) {
            input.value = "";
        }
        setFileAttachment(null);
        var dataAttached = (getValues('medialink') || []);
        dataAttached.pop();
        setValue('medialink', dataAttached);
        await trigger('medialink');
    }

    const onSubmit = handleSubmit((data) => {
        if ((data.mediatype.length === 0 || !data.mediatype) && data.mediatype !== "TEXT") {
            dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.posthistory_missingmedia) }));
            return;
        }


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
                var dataAttached = (getValues('medialink') || []);
                dataAttached.push({ url: uploadResult?.url, height: uploadResult?.height, width: uploadResult?.width, name: uploadResult?.name, thumbnail: uploadResult?.thumbnail });
                setValue('medialink', dataAttached);
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

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', paddingBottom: '10px' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[
                                { id: "view-1", name: t(langKeys.postcreator_posthistory) },
                                { id: "view-2", name: t(langKeys.postcreator_posthistorydetail) }
                            ]}
                            handleClick={setViewSelected}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("view-1")}
                        >{t(langKeys.back)}</Button>
                    </div>
                </div>
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
                                    <div style={{ width: '100%', flex: '50%' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                            {getValues('communicationchanneltype') === 'FBWA' && <FacebookColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                            {getValues('communicationchanneltype') === 'INST' && <InstagramColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                            {getValues('communicationchanneltype') === 'LNKD' && <LinkedInColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                            {getValues('communicationchanneltype') === 'TKTK' && <TikTokColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                            {getValues('communicationchanneltype') === 'TWIT' && <TwitterColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                            {getValues('communicationchanneltype') === 'YOUT' && <YouTubeColor style={{ width: '28px', height: '28px', marginRight: '6px' }} />}
                                            <span>{row?.communicationchanneldesc || ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-zyx" style={{ marginBottom: '0px', paddingLeft: '6px' }}>
                                    <FieldEdit
                                        className="col-12"
                                        error={errors?.texttitle?.message}
                                        label={t(langKeys.title)}
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

                                            trigger('textbody');
                                        }}
                                        rows={(getValues('mediatype') === 'TEXT' ? 12 : 6)}
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
                                    <span>
                                        {t(langKeys.postcreator_publish_textrecommendation02)}
                                    </span>
                                </div>
                                {(getValues('mediatype') === 'IMAGE' || getValues('mediatype') === 'VIDEO') && <>
                                    {getValues('mediatype') === 'IMAGE' && <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                        <FieldView
                                            className="col-12"
                                            label={''}
                                            value={t(langKeys.postcreator_publish_image)}
                                            styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                        />
                                    </div>}
                                    {getValues('mediatype') === 'VIDEO' && <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                        <FieldView
                                            className="col-12"
                                            label={''}
                                            value={t(langKeys.postcreator_publish_video)}
                                            styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                        />
                                    </div>}
                                    <div className="row-zyx" style={{ marginBottom: '0px' }}>
                                        {getValues('medialink')?.map(function (media: any) {
                                            return <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                                                <div style={{ display: 'inline-flex', verticalAlign: 'center' }}>
                                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                                        <img loading='eager' alt="" style={{ maxHeight: '60px' }} src={media.thumbnail}></img>
                                                    </div>
                                                    <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                        {media.name}<br />{media.height} x {media.width}
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                    <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                        {/*<Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Edit color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                    >{t(langKeys.postcreator_publish_edit)}
                                    </Button>*/}
                                        <Button
                                            className={classes.button}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Delete color="secondary" />}
                                            style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                            onClick={handleDeleteMedia}
                                        >{t(langKeys.postcreator_publish_delete)}
                                        </Button>
                                        <React.Fragment>
                                            <input
                                                accept={getValues('mediatype') === 'IMAGE' ? "image/jpeg" : "video/mp4"}
                                                id="attachmentInput"
                                                onChange={(e) => onChangeAttachment(e.target.files)}
                                                style={{ display: 'none' }}
                                                type="file"
                                            />
                                            <Button
                                                className={classes.button}
                                                color="primary"
                                                disabled={(waitUploadFile || fileAttachment !== null) || (getValues('mediatype') === 'IMAGE' ? (getValues('medialink') || []).length >= 3 : (getValues('medialink') || []).length >= 1)}
                                                onClick={onClickAttachment}
                                                startIcon={getValues('mediatype') === 'IMAGE' ? <CameraAlt color="secondary" /> : <PlayCircleOutlineSharp color="secondary" />}
                                                style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                                variant="contained"
                                            >{getValues('mediatype') === 'IMAGE' ? t(langKeys.postcreator_publish_addimage) : t(langKeys.postcreator_publish_addvideo)}
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
                                    {getValues('communicationchanneltype') === "FBWA" && <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('Facebook') }}
                                        startIcon={<Facebook color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        disabled={customizeType === 'Facebook'}
                                    >{t(langKeys.postcreator_publish_facebook)}
                                    </Button>}
                                    {getValues('communicationchanneltype') === "INST" && <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('Instagram') }}
                                        startIcon={<Instagram color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        disabled={customizeType === 'Instagram'}
                                    >{t(langKeys.postcreator_publish_instagram)}
                                    </Button>}
                                    {getValues('communicationchanneltype') === "LNKD" && <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('LinkedIn') }}
                                        startIcon={<LinkedIn color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        disabled={customizeType === 'LinkedIn'}
                                    >{t(langKeys.postcreator_publish_linkedin)}
                                    </Button>}
                                    {getValues('communicationchanneltype') === "TKTK" && <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('TikTok') }}
                                        startIcon={<MusicNote color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        disabled={customizeType === 'TikTok'}
                                    >{t(langKeys.postcreator_publish_tiktok)}
                                    </Button>}
                                    {getValues('communicationchanneltype') === "TWIT" && <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { setCustomizeType('Twitter') }}
                                        startIcon={<Twitter color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        disabled={customizeType === 'Twitter'}
                                    >{t(langKeys.postcreator_publish_twitter)}
                                    </Button>}
                                    {getValues('communicationchanneltype') === "YOUT" && <Button
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
                                    <FieldEditAdvanced
                                        className="col-12"
                                        disabled={false}
                                        emoji={true}
                                        error={errors?.textbody?.message}
                                        hashtag={true}
                                        label={''}
                                        maxLength={2200}
                                        onChange={(value) => { setValue('textbody', value); trigger('textbody'); }}
                                        rows={18}
                                        style={{ border: '1px solid #959595', borderRadius: '4px', marginLeft: '6px', padding: '8px' }}
                                        valueDefault={getValues('textbody')}
                                    />
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
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_date)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
                                <div className="row-zyx">
                                    <React.Fragment>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={(localesLaraigo() as any)[navigator.language.split('-')[0]]}>
                                            <KeyboardDatePicker
                                                className="col-6"
                                                format={getLocaleDateString()}
                                                invalidDateMessage={t(langKeys.invalid_date_format)}
                                                label={t(langKeys.date)}
                                                value={getValues('publishdate')}
                                                onChange={(e: any) => {
                                                    setValue('publishdate', e);
                                                    trigger('publishdate');
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
                                                value={getValues('publishdate')}
                                                views={['hours', 'minutes', 'seconds']}
                                                onChange={(e: any) => {
                                                    setValue('publishdate', e);
                                                    trigger('publishdate');
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </React.Fragment>
                                </div>
                                <div className="row-zyx">
                                    <FieldView
                                        className="col-12"
                                        label={''}
                                        value={t(langKeys.postcreator_publish_preview)}
                                        styles={{ fontWeight: 'bold', color: '#762AA9' }}
                                    />
                                </div>
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
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textbody')}</div>
                                            </div>
                                        </div>
                                        {((getValues('mediatype') === 'IMAGE' || getValues('mediatype') === 'VIDEO') && (getValues('medialink') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src={getValues('medialink')[0].thumbnail}></img>
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
                                                    <img loading='eager' alt="" style={{ height: '36px', width: '36px', borderRadius: '50%', border: '2px solid #F43C9E', padding: '2px' }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/79df4f1c-c776-4c99-b8f8-47460a24d89e/Laraigo%2003.png"></img>
                                                </div>
                                                <div style={{ height: '100%', paddingLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <b>{t(langKeys.postcreator_publish_officialpage)}</b>
                                                </div>
                                            </div>
                                        </div>
                                        {((getValues('mediatype') === 'IMAGE' || getValues('mediatype') === 'VIDEO') && (getValues('medialink') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src={getValues('medialink')[0].thumbnail}></img>
                                        </div>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', margin: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/334a434c-c07c-4904-8c49-9e425c7b3f8d/InstagramButton1.png"></img>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', margin: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/9a5d369c-3ffc-4f2e-84e9-bb10a4072a16/InstagramButton2.png"></img>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '20px', paddingLeft: '5px', paddingRight: '10px', paddingTop: '6px' }}>
                                            <div style={{ height: '100%', paddingLeft: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                                <div style={{ width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}><b>{t(langKeys.postcreator_publish_officialpage)}</b> {getValues('textbody')}</div>
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
                                                        <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textbody')}</div>
                                                    </div>
                                                </div>
                                                {((getValues('mediatype') === 'IMAGE' || getValues('mediatype') === 'VIDEO') && (getValues('medialink') || []).length > 0) && <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                                    <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '200px', borderRadius: '8px' }} src={getValues('medialink')[0].thumbnail}></img>
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
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textbody')}</div>
                                            </div>
                                        </div>
                                        {((getValues('mediatype') === 'IMAGE' || getValues('mediatype') === 'VIDEO') && (getValues('medialink') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src={getValues('medialink')[0].thumbnail}></img>
                                        </div>}
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', marginLeft: 16, marginBottom: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/60b26115-5c3a-4097-a29c-0db8f0967240/LinkedInButton1.png"></img>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', marginRight: 16, marginBottom: 6 }} src="https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20PERU/b9c67f51-5291-4fb6-a76a-d295ad8dac98/LinkedInButton2.png"></img>
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
                                        {((getValues('mediatype') === 'IMAGE' || getValues('mediatype') === 'VIDEO') && (getValues('medialink') || []).length > 0) && <div style={{ maxWidth: '100%' }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '100%', width: '100%', maxHeight: '300px', paddingLeft: 'auto', paddingRight: 'auto' }} src={getValues('medialink')[0].thumbnail}></img>
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
                                                <div style={{ display: 'flex', width: '100%', paddingRight: 'auto', textAlign: 'justify', textJustify: 'inter-word' }}>{getValues('textbody')}</div>
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
                                                    <div style={{ display: 'flex', width: '100%', paddingRight: 'auto' }}>{getValues('textbody')}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {((getValues('mediatype') === 'IMAGE' || getValues('mediatype') === 'VIDEO') && (getValues('medialink') || []).length > 0) && <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                            <img loading='eager' alt="" style={{ maxWidth: '80%', display: 'flex', width: '80%', maxHeight: '340px', paddingLeft: 'auto', paddingRight: 'auto', borderRadius: '8px' }} src={getValues('medialink')[0].thumbnail}></img>
                                        </div>}
                                    </div>
                                </div>}
                                <div className="row-zyx" style={{ marginTop: '18px', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Save color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        type="submit"
                                        onClick={() => { setValue('status', 'DRAFT') }}
                                    >{t(langKeys.postcreator_publish_confirm_draft)}
                                    </Button>
                                    <Button
                                        className={classes.button}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Timelapse color="secondary" />}
                                        style={{ backgroundColor: "#762AA9", display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        type="submit"
                                        onClick={() => { setValue('status', 'SCHEDULED') }}
                                    >{t(langKeys.postcreator_publish_confirm_save)}
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

export default PostCreatorHistory;