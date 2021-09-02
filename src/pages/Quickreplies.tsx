/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, DialogZyx } from 'components';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { getQuickrepliesSel, getValuesFromDomain, insQuickreplies, getValuesForTree } from 'common/helpers';

import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';

import ClearIcon from '@material-ui/icons/Clear';
import { TreeItem, TreeView } from '@material-ui/lab';
import { IconButton, Input, InputAdornment, InputLabel } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

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
}
const arrayBread = [
    { id: "view-1", name: "Quickreplies" },
    { id: "view-2", name: "Quickreply detail" }
];
const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        maxWidth: '80%',
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
    }
}));


const TreeItemsFromData: React.FC<{ dataClassTotal: Dictionary, setValueTmp: (p1: number) => void, setselectedlabel: (param: any) => void }> = ({ dataClassTotal, setValueTmp, setselectedlabel }) => {
    const parents: any[] = []
    const children: any[] = []

    dataClassTotal.forEach((x: Dictionary) => {
        if (x.parent === 0) {
            let item = {
                key: x.classificationid,
                nodeId: x.classificationid.toString(),
                label: x.description.toString(),
                children: x.haschildren
            }
            parents.push(item)// = [...parents, item])
        } else {
            let item = {
                key: x.classificationid,
                nodeId: x.classificationid.toString(),
                label: x.description.toString(),
                children: x.haschildren,
                father: x.parent
            }
            children.push(item)
        }
    })
    
    function setselect(x: Dictionary) {
        setValueTmp(x.key)
        setselectedlabel(x.label)
    }

    function loadchildren(id: number) {
        return children.map(x => {
            if (x.father === id) {
                return (
                    <TreeItem
                        key={x.key}
                        nodeId={String(x.nodeId)}
                        label={x.label}
                        onLabelClick={() => setselect(x)}
                    >
                        {x.children ? loadchildren(x.key) : null}
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
                    label={x.label}
                    onLabelClick={() => setselect(x)}
                >
                    {x.children ? loadchildren(x.key) : null}
                </TreeItem>)}
        </>
    )
};

const DetailQuickreply: React.FC<DetailQuickreplyProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [selectedlabel, setselectedlabel] = useState(row ? row.classificationdesc : "")
    const executeRes = useSelector(state => state.main.execute);
    const user = useSelector(state => state.login.validateToken.user);
    const dispatch = useDispatch();

    const [openDialog, setOpenDialog] = useState(false);

    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataClassTotal = multiData[1] && multiData[1].success ? multiData[1].data : [];


    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            communicationchannelid: row?.communicationchannelid || 0,
            classificationid: row ? row.classificationid : 0,
            id: row?.quickreplyid || 0,
            quickreply: row?.quickreply || '',
            description: row ? (row.description || '') : '',
            status: row ? row.status : 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('communicationchannelid');
        register('type');
        register('id');
        register('classificationid');//, { validate: (value) => (value && value>0) || t(langKeys.field_required) });
        register('quickreply', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])


    const onSubmit = handleSubmit((data) => {
        //data.communicationchannelid = selected.key
        console.log(data)
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

    return (
        <div style={{ width: '100%' }}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={row ? `${row.description}` : t(langKeys.newquickreply)}
            />
            <form onSubmit={onSubmit}>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.corporation)} // "Corporation"
                                className="col-12"
                                valueDefault={row ? (row.corpdesc || "") : user?.corpdesc}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.corporation)}
                                value={row ? (row.corpdesc || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.organization)} // "Organization"
                                className="col-12"
                                valueDefault={row ? (row.orgdesc || "") : user?.orgdesc}
                                disabled={true}
                            />
                            : <FieldView
                                label={t(langKeys.organization)}
                                value={row ? (row.orgdesc || "") : ""}
                                className="col-12"
                            />}
                    </div>
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
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.summarize)}
                                className="col-12"
                                valueDefault={row?.description || ""}
                                onChange={(value) => setValue('description', value)}
                                error={errors?.description?.message}
                            /> :
                            <FieldView
                                label={t(langKeys.summarize)}
                                value={row?.description || ""}
                                className="col-6"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.detail)}
                                className="col-12"
                                valueDefault={row ? (row.quickreply || "") : ""}
                                onChange={(value) => setValue('quickreply', value)}
                                error={errors?.quickreply?.message}
                            />
                            : <FieldView
                                label={t(langKeys.detail)}
                                value={row ? (row.quickreply || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldSelect
                                label={t(langKeys.status)}
                                className="col-12"
                                valueDefault={row ? (row.status || "") : ""}
                                onChange={(value) => setValue('status', value? value.domainvalue: '')}
                                error={errors?.status?.message}
                                data={dataStatus}
                                optionDesc="domaindesc"
                                optionValue="domainvalue"
                            />
                            : <FieldView
                                label={t(langKeys.status)}
                                value={row ? (row.status || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
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
            </form>
            <DialogZyx
                open={openDialog}
                title={t(langKeys.organizationclass)}
                buttonText1={t(langKeys.select)}
                //buttonText2={t(langKeys.select)}
                handleClickButton1={() => setOpenDialog(false)}
                handleClickButton2={() => setOpenDialog(false)}
            >   <TreeView
                className={classes.treeviewroot}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                    <TreeItemsFromData
                        dataClassTotal={dataClassTotal}
                        setValueTmp={(e) => setValue('classificationid', e)}
                        setselectedlabel={setselectedlabel}
                    />
                </TreeView>
                <div className="row-zyx">
                </div>
            </DialogZyx>
        </div>
    );
}

const Quickreplies: FC = () => {
    // const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.quickreply),
                accessor: 'quickreply',
                NoFilter: true
            },
            {
                Header: t(langKeys.review),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'statusdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true
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
                Header: t(langKeys.action),
                accessor: 'quickreplyid',
                NoFilter: true,
                isComponent: true,
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
        ],
        [t]
    );

    const fetchData = () => dispatch(getCollection(getQuickrepliesSel(0))); //mainResult.mainData.data

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getValuesForTree()
        ])); //mainResult.multiData.data
        return () => {
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.quickreplies).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
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

    if (viewSelected === "view-1") {

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.quickreplies, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
            // fetchData={fetchData}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailQuickreply
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default Quickreplies;