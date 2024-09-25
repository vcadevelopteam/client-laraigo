import React, { FC, Fragment, useCallback, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, DialogZyx, TemplateSwitch, DialogZyxDiv, FieldEditWithSelect } from 'components';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { getQuickrepliesSel, getValuesFromDomain, insQuickreplies, getValuesForTree, uploadExcel, getParentSel, exportExcel, templateMaker,deleteClassificationTree, getChatflowVariableSel, filterPipe } from 'common/helpers';
import { EmojiPickerZyx } from 'components'
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute, getMultiCollectionAux, uploadFile, setMemoryTable, cleanMemoryTable } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import DeleteIcon from '@material-ui/icons/Delete';

import ClearIcon from '@material-ui/icons/Clear';
import { TreeItem, TreeView } from '@material-ui/lab';
import { Box, CircularProgress, IconButton, Input, InputAdornment, InputLabel, Menu, MenuItem, Paper } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { DetailTipification } from './Tipifications';
import AttachFileIcon from "@material-ui/icons/AttachFile";
import {
    Close,
    FileCopy,
    GetApp,
    MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import { emojis } from "common/constants/emojis";
import { emitEvent } from 'store/inbox/actions';
import { RichText, renderToString, toElement } from 'components/fields/RichText';
import { Descendant } from 'slate';
import { CellProps } from 'react-table';

const EMOJISINDEXED = emojis.reduce((acc: any, item: any) => ({ ...acc, [item.emojihex]: item }), {});

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailQuickreplyProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
    fetchMultiData: () => void;
    arrayBread: any;
}
const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    inputlabelclass: {
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "18px",
        marginBottom: "8px",
        color: "black"
    },
    treeviewroot: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
    treelabels: {display:"flex",justifyContent:"space-between"},
    headerText: {
        flexBasis: "200px",
        flexGrow: 1,
    },
}));

const TreeItemsFromData2: React.FC<{ dataClassTotal: Dictionary,setAnchorEl: (param: any) => void, setonclickdelete:(param: any) => void}> = ({ dataClassTotal,setAnchorEl,setonclickdelete }) => {
    const parents: any[] = []
    const children: any[] = []
    const classes = useStyles();
    

    dataClassTotal.forEach((x: Dictionary) => {
        if (x.parent === 0) {
            let item = {
                key: x.classificationid,
                nodeId: x.classificationid.toString(),
                label: x.description.toString(),
                children: x.haschildren,
                quickreplies: x.quickreplies
            }
            parents.push(item)// = [...parents, item])
        } else {
            let item = {
                key: x.classificationid,
                nodeId: x.classificationid?.toString(),
                label: x.description?.toString(),
                children: x.haschildren,
                father: x.parent,
                quickreplies: x.quickreplies
            }
            children.push(item)
        }
    })
    function Loadchildren(id: number) {

        return children.map(x => {
            if (x.father === id) {
                return (
                    <TreeItem
                        key={x.key}
                        nodeId={String(x.nodeId)}
                        label={
                        <div className={classes.treelabels}>
                            <div>{x.label}</div>
                            <div>
                            {(!x.children) && 
                                <IconButton
                                    onClick={(event)=>{setAnchorEl(event.currentTarget);setonclickdelete(x)}}
                                    size="small"
                                >
                                <MoreVertIcon
                                    style={{ cursor: 'pointer' }}
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    color="action"
                                    fontSize="small"
                                />
                                </IconButton>
                            }
                            </div>
                        </div>}
                    >
                        {x.children ? Loadchildren(x.key) : null}
                    </TreeItem>
                )
            }
            return null;
        })
    }
    return (
        <>
            {parents.map(x =>
                <TreeItem
                    key={x.key}
                    nodeId={String(x.nodeId)}
                    label={
                        <div className={classes.treelabels}>
                            <div>{x.label}</div>
                            <div>
                            {(!x.children) && 
                                <IconButton
                                    onClick={(event)=>{setAnchorEl(event.currentTarget);setonclickdelete(x)}}
                                    size="small"
                                >
                                <MoreVertIcon
                                    style={{ cursor: 'pointer' }}
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    color="action"
                                    fontSize="small"
                                />
                                </IconButton>
                            }
                            </div>
                        </div>}
                >
                    {x.children ? Loadchildren(x.key) : null}
                </TreeItem>)}
        </>
    )
};

const TreeItemsFromData: React.FC<{ dataClassTotal: Dictionary, setValueTmp: (p1: number) => void, setselectedlabel: (param: any) => void ,setAnchorEl: (param: any) => void, 
    setonclickdelete:(param: any) => void}> = ({ dataClassTotal, setValueTmp, setselectedlabel,setAnchorEl,setonclickdelete }) => {
    const parents: any[] = []
    const children: any[] = []
    const classes = useStyles();

    dataClassTotal.forEach((x: Dictionary) => {
        if (x.parent === 0) {
            let item = {
                key: x.classificationid,
                nodeId: x.classificationid.toString(),
                label: x.description.toString(),
                children: x.haschildren,
                quickreplies: x.quickreplies
            }
            parents.push(item)// = [...parents, item])
        } else {
            let item = {
                key: x.classificationid,
                nodeId: x.classificationid.toString(),
                label: x.description.toString(),
                children: x.haschildren,
                father: x.parent,
                quickreplies: x.quickreplies
            }
            children.push(item)
        }
    })

    function setselect(x: Dictionary) {
        setValueTmp(x.key)
        setselectedlabel(x.label)
    }

    function Loadchildren(id: number) {
        return children.map(x => {
            if (x.father === id) {
                return (
                    <TreeItem
                        key={x.key}
                        nodeId={String(x.nodeId)}
                        label={<div className={classes.treelabels}>
                        <div>{x.label}</div>
                        <div>
                        {(!x.children) && 
                            <IconButton
                                onClick={(event)=>{setAnchorEl(event.currentTarget);setonclickdelete(x)}}
                                size="small"
                            >
                            <MoreVertIcon
                                style={{ cursor: 'pointer' }}
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                color="action"
                                fontSize="small"
                            />
                            </IconButton>
                        }
                        </div>
                    </div>}
                        onLabelClick={() => setselect(x)}
                    >
                        {x.children ? Loadchildren(x.key) : null}
                    </TreeItem>
                )
            }
            return null;
        })
    }
    return (
        <>
            {parents.map(x =>
                <TreeItem
                    key={x.key}
                    nodeId={String(x.nodeId)}
                    label={<div className={classes.treelabels}>
                    <div>{x.label}</div>
                    <div>
                    {(!x.children) && 
                        <IconButton
                            onClick={(event)=>{setAnchorEl(event.currentTarget);setonclickdelete(x)}}
                            size="small"
                        >
                        <MoreVertIcon
                            style={{ cursor: 'pointer' }}
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            color="action"
                            fontSize="small"
                        />
                        </IconButton>
                    }
                    </div>
                </div>}
                    onLabelClick={() => setselect(x)}
                >
                    {x.children ? Loadchildren(x.key) : null}
                </TreeItem>)}
        </>
    )
};
class VariableHandler {
    show: boolean;
    item: any;
    inputkey: string;
    inputvalue: string;
    range: number[];
    top: number;
    left: number;
    changer: (param:any) => void;
    constructor() {
        this.show = false;
        this.item = null;
        this.inputkey = '';
        this.inputvalue = '';
        this.range = [-1, -1];
        this.changer = (param) => null;
        this.top = 0;
        this.left = 0;
    }
}

interface FilePreviewProps {
    onClose?: (f: string) => void;
    src: File | string;
}

const useFilePreviewStyles = makeStyles((theme) => ({
    btnContainer: {
        color: "lightgrey",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    root: {
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 4,
        display: "flex",
        flexDirection: "row",
        margin: theme.spacing(1),
        maxHeight: 80,
        maxWidth: 300,
        overflow: "hidden",
        padding: theme.spacing(1),
        width: "fit-content",
    },
}));

const FilePreview: FC<FilePreviewProps> = ({ src, onClose }) => {
    const classes = useFilePreviewStyles();

    const isUrl = useCallback(() => typeof src === "string" && src.includes("http"), [src]);

    const getFileName = useCallback(() => {
        if (isUrl()) {
            const m = RegExp(/.*\/(.+?)\./).exec(src as string);
            return m && m.length > 1 ? m[1] : "";
        }
        return (src as File).name;
    }, [isUrl, src]);

    const getFileExt = useCallback(() => {
        if (isUrl()) {
            return (src as string).split(".").pop()?.toUpperCase() ?? "-";
        }
        return (src as File).name?.split(".").pop()?.toUpperCase() ?? "-";
    }, [isUrl, src]);

    return (
        <Paper className={classes.root} elevation={2}>
            <FileCopy />
            <div style={{ width: "0.5em" }} />
            <div className={classes.infoContainer}>
                <div>
                    <div
                        style={{
                            fontWeight: "bold",
                            maxWidth: 190,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {getFileName()}
                    </div>
                    {getFileExt()}
                </div>
            </div>
            <div style={{ width: "0.5em" }} />
            {!isUrl() && !onClose && <CircularProgress color="primary" />}
            <div className={classes.btnContainer}>
                {onClose && (
                    <IconButton size="small" onClick={() => onClose(src as string)}>
                        <Close />
                    </IconButton>
                )}
                {isUrl() && <div style={{ height: "10%" }} />}
                {isUrl() && (
                    <a
                        download={`${getFileName()}.${getFileExt()}`}
                        href={src as string}
                        rel="noreferrer"
                        target="_blank"
                    >
                        <IconButton size="small">
                            <GetApp />
                        </IconButton>
                    </a>
                )}
            </div>
        </Paper>
    );
};

const DetailQuickreply: React.FC<DetailQuickreplyProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, fetchMultiData,arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [selectedlabel, setselectedlabel] = useState(row ? row.classificationdesc : "")
    const [quickreply, setQuickreply] = useState(row ? row.quickreply : "")
    const [datatoshow, setdatatoShow] = useState<any>(multiData[2] && multiData[2].success ? multiData[2].data : [])
    const executeRes = useSelector(state => state.main.execute);
    const multiDataAuxRes = useSelector(state => state.main.multiDataAux)
    const [anchorEl, setAnchorEl] = useState(null);
    const [onclickdelete, setonclickdelete] = useState<any>(null);
    const [variableHandler, setVariableHandler] = useState<VariableHandler>(new VariableHandler());
    const [dataUPD, setDataUPD] = useState<any>(null)
    const [bodyAlert, setBodyAlert] = useState("");
    const [disableInput, setDisableInput] = useState(false);
    const [bodyObject, setBodyObject] = useState<Descendant[]>(
        row?.bodyobject || [{ type: "paragraph", children: [{ text: row?.body || "" }] }]
    );
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const uploadResult = useSelector((state) => state.main.uploadFile);

    const open = Boolean(anchorEl);
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const dispatch = useDispatch();

    const [openDialog, setOpenDialog] = useState(false);
    const [openClassificationModal, setOpenClassificationModal] = useState(false);

    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataClassTotal = multiData[1] && multiData[1].success ? multiData[1].data : [];
    const dataQuickreplyTypes = multiData[3] && multiData[3].success ? multiData[3].data : [];
    const dataPriority = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const extravariables = [
        {variablename: "numticket"},
        {variablename: "client_name"},
        {variablename: "agent_name"},
        {variablename: "user_group"},
    ]
    const dataVariables = multiData[2] && multiData[2].success ? [...multiData[2].data,...extravariables] : [];

    
    const { register, handleSubmit, setValue, getValues, trigger, watch, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            communicationchannelid: row?.communicationchannelid || 0,
            classificationid: row?.classificationid || 0,
            id: row?.quickreplyid || 0,
            quickreply: row?.quickreply || '',
            description: row?.description || '',
            favorite: row?.favorite || false,
            status: row?.status || 'ACTIVO',
            quickreply_type: row?.quickreply_type || 'REDES SOCIALES',
            quickreply_priority: row?.quickreply_priority || 'BAJA',
            attachment: row?.attachment || "",
            operation: row ? "EDIT" : "INSERT"
        }
    });

    const [quickreply_type, attachment] = watch(["quickreply_type", 'attachment']);

    React.useEffect(() => {
        setValue('quickreply', quickreply)
    }, [quickreply]);
    React.useEffect(() => {
        register('communicationchannelid');
        register('type');
        register('id');
        register('favorite');
        register('classificationid');//, { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('quickreply_type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('quickreply_priority', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('quickreply', {
            validate: (value) => {
                if (quickreply_type === 'REDES SOCIALES') return (value && value.length) || t(langKeys.field_required);
                return true;
            }
        });
    }, [edit, register, quickreply_type]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                fetchMultiData();
                if(open){
                    setAnchorEl(null);
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))                    
                    dispatch(showBackdrop(false));
                }else{
                    dispatch(emitEvent({
                        event: 'updateQuickreply',
                        data: {
                            ...dataUPD,
                            id: dataUPD.id||executeRes.data[0].ufn_quickreply_ins
                        }
                    }));
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                    fetchData && fetchData();
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1")
                }
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue(
                    "attachment",
                    (getValues("attachment")
                        ? [getValues("attachment"), uploadResult?.url ?? ""]
                        : [uploadResult?.url ?? ""]
                    ).join(",")
                );
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult]);

    
    const onSubmit = handleSubmit((data) => {
        data.body = renderToString(toElement(bodyObject));
        if (data.type === 'CORREO ELECTRONICO' && data.body === `<div data-reactroot=""><p><span></span></p></div>`) {
            setBodyAlert(t(langKeys.field_required));
            return;
        } else {
            setBodyAlert("");
        }
        // return
        const callback = () => {
            dispatch(execute(insQuickreplies({...data, bodyobject: bodyObject}))); //executeRes
            setDataUPD(data)
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);

        if (file) {
            setFileAttachment(file);
            const fd = new FormData();
            fd.append("file", file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, []);

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById("attachmentInput");
        input!.click();
    }, []);

    const handleCleanMediaInput = async (f: string) => {
        const input = document.getElementById("attachmentInput") as HTMLInputElement;

        if (input) {
            input.value = "";
        }

        setFileAttachment(null);
        setValue(
            "attachment",
            getValues("attachment")
                .split(",")
                .filter((a: string) => a !== f)
                .join(",")
        );

        trigger("attachment");
    };

    const handleClassificationModal = () => {
        dispatch(getMultiCollectionAux([
            getValuesFromDomain("ESTADOGENERICO"),
            getParentSel(),
            getValuesFromDomain("TIPOCANAL"),
            getValuesForTree()
        ]));
        setOpenDialog(false);
        setOpenClassificationModal(true);
    }

    const handleClassificationSave = () => {
        fetchMultiData();
    }

    const handleClassificationCancel = () => {
        setOpenClassificationModal(false);
        setOpenDialog(true);
    }

    useEffect(() => {
        if (openClassificationModal) {
            setOpenClassificationModal(false);
            setOpenDialog(true);
        }
    }, [multiData])

    const selectionVariableSelect = (e: React.ChangeEvent<any>, value: string) => {
        const { inputvalue, range, changer } = variableHandler;
        if (range[1] !== -1 && (range[1] > range[0] || range[0] !== -1)) {
            changer(inputvalue.substring(0, range[0] + 2) + value + (inputvalue[range[1] - 2] !== '}' ? '}}' : '') + inputvalue.substring(range[1] - 2));
            setVariableHandler(new VariableHandler());
        }
    }

    const toggleVariableSelect = (e: React.ChangeEvent<any>, item: any, inputkey: string, changefunc: (param:any) => void, filter = true) => {
        let elem = e.target;
        if (elem) {
            let selectionStart = elem.selectionStart || 0;
            let lines = (elem.value || '').substr(0, selectionStart).split('\n');
            let row = lines.length - 1;
            let column = lines[row].length * 3;
            let startIndex = (elem.value || '').slice(0, selectionStart || 0)?.lastIndexOf('{{');
            let partialText = '';
            if (startIndex !== -1) {
                if (elem.value.slice(startIndex, selectionStart).indexOf(' ') === -1
                    && elem.value.slice(startIndex, selectionStart).indexOf('}}') === -1
                    && elem.value[selectionStart - 1] !== '}') {
                    partialText = elem.value.slice(startIndex + 2, selectionStart);
                    let rightText = (elem.value || '').slice(selectionStart, elem.value.length);
                    let selectionEnd = rightText.indexOf('}}') !== -1 ? rightText.indexOf('}}') : 0;
                    let endIndex = startIndex + partialText.length + selectionEnd + 4;
                    setVariableHandler({
                        show: true,
                        item: item,
                        inputkey: inputkey,
                        inputvalue: elem.value,
                        range: [startIndex, endIndex],
                        changer: changefunc,
                        top: 24 + row * 21,
                        left: column
                    })
                    if (filter) {
                        setdatatoShow(filterPipe(dataVariables, 'variablename', partialText, '%'));
                    }
                    else {
                        setdatatoShow(dataVariables);
                    }
                }
                else {
                    setVariableHandler(new VariableHandler());
                }
            }
            else {
                setVariableHandler(new VariableHandler());
            }
        }
    }

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread,{ id: "view-2", name: `${t(langKeys.quickreply)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newquickreply)}
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
                        {edit &&
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                type="submit"
                                startIcon={<SaveIcon color="secondary" />}
                                style={{ backgroundColor: "#55BD84" }}
                            >{t(langKeys.save)}
                            </Button>
                        }
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.quickreply_type)}
                            className="col-6"
                            valueDefault={getValues('quickreply_type')}
                            onChange={(value) => setValue('quickreply_type', value ? value.domainvalue : '')}
                            error={errors?.quickreply_type?.message}
                            data={dataQuickreplyTypes}
                            uset={true}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        <div className="col-6">
                            {edit ?
                                <div>
                                    <InputLabel htmlFor="outlined-adornment-password" className={classes.inputlabelclass}>{t(langKeys.classification)}</InputLabel>
                                    <Input
                                        disabled
                                        style={{ width: "100%" }}
                                        value={selectedlabel}
                                        type={'text'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setOpenDialog(true)}>
                                                    <ZoomInIcon />
                                                </IconButton>

                                            </InputAdornment>
                                        }
                                    />
                                </div>
                                :
                                <div className="row-zyx">
                                    <FieldView
                                        label={t(langKeys.classification)}
                                        value={row ? (row.classificationdesc || "") : ""}
                                        className="col-12"
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <Typography style={{ fontSize: 22, paddingBottom: "10px" }} color="textPrimary">{t(langKeys.quickreply)}</Typography>
                    <div className="row-zyx">
                        <TemplateSwitch
                            label={t(langKeys.favorite)}
                            className="col-12"
                            valueDefault={row?.favorite || false}
                            onChange={(value) => setValue('favorite', value)}
                        /> 
                    </div>
                    {quickreply_type === 'CORREO ELECTRONICO' ? (
                        <Fragment>
                            <div className="row-zyx">
                                <FieldEdit
                                    label={t(langKeys.summarize)}
                                    className="col-6"
                                    valueDefault={row?.description || ""}
                                    onChange={(value) => setValue('description', value)}
                                    error={errors?.description?.message}
                                />
                                <FieldSelect
                                    label={t(langKeys.priority)}
                                    className="col-6"
                                    valueDefault={getValues('quickreply_priority')}
                                    onChange={(value) => setValue('quickreply_priority', value ? value.domainvalue : '')}
                                    error={errors?.quickreply_priority?.message}
                                    data={dataPriority}
                                    uset={true}
                                    optionDesc="domaindesc"
                                    optionValue="domainvalue"
                                />
                                <Fragment>
                                    <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={1} color="textPrimary">
                                        {t(langKeys.body)}
                                    </Box>
                                    <RichText
                                        spellCheck
                                        value={bodyObject}
                                        onChange={(value) => setBodyObject(value)}
                                        style={{
                                            borderColor: "#762AA9",
                                            borderRadius: "4px",
                                            borderStyle: "solid",
                                            borderWidth: "1px",
                                            padding: "10px",
                                        }}
                                    />
                                    <FieldEdit
                                        className={classes.headerText}
                                        disabled={true}
                                        error={bodyAlert}
                                        label={""}
                                    />
                                </Fragment>
                            </div>
                            <div className="row-zyx">
                                <FieldView label={t(langKeys.messagetemplate_attachment)} />
                                <Fragment>
                                    <input
                                        accept="file/*"
                                        disabled={disableInput}
                                        id="attachmentInput"
                                        onChange={(e) => onChangeAttachment(e.target.files)}
                                        style={{ display: "none" }}
                                        type="file"
                                    />
                                    {
                                        <IconButton
                                            disabled={waitUploadFile || disableInput}
                                            onClick={onClickAttachment}
                                            style={{ borderRadius: "0px" }}
                                        >
                                            <AttachFileIcon color="primary" />
                                        </IconButton>
                                    }
                                    {Boolean(attachment) &&
                                        attachment
                                            .split(",")
                                            .map((f: string, i: number) => (
                                                <FilePreview
                                                    key={`attachment-${i}`}
                                                    src={f}
                                                    onClose={(f) => handleCleanMediaInput(f)}
                                                />
                                            ))}
                                    {waitUploadFile && fileAttachment && (
                                        <FilePreview key={`attachment-x`} src={fileAttachment} />
                                    )}
                                </Fragment>
                            </div>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <div className="row-zyx">
                                <FieldEdit
                                    label={t(langKeys.summarize)}
                                    className="col-12"
                                    valueDefault={row?.description || ""}
                                    onChange={(value) => setValue('description', value)}
                                    error={errors?.description?.message}
                                />
                            </div>
                            <div className="row-zyx" style={{ position: 'relative' }}>
                                <>
                                    <FieldEditWithSelect
                                        label={t(langKeys.detail)}
                                        className="col-12"
                                        maxLength={1024}
                                        valueDefault={quickreply}
                                        onChange={(value) => setQuickreply(value)}
                                        inputProps={{
                                            onClick: (e: any) => toggleVariableSelect(e, quickreply, 'variablename', setQuickreply),
                                            onInput: (e: any) => toggleVariableSelect(e, quickreply, 'variablename', setQuickreply),
                                        }}
                                        show={variableHandler.show}
                                        data={datatoshow}
                                        datakey="variablename"
                                        top={variableHandler.top}
                                        left={variableHandler.left}
                                        onClickSelection={(e, value) => selectionVariableSelect(e, value)}
                                        onClickAway={(variableHandler) => setVariableHandler({ ...variableHandler, show: false })}
                                        error={errors?.quickreply?.message}
                                    />
                                    <EmojiPickerZyx
                                        emojisIndexed={EMOJISINDEXED} 
                                        style={{ position: "absolute", bottom: "40px", display: 'flex', justifyContent: 'end', right: 16 }}
                                        onSelect={e => setQuickreply(quickreply + e.native)} />
                                </>
                            </div>
                        </Fragment>
                    )}
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-12"
                            valueDefault={row?.status || "ACTIVO"}
                            onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                            error={errors?.status?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                    </div>
                </div>
            </form>
            <DialogZyx
                open={openDialog}
                title={t(langKeys.organizationclass)}
                buttonText1={t(langKeys.select)}
                buttonText2={t(langKeys.register)}
                buttonText3={t(langKeys.clear)}
                handleClickButton1={() => setOpenDialog(false)}
                handleClickButton2={handleClassificationModal}
                handleClickButton3={() => {setselectedlabel(""); setValue('classificationid', 0);setOpenDialog(false)}}
                >
                <TreeView
                    className={classes.treeviewroot}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    <TreeItemsFromData
                        dataClassTotal={dataClassTotal}
                        setValueTmp={(e) => setValue('classificationid', e)}
                        setselectedlabel={setselectedlabel}
                        setAnchorEl={setAnchorEl}
                        setonclickdelete={setonclickdelete}
                    />
                </TreeView>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        style: {
                            maxHeight: 48 * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    <MenuItem 
                        onClick={() => {
                            if(onclickdelete){
                                if(onclickdelete?.quickreplies !== 0){
                                    dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.warningnoquickreplies) }))  

                                }else{
                                    const callback = () => {
                                        dispatch(execute(deleteClassificationTree(onclickdelete?.key||0)));
                                        dispatch(showBackdrop(true));
                                        setWaitSave(true);
                                    }
                                    dispatch(manageConfirmation({
                                        visible: true,
                                        question: t(langKeys.confirmation_delete),
                                        callback
                                    }))
                                }
                            }
                        }}
                    >
                        <DeleteIcon style={{color:"rgb(119, 33, 173)"}}/>  {t(langKeys.delete)}
                    </MenuItem>
                </Menu>
                <div className="row-zyx">
                </div>
            </DialogZyx>
            <DialogZyxDiv
                open={openClassificationModal}
                title={t(langKeys.tipification)}
                maxWidth="md"
            >
                <DetailTipification
                    data={{row: null, edit: true}}
                    setViewSelected={() => ("")}
                    multiData={multiDataAuxRes.data}
                    fetchData={() => null}
                    externalUse={true}
                    externalType="QUICKREPLY"
                    externalSaveHandler={handleClassificationSave}
                    externalCancelHandler={handleClassificationCancel}
                />
            </DialogZyxDiv>
        </div>
    );
}

const IDQUICKREPLIES="IDQUICKREPLIES"
const Quickreplies: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const [openDialog, setOpenDialog] = useState(false);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [dataUPD, setDataUPD] = useState<any>(null)
    const [insertexcel, setinsertexcel] = useState(false);
    const [mainData, setMainData] = useState<Dictionary[]>([])
    const arrayBread = [
        { id: "view-1", name: t(langKeys.quickreply_plural) },
    ];
    const [anchorEl, setAnchorEl] = useState(null);
    const [onclickdelete, setonclickdelete] = useState<any>(null);
    const open = Boolean(anchorEl);
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    function redirectFunc(view:string){
        setViewSelected(view)
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'quickreplyid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            // viewFunction={() => history.push(`/Quickreplies/${row.Quickreplyid}`)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.review),
                accessor: 'description',
                disableGlobalFilter: true,
                NoFilter: true
            },
            {
                Header: t(langKeys.quickreply_type),
                accessor: 'quickreply_type',
                NoFilter: true,
            },
            {
                Header: t(langKeys.quickresponse),
                accessor: 'bodyText',
                NoFilter: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const { bodyText } = props.cell.row.original || {};                    
                    return bodyText ? (bodyText.length > 100 ? bodyText.slice(0, 100) + "..." : bodyText) : "";
                }
                  
            },
            {
                Header: t(langKeys.classification),
                accessor: 'classificationdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { status } = props.cell.row.original || {};
                    return status ? (t(`status_${status}`.toLowerCase()) || "").toUpperCase() : "";
                }                  
            },

        ],
        [t]
    );

    const fetchData = () => dispatch(getCollection(getQuickrepliesSel(0))); //mainResult.mainData.data

    const fetchMultiData = () => dispatch(getMultiCollection([
        getValuesFromDomain("ESTADOGENERICO"),
        getValuesForTree(),
        getChatflowVariableSel(),
        getValuesFromDomain("TIPORESPUESTARAPIDA"),
        getValuesFromDomain("PRIORIDAD"),
    ]));

    useEffect(() => {
        dispatch(setMemoryTable({
            id: IDQUICKREPLIES
        }))   
        fetchData();
        fetchMultiData(); 
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (!mainResult.mainData.error && !mainResult.mainData.loading)
        {
            setMainData(mainResult.mainData.data.map(item => {
                const {quickreply, quickreply_type, body} = item;
                const parsed_body = new DOMParser().parseFromString(body, 'text/html')
                const bodyText = (quickreply_type || 'REDES SOCIALES') === 'REDES SOCIALES' ? quickreply : parsed_body.body.innerText
                return {
                    ...item,
                    bodyText,
                    quickreply_type: quickreply_type || 'REDES SOCIALES'
                }
            }))
        }
    }, [mainResult.mainData])

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(insertexcel?langKeys.successful_edit: langKeys.successful_delete) }))
                if(!insertexcel){       
                    dispatch(emitEvent({
                        event: 'updateQuickreply',
                        data: {
                            ...dataUPD
                        }
                    }));
                }
                setAnchorEl(null);
                fetchMultiData();
                fetchData();
                setinsertexcel(false)
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleView = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            setDataUPD({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.quickreplyid })
            dispatch(execute(insQuickreplies({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.quickreplyid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    interface importCsvProps {
        classificationid: string,
        favorite: boolean,
        summarize: string,
        quickanswertype: string,
        detail: string,
        status: string
        bodyobject?: string
    }

    const importCSV = async (files: any[]) => {
        setinsertexcel(true)
        const file = files[0];
        if (file) {
            const classificationids = Object.keys(mainResult.multiData.data[1].data.reduce((a,d) => ({...a, [d.classificationid]: d.description}), {}))

            const excelData: importCsvProps[] =  (await uploadExcel(file, undefined) as importCsvProps[])
            const data = excelData.filter((d: importCsvProps) => 
                !['', null, undefined].includes(d.summarize) &&
                !['', null, undefined].includes(d.detail) &&
                ((d.classificationid) ? classificationids.includes(d.classificationid.toString().trim().split('-')[0].split(' ')[0]) : true)
            )
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                dispatch(execute({
                    header: null,
                    detail: data.map((x: importCsvProps) => insQuickreplies({
                        ...x,
                        description: x.summarize, 
                        quickreply: x.detail, 
                        status: x.status || 'ACTIVO', 
                        favorite: x.favorite || false,
                        classificationid: (x.classificationid) ? parseInt(x.classificationid.toString().trim().split('-')[0].split(' ')[0]) : null,
                        operation: "INSERT",
                        type: 'NINGUNO',
                        id: 0,
                        body: (x.quickanswertype === 'CORREO ELECTRONICO') ? x.detail : '<div data-reactroot=""><p><span></span></p></div>',
                        bodyobject: [{ type: "paragraph", children: [{text: (x.quickanswertype === 'CORREO ELECTRONICO')? x.detail || '': ""}]}],
                        quickreply_type: x.quickanswertype || 'CORREO ELECTRONICO',
                        quickreply_priority: '',
                        attachment: ''
                    }))
                }, true));
                setWaitSave(true)
            } else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.error_invaliddata) }))
            }
        }
    }

    const handleTemplate = () => {
        const data = [
            mainResult.multiData.data[1].data.reduce((a,d) => ({...a, [d.classificationid]: d.description}), {}),
            {false: false,true: true},
            {},
            {'REDES SOCIALES': 'REDES SOCIALES', 'CORREO ELECTRONICO': 'CORREO ELECTRONICO'},
            {},
            mainResult.multiData.data[0].data.reduce((a,d) => ({...a, [d.domainvalue]: d.domainvalue}), {}),
        ];
        const header = ['classificationid', 'favorite', 'summarize', 'quickanswertype', 'detail', 'status', ];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }

    if (viewSelected === "view-1") {

        return (
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>            
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    PaperProps={{
                        style: {
                            maxHeight: 48 * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    <MenuItem 
                        onClick={() => {
                            if(onclickdelete){
                                if(onclickdelete?.quickreplies !== 0){
                                    dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.warningnoquickreplies) }))  

                                }else{
                                    const callback = () => {
                                        dispatch(execute(deleteClassificationTree(onclickdelete?.key||0)));
                                        dispatch(showBackdrop(true));
                                        setWaitSave(true);
                                    }
                                    dispatch(manageConfirmation({
                                        visible: true,
                                        question: t(langKeys.confirmation_delete),
                                        callback
                                    }))
                                }
                            }
                        }}
                    >
                        <DeleteIcon style={{color:"rgb(119, 33, 173)"}}/>  {t(langKeys.delete)}
                    </MenuItem>
                </Menu>
                <Fragment>
                    <TableZyx
                        columns={columns}
                        titlemodule={t(langKeys.quickreplies, { count: 2 })}
                        data={mainData}
                        download={true}
                        loading={mainResult.mainData.loading}
                        register={true}
                        importCSV={importCSV}
                        handleTemplate={handleTemplate}
                        handleRegister={handleRegister}
                        onClickRow={handleEdit}
                        pageSizeDefault={IDQUICKREPLIES === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                        initialPageIndex={IDQUICKREPLIES === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                        initialStateFilter={IDQUICKREPLIES === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                        ButtonsElement={()=>
                            <>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    style={{ backgroundColor: "#7721ad" }}
                                    onClick={() => setOpenDialog(true)}
                                    startIcon={<AccountTreeIcon color="secondary" />}
                                >{t(langKeys.opendrilldown)}
                                </Button>
                            </>
                        }
                    />
                    <DialogZyx
                        open={openDialog}
                        title={t(langKeys.organizationclass)}
                        buttonText1={t(langKeys.close)}
                        //buttonText2={t(langKeys.select)}
                        handleClickButton1={() => setOpenDialog(false)}
                        handleClickButton2={() => setOpenDialog(false)}
                    >   
                        <TreeView
                            className={classes.treeviewroot}
                            defaultCollapseIcon={<ExpandMoreIcon />}
                            defaultExpandIcon={<ChevronRightIcon />}
                        >
                            <TreeItemsFromData2
                                dataClassTotal={mainResult.multiData.data[1] && mainResult.multiData.data[1].success ? mainResult.multiData.data[1].data : []}
                                setAnchorEl={setAnchorEl}
                                setonclickdelete={setonclickdelete}
                            />
                        </TreeView>
                        <div className="row-zyx">
                        </div>
                    </DialogZyx>
                </Fragment>
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailQuickreply
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                fetchMultiData={fetchMultiData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

export default Quickreplies;