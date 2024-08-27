import React, { FC, Fragment, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldMultiSelect, TemplateSwitch, FieldEditMulti, DialogZyx } from 'components';
import { getParentSel, getValuesFromDomain, getClassificationSel, insClassification, uploadExcel, getValuesForTree, exportExcel, templateMaker, getCatalogMasterList, insarrayClassification } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useForm } from 'react-hook-form';
import { getCollection, resetAllMain, getMultiCollection, execute, setMemoryTable, cleanMemoryTable } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { TreeItem, TreeView } from '@material-ui/lab';
import { EmojiPickerZyx } from 'components'
import { CellProps } from 'react-table';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailTipificationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
    externalUse?: boolean;
    externalType?: string;
    externalSaveHandler?: ({...param}?: any) => void;
    externalCancelHandler?: ({...param}?: any) => void;
    arrayBread?:any;
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
    title: {
        fontSize: '22px',
        lineHeight: '48px',
        height: '48px',
        color: theme.palette.text.primary,
    },
    halfplace: {
        width: "50%",
    },
    dataaction: {
        width: "100%",
        paddingBottom: "20px",
    },
    treeviewroot: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    }
}));

const dataTypeAction = [
    { dat: "Simple" },
    { dat: "Variable" },
    { dat: "Request" }
]

const TreeItemsFromData: React.FC<{ dataClassTotal: Dictionary}> = ({ dataClassTotal }) => {
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
                nodeId: x.classificationid?.toString(),
                label: x.description?.toString(),
                children: x.haschildren,
                father: x.parent
            }
            children.push(item)
        }
    })

    function loadchildren(id: number) {
        return children.map(x => {
            if (x.father === id) {
                return (
                    <TreeItem
                        key={x.key}
                        nodeId={String(x.nodeId)}
                        label={x.label}
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
                >
                    {x.children ? loadchildren(x.key) : null}
                </TreeItem>)}
        </>
    )
};

export const DetailTipification: React.FC<DetailTipificationProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData, externalUse = false, externalType, externalSaveHandler, externalCancelHandler,arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [description, setDescription] = useState(row?.description||"");
    const [order, setOrder] = useState(row?.order||"");
    const [type, seType] = useState(externalUse ? externalType : (row?.type || "TIPIFICACION"));
    const [auxVariables, seauxVariables] = useState({
        communicationchannel: row?.communicationchannel || "",
        tags: row?.tags || "",
        order: row?.order || "",
        parent: row?.parentid || 0,
    });
    const validjobplan = JSON.parse(row?.jobplan||"[]").every((item:any) => 'action' in item && 'type' in item);
    const [showAddAction, setShowAddAction] = useState(!!JSON.parse(row?.jobplan||"[]").length && validjobplan || false);
    const [jobplan, setjobplan] = useState<Dictionary[]>((row && row.jobplan && validjobplan) ? JSON.parse(row.jobplan) : [])

    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[0] && multiData[0].success ? multiData[0].data : [];
    const dataParent = multiData[3] && multiData[3].success ? multiData[3].data.filter(x=>x.type===type) : [];

    const datachannels = multiData[2] && multiData[2].success ? multiData[2].data : [];

    const filteredChannels = datachannels
    .filter((channel) => channel && channel.domaindesc)     
    .reduce((filteredChannels, channel) => {
      let isUnique = true;
      filteredChannels.forEach((uniqueChannel: Dictionary) => {
        if (uniqueChannel.domaindesc === channel.domaindesc) {
          isUnique = false;
        }
      });  
      if (isUnique) {
        filteredChannels.push(channel);
      }  
      return filteredChannels;
    }, [] as Dictionary[]);

    const datamastercatalog = multiData[4] && multiData[4].success ? multiData[4].data : [];
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            type: externalUse ? externalType : (row?.type || "TIPIFICACION"),
            id: row?.classificationid || 0,
            description: edit? (row?.description) : '',
            title: row?.title || '',
            parent: row?.parentid || 0,
            communicationchannel: row?.communicationchannel || '',
            status: row?.status || 'ACTIVO',
            operation: row ? "EDIT" : "INSERT",
            path: row?.path || '',
            tags: row?.tags || '',
            order: row?.order || '',
            metacatalogid: row?.metacatalogid || 0,
        }
    });

    React.useEffect(() => {
        register('id');
        register('title', { validate: {
            noempty: (value) => (value && value.length) || t(langKeys.field_required),
            limit: (value) => (getValues("type") === "CATEGORIA")? ((value && value.length && value.length<= 50) || t(langKeys.limit50char)): true,
        }});
        register('description', { validate: {
            noempty: (value) => (value && value.length) || t(langKeys.field_required),
            limit: (value) => (getValues("type") === "CATEGORIA")? ((value && value.length && value.length <= 75) || t(langKeys.limit20char)): true,
        }});
        register('parent');
        register('communicationchannel', { validate: {
            typeclassification: (value) => (getValues("type") !== "CATEGORIA")? ((value && value.length) || t(langKeys.field_required)): true,
        }});
        register('status', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('type', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('path');
        register('tags');
        register('order');
        register('metacatalogid');
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                if (externalUse) {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                    dispatch(showBackdrop(false));
                    externalSaveHandler && externalSaveHandler();
                }
                else {
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                    fetchData();
                    dispatch(showBackdrop(false));
                    setViewSelected("view-1")
                }
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.classification).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])
   
    function addaction() {
        setjobplan((p) => [...p, { action: "", type: "Simple" }])
    }
    function deleteitem(i: number) {
        setjobplan(jobplan.filter((e, index) => index !== i))
    }
    function setValueAction(field: string, value: string, i: number) {
        setjobplan((p: Dictionary[]) => p.map((x, index) => index === i ? { ...x, [field]: value } : x))
    }
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insClassification({ ...data, jobplan: JSON.stringify(jobplan), order: order||"1", title: data.title.trim() })));
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
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {!externalUse ?
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread,{ id: "view-2", name: `${t(langKeys.tipification)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.title}` : t(langKeys.tipification)}
                        />
                    </div>
                    : <div></div>}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => {
                                if (externalUse)
                                    externalCancelHandler && externalCancelHandler();
                                else
                                    setViewSelected("view-1")
                            }}
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
                        <FieldEdit
                            label={t(langKeys.classification)}
                            className="col-6"
                            onChange={(value) => setValue('title', value)}
                            valueDefault={row?.title || ""}
                            error={errors?.title?.message}
                        />
                        <div className='col-6' style={{ position: 'relative' }}>
                            <>        
                                <FieldEdit
                                    label={t(langKeys.description)}
                                    onChange={(value) => {setDescription(value);setValue('description', value)}}
                                    valueDefault={description}
                                    error={errors?.description?.message}
                                />        
                                <EmojiPickerZyx
                                    bottom={-370}
                                    style={{ position: "absolute", top: "25px", display: 'flex', justifyContent: 'end', right: 16 }}
                                    onSelect={e => {setDescription(description + e.native);setValue('description', description + e.native)}} />
    
                            </>
                        </div>
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.parent)}
                            className="col-6"
                            valueDefault={auxVariables.parent}
                            onChange={(value) => {
                                setValue('parent', value?.classificationid || 0)
                                seauxVariables({...auxVariables, parent: value?.classificationid || 0})
                            }}
                            error={errors?.parent?.message}
                            data={dataParent}
                            optionDesc="description"
                            optionValue="classificationid"
                        />
                        <FieldEdit
                            label={t(langKeys.path)}
                            className="col-6"
                            valueDefault={row?.path || ""}
                            onChange={(value) => setValue('path', value)}
                            error={errors?.path?.message}
                            disabled={true}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-6"
                            valueDefault={row?.status || "ACTIVO"}
                            onChange={(value) => setValue('status', value?.domainvalue || '')}
                            error={errors?.status?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        {!externalUse && <FieldSelect
                                label={t(langKeys.type)}
                                className="col-6"
                                valueDefault={type}
                                onChange={(value) => {
                                    setValue('communicationchannel', "")
                                    setValue('tags', "")
                                    setValue('order', "")
                                    setValue('parent', 0)
                                    seauxVariables({
                                        communicationchannel: "",
                                        tags: "",
                                        order: "",
                                        parent: 0,
                                    })
                                    setValue('type', value?.value || ''); 
                                    seType(value?.value || '')
                                }}
                                error={errors?.type?.message}
                                data={[
                                    {value: "CATEGORIA", desc: t(langKeys.category)},
                                    {value: "TIPIFICACION", desc: t(langKeys.tipification)},
                                ]}
                                uset={true}
                                optionDesc="desc"
                                optionValue="value"
                            />
                        }
                    </div>
                    {(type === "TIPIFICACION"|| externalUse) &&
                    <div className="row-zyx">
                        <FieldMultiSelect
                            label={t(langKeys.channel_plural)}
                            className="col-6"
                            onChange={(value) => {
                                const selectedChannels = value.map((o: Dictionary) => o.domainvalue);
                                const selectedDescriptions = value.map((o: Dictionary) => o.domaindesc);
                        
                                // Buscar otros domainvalue con la misma descripción
                                const additionalChannels = datachannels
                                    .filter((channel) => selectedDescriptions.includes(channel.domaindesc) && !selectedChannels.includes(channel.domainvalue))
                                    .map((channel) => channel.domainvalue);
                        
                                // Combinar todos los domainvalue seleccionados
                                const allSelectedChannels = [...selectedChannels, ...additionalChannels];
                        
                                setValue('communicationchannel', allSelectedChannels.join());
                                seauxVariables({...auxVariables, communicationchannel: allSelectedChannels.join()});
                            }}
                            valueDefault={auxVariables.communicationchannel}
                            error={errors?.communicationchannel?.message}
                            data={filteredChannels as Dictionary[]}
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        <FieldEdit
                            label={t(langKeys.tag)}
                            className="col-6"
                            valueDefault={row?.tags || ""}
                            onChange={(value) => setValue('tags', value)}
                            error={errors?.tags?.message}
                        />
                    </div>}
                    {type === "CATEGORIA" &&
                    <>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.order)}
                                className="col-6"
                                type="number"
                                valueDefault={order}
                                error={errors?.order?.message}
                                onChange={(value) => {
                                    setOrder(value)
                                    setValue('order', value)
                                }}
                                InputProps={{
                                    inputProps: { min: 1,step: "1" }
                                }}
                            />
                            <FieldSelect
                                label={t(langKeys.catalogmaster)}
                                className="col-6"
                                valueDefault={row?.metacatalogid || 0}
                                onChange={(value) => {
                                    setValue('metacatalogid', value?.metacatalogid || 0); 
                                }}
                                data={datamastercatalog} //falta llenar la lista de maestro de catalogos
                                optionDesc="catalogname"
                                optionValue="metacatalogid"
                            />
                        </div>                        
                    </>
                    }                    
                    {(type === "TIPIFICACION"|| externalUse) &&
                    <>
                        <div style={{ marginBottom: '16px' }}>
                            <div className={classes.title}>{t(langKeys.actionplan)}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {edit ?
                                    <TemplateSwitch
                                        // className={classes.halfplace}
                                        label={t(langKeys.hasactionplan)}
                                        valueDefault={showAddAction ? "x" : ""}
                                        onChange={(value) => setShowAddAction(value)}
                                    /> :
                                    <FieldView
                                        label={t(langKeys.default_organization)}
                                        value={row ? (row.bydefault ? t(langKeys.affirmative) : t(langKeys.negative)) : t(langKeys.negative)}
                                    />
                                }
                                {(edit && showAddAction) &&
                                    <div>
                                        <Button
                                            variant="contained"
                                            type="button"
                                            color="primary"
                                            endIcon={<AddIcon style={{ color: "#deac32" }} />}
                                            style={{ backgroundColor: "#6c757d" }}
                                            onClick={() => addaction()}
                                        >{t(langKeys.action)}
                                        </Button>
                                    </div>
                                }
                            </div>

                            {
                                (edit && showAddAction) && jobplan.map((e: any, i: number) => (
                                    <div className="row-zyx" key={i}>
                                        <FieldEdit
                                            label={t(langKeys.action)}
                                            className="col-6"
                                            valueDefault={e.action ? e.action : ""}
                                            onChange={(value) => setValueAction('action', value, i)}
                                        />
                                        <FieldSelect
                                            label={t(langKeys.type)}
                                            className="col-5"
                                            valueDefault={e.type ? e.type : "Simple"}
                                            //onChange={(value) => setValue('status', value ? value.domainvalue : '')}
                                            error={errors?.status?.message}
                                            data={dataTypeAction}
                                            optionDesc="dat"
                                            optionValue="dat"
                                            onChange={(value) => setValueAction('type', value.dat, i)}
                                        />
                                        <div className="col-1" style={{ paddingTop: "15px" }}>
                                            <IconButton aria-label="delete" onClick={() => deleteitem(i)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                        {e.type === "Variable" ?
                                            <FieldEdit
                                                label={t(langKeys.variable)}
                                                className={classes.dataaction}
                                                valueDefault={e.variable ? e.variable : ""}
                                                onChange={(value) => setValueAction('variable', value, i)}
                                            />

                                            : null}
                                        {e.type === "Request" ?
                                            <div>
                                                <FieldEdit
                                                    label={t(langKeys.endpoint)}
                                                    className={classes.dataaction}
                                                    valueDefault={e.endpoint ? e.endpoint : ""}
                                                    onChange={(value) => setValueAction('endpoint', value, i)}
                                                />
                                                <FieldEditMulti
                                                    label={t(langKeys.data)}
                                                    className={classes.dataaction}
                                                    valueDefault={e.data ? e.data : ""}
                                                    onChange={(value) => setValueAction('data', value, i)}
                                                    maxLength={2048}
                                                />

                                            </div>
                                            : null}
                                        <hr></hr>
                                    </div>
                                ))
                            }

                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>

                        </div>
                    </>}
                </div>
            </form>
        </div>
    );
}

const IDTIPIFICATION = "IDTIPIFICATION"

const Tipifications: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const classes = useStyles();
    const memoryTable = useSelector(state => state.main.memoryTable);
    const [openDialog, setOpenDialog] = useState(false);
    const [tableData, setTableData] = useState<any>([]);

    const [generalFilter, setGeneralFilter] = useState("");
    const [invalidImportData, setInvalidImportData] = useState<any>([]);
    const [insertexcel, setinsertexcel] = useState(false);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [cleanImport, setCleanImport] = useState(false);
    const arrayBread = [
        { id: "view-1", name: t(langKeys.classification_plural) },
    ];
    function redirectFunc(view:string){
        setViewSelected(view)
    }

    const fetchData = () => {
        dispatch(getCollection(getClassificationSel(0)));
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
            getParentSel(),
            getValuesFromDomain("TIPOCANAL"),
            getValuesForTree("TIPIFICACION"),
            getCatalogMasterList(),
        ]));
    };

    useEffect(() => {
        fetchData();
        dispatch(setMemoryTable({
            id: IDTIPIFICATION
        }))
        
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(resetAllMain());
        };
    }, []);
    useEffect(() => {
        if(!mainResult.mainData.loading && !mainResult.mainData.error){
            setTableData(mainResult.mainData.data.map(x=>({...x, type2: x.type==="TIPIFICACION"?"Clasificación":"Categoría", order2: x.type === 'CATEGORIA'? x.order:""})))
        }
    }, [mainResult.mainData]);

    const columns = React.useMemo(
        () => [

            {
                accessor: 'classificationid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original  || {};
                    return (
                        <TemplateIcons
                            viewFunction={() => handleView(row)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.title),
                accessor: 'title',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.type),
                accessor: 'type2',
            },
            {
                Header: t(langKeys.app_productcatalog),
                accessor: 'catalogname',
                NoFilter: true,
            },
            {
                Header: t(langKeys.parent),
                accessor: 'parentdesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.order),
                accessor: 'order2',
                NoFilter: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original || {};
                    if(row.type === 'CATEGORIA') return row.order
                    else return ''
                }
            },
            {
                Header: t(langKeys.tag),
                accessor: 'tags',
                NoFilter: true
            },

            {
                Header: t(langKeys.channel),
                accessor: 'communicationchanneldesc',
                NoFilter: true
            },
            {
                Header: t(langKeys.status),
                accessor: 'statusdesc',
                NoFilter: true,
                prefixTranslation: 'status_',
                Cell: (props: CellProps<Dictionary>) => {
                    const { status } = props.cell.row.original || {};
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            }
        ],
        []
    );

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                if(invalidImportData.length){
                    const messageerror = invalidImportData.reduce((acc, x) => acc + t(langKeys.error_estructure_tipification, { classification: x.classification }) + `\n`, "")
                    dispatch(showSnackbar({ show: true, severity: "error", message: messageerror }))
                }else{
                    dispatch(showSnackbar({ show: true, severity: "success", message: t(insertexcel?langKeys.successful_edit: langKeys.successful_delete) }))
                }
                setInvalidImportData([])
                setinsertexcel(false)
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.tipification).toLocaleLowerCase() })
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
            dispatch(execute(insClassification({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.classificationid, parent: row.parentid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const importCSV = async (files: Dictionary[]) => {
        const file = files[0];
        if (file) {
            let data: Dictionary = (await uploadExcel(file, undefined) as Dictionary[])
            data = data.map((item:any) => ({
                ...item,
                classification: (item?.classification|| "").replace(/\s+/g, ''), 
                channels: !!item.channels?String(item.channels).replace(/\s+/g, '').replace(/;/g, ','):item.channels,
                type: (item.type.toLowerCase() === "clasificación" || item.type.toLowerCase() === "clasificacion") ? 'TIPIFICACION': ((item.type.toLowerCase() === "categoría" || item.type.toLowerCase() === "categoria")?"CATEGORIA":item.type),
            }));
            const invaliddata = data.filter((d: any) => {
                const channelList = filteredChannels.map((x: any)=>x.domainvalue)
                const hasValidClassification = d.classification !== '' && d.classification != null;
                const hasValidChannels = d.type === "TIPIFICACION"?d.channels !== '' && d.channels != null && d.channels.split(',').every((channel:any) => channelList.includes(channel)):true
                const hasValidType = d.type === "TIPIFICACION" || d.type === "CATEGORIA"
                const parentExists = ['', null, undefined].includes(d.parent) || 
                    Object.keys(mainResult.multiData.data[1].data.reduce((acc, item) => ({ ...acc, [item.classificationid]: item.title }), {0: ''}))
                    .includes(String(d.parent));
            
                return !hasValidClassification || !hasValidChannels || !parentExists || !hasValidType;
            });   
            data=data.filter((d: any) => {
                const channelList = filteredChannels.map((x: any)=>x.domainvalue)
                const hasValidClassification = d.classification !== '' && d.classification != null;
                const hasValidChannels = d.type === "TIPIFICACION"?d.channels !== '' && d.channels != null && d.channels.split(',').every((channel:any) => channelList.includes(channel)):true
                const hasValidType = d.type === "TIPIFICACION" || d.type === "CATEGORIA"
                const parentExists = ['', null, undefined].includes(d.parent) || 
                    Object.keys(mainResult.multiData.data[1].data.reduce((acc, item) => ({ ...acc, [item.classificationid]: item.title }), {0: ''}))
                    .includes(String(d.parent));
            
                return hasValidClassification && hasValidChannels && parentExists && hasValidType;
            });
            setInvalidImportData(invaliddata)    
            if (data.length > 0) {
                dispatch(execute(insarrayClassification(data.reduce((ad: any[], x: any) => {
                    ad.push({
                        ...x,
                        title: x.classification.trim(),
                        description: x.description,
                        communicationchannel: x.type === "TIPIFICACION"?x.channels:"",
                        jobplan: JSON.stringify([{action: x.action, type: x.type, variable: x.variable, endpoint: x.endpoint, data: x.data}]),
                        tags: x.tag || '',
                        parent: x.parent || 0,
                        operation: "INSERT",
                        order: x.type === "TIPIFICACION" ? '0':"1",
                        status: x?.status || "ACTIVO",
                        id: 0,
                    })
                    return ad;
                }, []))));
                dispatch(showBackdrop(true));
                setinsertexcel(true)
                setWaitSave(true)
            }else{
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.error_invaliddata) }))
            }
            setCleanImport(!cleanImport)
        }
    }

    const datachannels = mainResult?.multiData?.data?.[2]?.data || [];

    const filteredChannels = datachannels
    .filter((channel) => channel && channel.domaindesc)     
    .reduce((filteredChannels, channel) => {
      let isUnique = true;
      filteredChannels.forEach((uniqueChannel: Dictionary) => {
        if (uniqueChannel.domaindesc === channel.domaindesc) {
          isUnique = false;
        }
      });  
      if (isUnique) {
        filteredChannels.push(channel);
      }  
      return filteredChannels;
    }, [] as Dictionary[]);

    const dataTypeAction = [
        { dat: "Simple" },
        { dat: "Variable" },
        { dat: "Request" }
    ]

    const dataType = [
        { dat: "Categoria" },
        { dat: "Clasificación" },       
    ]

    const handleTemplate = () => {
        const data = [
          {},
          {},
          dataType.reduce((a, d) => ({ ...a, [d.dat]: d.dat }), {}),
          filteredChannels.reduce((a:any, d:any) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
          {},
          mainResult.multiData.data[3].data.reduce((a, d) => ({ ...a, [d.classificationid]: d.description }), { 0: '' }),
          mainResult.multiData.data[0].data.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domainvalue }), {}),
          {},
          dataTypeAction.reduce((a, d) => ({ ...a, [d.dat]: d.dat }), {}),
          {},
          {},
          {},
        ];    
        
        const header = ['classification', 'description', 'type', 'channels', 'tag', 'parent', 'status', 'action', 'action plan type', 'variable', 'endpoint', 'data'];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }
      
      

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Fragment>
                    <TableZyx
                        columns={columns}
                        titlemodule={t(langKeys.tipification, { count: 2 })}
                        data={tableData}
                        loading={mainResult.mainData.loading}
                        download={true}
                        register={true}
                        onClickRow={handleEdit}
                        importCSV={importCSV}
                        handleTemplate={handleTemplate}
                        handleRegister={handleRegister}
                        cleanImport={cleanImport}
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
                        defaultGlobalFilter={generalFilter}
                        setOutsideGeneralFilter={setGeneralFilter}
                        pageSizeDefault={IDTIPIFICATION === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                        initialPageIndex={IDTIPIFICATION === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                        initialStateFilter={IDTIPIFICATION === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
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
                            <TreeItemsFromData
                                dataClassTotal={mainResult.multiData.data[3] && mainResult.multiData.data[3].success ? mainResult.multiData.data[3].data : []}
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
            <DetailTipification
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}
export default Tipifications;
