/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, DialogZyx, FieldEditMulti, TemplateSwitch, DialogZyxDiv } from 'components';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { getQuickrepliesSel, getValuesFromDomain, insQuickreplies, getValuesForTree, uploadExcel, getParentSel, exportExcel, templateMaker,deleteClassificationTree } from 'common/helpers';
import { EmojiPickerZyx } from 'components'
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute, getMultiCollectionAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import DeleteIcon from '@material-ui/icons/Delete';

import ClearIcon from '@material-ui/icons/Clear';
import { TreeItem, TreeView } from '@material-ui/lab';
import { IconButton, Input, InputAdornment, InputLabel, Menu, MenuItem } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { DetailTipification } from './Tipifications';
import { useHistory } from 'react-router-dom';
import paths from 'common/constants/paths';
import {
    MoreVert as MoreVertIcon,
} from '@material-ui/icons';

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
    treelabels: {display:"flex",justifyContent:"space-between"}
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

const DetailQuickreply: React.FC<DetailQuickreplyProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, fetchMultiData,arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [selectedlabel, setselectedlabel] = useState(row ? row.classificationdesc : "")
    const [quickreply, setQuickreply] = useState(row ? row.quickreply : "")
    const executeRes = useSelector(state => state.main.execute);
    const multiDataAuxRes = useSelector(state => state.main.multiDataAux)
    const [anchorEl, setAnchorEl] = useState(null);
    const [onclickdelete, setonclickdelete] = useState<any>(null);
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

    
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            communicationchannelid: row?.communicationchannelid || 0,
            classificationid: row?.classificationid || 0,
            id: row?.quickreplyid || 0,
            quickreply: row?.quickreply || '',
            description: row?.description || '',
            favorite: row?.favorite || false,
            status: row?.status || 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        setValue('quickreply', quickreply)
    }, [quickreply]);
    React.useEffect(() => {
        register('communicationchannelid');
        register('type');
        register('id');
        register('favorite');
        register('classificationid');//, { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('quickreply', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                fetchMultiData();
                if(open){
                    setAnchorEl(null);
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))                    
                    dispatch(showBackdrop(false));
                }else{

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

    
    const onSubmit = handleSubmit((data) => {
        //data.communicationchannelid = selected.key
        const callback = () => {
            dispatch(execute(insQuickreplies(data))); //executeRes
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }
        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

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
                        </div>}
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
                            <FieldEditMulti
                                label={t(langKeys.detail)}
                                className="col-12"
                                valueDefault={quickreply}
                                onChange={(value) => setQuickreply(value)}
                                error={errors?.quickreply?.message}
                                maxLength={1024}
                            />
                            <EmojiPickerZyx
                                style={{ position: "absolute", bottom: "40px", display: 'flex', justifyContent: 'end', right: 16 }}
                                onSelect={e => setQuickreply(quickreply + e.native)} />

                        </>
                    </div>
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

const Quickreplies: FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [openDialog, setOpenDialog] = useState(false);
    const classes = useStyles();
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [insertexcel, setinsertexcel] = useState(false);
    const arrayBread = [
        { id: "view-0", name: t(langKeys.configuration_plural) },
        { id: "view-1", name: t(langKeys.quickreply_plural) },
    ];
    const [anchorEl, setAnchorEl] = useState(null);
    const [onclickdelete, setonclickdelete] = useState<any>(null);
    const open = Boolean(anchorEl);
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    function redirectFunc(view:string){
        if(view ==="view-0"){
            history.push(paths.CONFIGURATION)
            return;
        }
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
                Cell: (props: any) => {
                    const row = props.cell.row.original;
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
                NoFilter: true
            },
            {
                Header: t(langKeys.quickresponse),
                accessor: 'quickreply',
                NoFilter: true
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
                Cell: (props: any) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },

        ],
        [t]
    );

    const fetchData = () => dispatch(getCollection(getQuickrepliesSel(0))); //mainResult.mainData.data

    const fetchMultiData = () => dispatch(getMultiCollection([
        getValuesFromDomain("ESTADOGENERICO"),
        getValuesForTree()
    ]));

    useEffect(() => {
        fetchData();
        fetchMultiData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(insertexcel?langKeys.successful_edit: langKeys.successful_delete) }))
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
    const importCSV = async (files: any[]) => {
        setinsertexcel(true)
        const file = files[0];
        if (file) {
            debugger
            let classificationids = Object.keys(mainResult.multiData.data[1].data.reduce((a,d) => ({...a, [d.classificationid]: d.description}), {}))
            let data: any = (await uploadExcel(file, undefined) as any[])
                .filter((d: any) => !['', null, undefined].includes(d.summarize)
                    && !['', null, undefined].includes(d.detail)
                    && classificationids.includes(d.classificationid.toString().trim().split('-')[0].split(' ')[0])
                );
            debugger
            if (data.length > 0) {
                dispatch(showBackdrop(true));
                dispatch(execute({
                    header: null,
                    detail: data.map((x: any) => insQuickreplies({
                        ...x,
                        description: x.summarize, 
                        quickreply: x.detail, 
                        status: x.status || 'ACTIVO', 
                        favorite: x.favorite || false,
                        classificationid: parseInt(x.classificationid.toString().trim().split('-')[0].split(' ')[0]),
                        operation: "INSERT",
                        type: 'NINGUNO',
                        id: 0,
                    }))
                }, true));
                setWaitSave(true)
            }else{
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.error_invaliddata) }))
            }
        }
    }

    const handleTemplate = () => {
        const data = [
            mainResult.multiData.data[1].data.reduce((a,d) => ({...a, [d.classificationid]: d.description}), {}),
            {false: false,true: true},
            {},
            {},
            mainResult.multiData.data[0].data.reduce((a,d) => ({...a, [d.domainvalue]: d.domainvalue}), {}),
        ];
        const header = ['classificationid', 'favorite', 'summarize', 'detail', 'status', ];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }

    if (viewSelected === "view-1") {

        return (
            <div style={{width:"100%"}}>
                <div style={{ display: 'flex',  justifyContent: 'space-between',  alignItems: 'center'}}>
                    <TemplateBreadcrumbs
                        breadcrumbs={arrayBread}
                        handleClick={redirectFunc}
                    />
                </div>
            
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
                        data={mainResult.mainData.data}
                        download={true}
                        loading={mainResult.mainData.loading}
                        register={true}
                        importCSV={importCSV}
                        handleTemplate={handleTemplate}
                        handleRegister={handleRegister}
                        onClickRow={handleEdit}
                        ButtonsElement={()=>
                            <>
                                <Button
                                    disabled={mainResult.mainData.loading}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    onClick={() => history.push(paths.CONFIGURATION)}
                                >{t(langKeys.back)}</Button>
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