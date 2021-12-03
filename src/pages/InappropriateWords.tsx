/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect } from 'components';
import { dictToArrayKV, exportExcel, getInappropriateWordsSel, getValuesFromDomain, insarrayInappropriateWords, insInappropriateWords, templateMaker, uploadExcel } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import {
    getCollection, resetAllMain, getMultiCollection,
    execute
} from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface MultiData {
    data: Dictionary[];
    success: boolean;
}
interface DetailInappropriateWordsProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
}
const arrayBread = [
    { id: "view-1", name: "Inappropriate words" },
    { id: "view-2", name: "Inappropriate words detail" }
];

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
}));

const dataClassification: Dictionary = {
    INSULTS: 'INSULTS',
    ENTITIES: 'ENTITIES',
    LINKS: 'LINKS',
    EMOTIONS: 'EMOTIONS',
};

const DetailInappropriateWords: React.FC<DetailInappropriateWordsProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const dataStatus = multiData[1] && multiData[1].success ? multiData[1].data : [];

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row?.inappropriatewordsid|| 0,
            classification: row?.classification||"",
            description: row?.description || '',
            defaultanswer: row?.defaultanswer || '',
            status: row?.status || 'ACTIVO',
            operation: row ? "EDIT" : "INSERT"
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('defaultanswer');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('classification', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
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
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.inappropriatewords).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])
    
    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(insInappropriateWords(data)));
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
        <div style={{width: '100%'}}>
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={arrayBread}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={row ? `${row.description}` : t(langKeys.newinnapropiateword)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center'}}>
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
                        {edit ?
                            <FieldSelect
                                uset={true}    
                                label={t(langKeys.classification)}
                                className="col-12"
                                valueDefault={row ? (row.classification || "") : ""}
                                onChange={(value) => setValue('classification', (value?.domainvalue||""))}
                                error={errors?.classification?.message}
                                data={dictToArrayKV(dataClassification)}
                                optionDesc="value"
                                optionValue="key"
                            />
                            : <FieldView
                                label={t(langKeys.classification)}
                                value={row?.classification || ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.description)} 
                                className="col-12"
                                onChange={(value) => setValue('description', value)}
                                valueDefault={row ? (row.description || "") : ""}
                                error={errors?.description?.message}
                            />
                            : <FieldView
                                label={t(langKeys.description)}
                                value={row ? (row.description || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                            <FieldEdit
                                label={t(langKeys.defaultanswer)} 
                                className="col-12"
                                onChange={(value) => setValue('defaultanswer', value)}
                                valueDefault={row ? (row.defaultanswer || "") : ""}
                                error={errors?.defaultanswer?.message}
                            />
                            : <FieldView
                                label={t(langKeys.defaultanswer)}
                                value={row ? (row.defaultanswer || "") : ""}
                                className="col-12"
                            />}
                    </div>
                    <div className="row-zyx">
                        {edit ?
                        <FieldSelect
                            label={t(langKeys.status)}
                            className="col-12"
                            valueDefault={row?.status || "ACTIVO"}
                            onChange={(value) => setValue('status', (value?value.domainvalue:""))}
                            error={errors?.status?.message}
                            data={dataStatus}
                            uset={true}
                            prefixTranslation="status_"
                            optionDesc="domaindesc"
                            optionValue="domainvalue"
                        />
                        : <FieldView
                            label={t(langKeys.status)}
                            value={row ? (row.status || "") : ""}
                            className="col-12"
                        />}
                    </div>
                </div>
            </form>
        </div>
    );
}

const InappropriateWords: FC = () => {
    // const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [waitImport, setWaitImport] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                accessor: 'userid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
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
                Header: t(langKeys.classification),
                accessor: 'classification',
                NoFilter: true,
                prefixTranslation: '',
                Cell: (props: any) => {
                    const { classification } = props.cell.row.original;
                    return (t(`${classification}`.toLowerCase()) || "").toUpperCase()
                }
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.defaultanswer),
                accessor: 'defaultanswer',
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

    const fetchData = () => dispatch(getCollection(getInappropriateWordsSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([getValuesFromDomain("GRUPOS"), getValuesFromDomain("ESTADOGENERICO")]));
        return () => {
            dispatch(resetAllMain());
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.inappropriatewords).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    useEffect(() => {
        if (waitImport) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(langKeys.successful_transaction) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.inappropriatewords).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [executeResult, waitImport]);

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
            dispatch(execute(insInappropriateWords({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.inappropriatewordsid })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleUpload = async (files: any[]) => {
        const file = files[0];
        if (file) {
            const data: any = (await uploadExcel(file, undefined) as any[])
                .filter((d: any) => !['', null, undefined].includes(d.description)
                    && Object.keys(dataClassification).includes(d.classification)
                );
            if (data.length > 0) {
                const validpk = Object.keys(data[0]).includes('description');
                const keys = Object.keys(data[0]);
                dispatch(showBackdrop(true));
                dispatch(execute(insarrayInappropriateWords(data.reduce((ad: any[], d: any) => {
                    ad.push({
                        ...d,
                        id: d.id || 0,
                        description: (validpk ? d.description : d[keys[0]]) || '',
                        classification: (validpk ? d.classification : d[keys[1]]) || '',
                        defaultanswer: (validpk ? d.defaultanswer : d[keys[2]]) || '',
                        type: 'NINGUNO',
                        status: d.status || 'ACTIVO',
                        operation: d.operation || 'INSERT',
                    })
                    return ad;
                }, []))));
                setWaitImport(true)
            }
        }
    }

    const handleTemplate = () => {
        const data = [dataClassification, {}, {}, mainResult.multiData.data[1].data.reduce((a,d) => ({...a, [d.domainvalue]: d.domainvalue}),{})];
        const header = ['classification', 'description', 'defaultanswer', 'status'];
        exportExcel(t(langKeys.template), templateMaker(data, header));
    }

    if (viewSelected === "view-1") {

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.inappropriatewords, { count: 2 })}
                data={mainResult.mainData.data}
                download={true}
                loading={mainResult.mainData.loading}
                register={true}
                handleRegister={handleRegister}
                importCSV={handleUpload}
                handleTemplate={handleTemplate}
            />
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailInappropriateWords
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
    } else
        return null;

}

export default InappropriateWords;