import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldEdit } from 'components';
import { getInputValidationSel, inputValidationins } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useForm } from 'react-hook-form';
import { getCollection, resetAllMain, execute, setMemoryTable, cleanMemoryTable } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { DuplicateIcon } from 'icons';
import { CellProps } from 'react-table';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}
interface DetailInputValidationProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    fetchData: () => void;
    arrayBread: Array<{ id: string, name: string }>;
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
}));

const DetailInputValidation: React.FC<DetailInputValidationProps> = ({ data: { row, edit }, setViewSelected, fetchData, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const executeRes = useSelector(state => state.main.execute);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: edit ? (row?.inputvalidationid || 0) : 0,
            description: edit ? (row?.description || "") : "",
            inputvalue: row?.inputvalue || '',
            operation: edit ? (row ? "EDIT" : "INSERT") : "INSERT",
            status: "ACTIVO",
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('description', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('inputvalue', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: `23505: ${t(langKeys.inputvalidationerror)}` }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(execute(inputValidationins(data)));
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
                    <div>
                        <TemplateBreadcrumbs
                            breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.inputvalidation)} ${t(langKeys.detail)}` }]}
                            handleClick={setViewSelected}
                        />
                        <TitleDetail
                            title={edit ? (row ? `${row.description}` : t(langKeys.newinputvalidation)) : t(langKeys.newinputvalidation)}
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
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            className="col-6"
                            onChange={(value) => setValue('description', value)}
                            valueDefault={edit ? (row?.description || "") : ""}
                            error={errors?.description?.message}
                        />
                        <FieldEdit
                            label={t(langKeys.value)}
                            className="col-6"
                            onChange={(value) => setValue('inputvalue', value)}
                            valueDefault={row?.inputvalue || ""}
                            error={errors?.inputvalue?.message}
                        />
                    </div>

                </div>
            </form>
        </div>
    );
}

const IDINPUTVALIDATION = "IDINPUTVALIDATION"

const InputValidation: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main.mainData);
    const executeResult = useSelector(state => state.main.execute);
    const memoryTable = useSelector(state => state.main.memoryTable);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);
    const [generalFilter, setGeneralFilter] = useState("");
    const arrayBread = [
        { id: "view-1", name: t(langKeys.inputvalidation) },
    ];
    function redirectFunc(view: string) {
        setViewSelected(view)
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: 'inputvalidationid',
                NoFilter: true,
                disableGlobalFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original || {};
                    return (
                        <TemplateIcons
                            extraOption={t(langKeys.duplicate)}
                            // viewFunction={() => history.push(`/properties/${row.GroupConfigid}`)}
                            deleteFunction={() => handleDelete(row)}
                            editFunction={() => handleEdit(row)}
                            extraFunction={() => handleDuplicate(row)}
                            ExtraICon={() => <DuplicateIcon width={28} style={{ fill: '#7721AD' }} />}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
                width: '25%',
            },
            {
                Header: t(langKeys.value),
                accessor: 'inputvalue',
                NoFilter: true,
            },

        ],
        [t]
    );

    const fetchData = () => dispatch(getCollection(getInputValidationSel(0)));

    useEffect(() => {
        fetchData();
        dispatch(setMemoryTable({
            id: IDINPUTVALIDATION
        }))
        return () => {
            dispatch(cleanMemoryTable());
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: `23505: ${t(langKeys.inputvalidationerror)}` }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    const handleRegister = () => {
        setViewSelected("view-2");
        setRowSelected({ row: null, edit: true });
    }

    const handleDuplicate = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: false });
    }

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(inputValidationins({ ...row, operation: 'DELETE', status: 'ELIMINADO', id: row.inputvalidationid })));
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
            <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
                <TableZyx
                    columns={columns}
                    titlemodule={t(langKeys.inputvalidation, { count: 2 })}
                    data={mainResult.data}
                    download={true}
                    onClickRow={handleEdit}
                    loading={mainResult.loading}
                    register={true}
                    handleRegister={handleRegister}
                    defaultGlobalFilter={generalFilter}
                    setOutsideGeneralFilter={setGeneralFilter}
                    pageSizeDefault={IDINPUTVALIDATION === memoryTable.id ? memoryTable.pageSize === -1 ? 20 : memoryTable.pageSize : 20}
                    initialPageIndex={IDINPUTVALIDATION === memoryTable.id ? memoryTable.page === -1 ? 0 : memoryTable.page : 0}
                    initialStateFilter={IDINPUTVALIDATION === memoryTable.id ? Object.entries(memoryTable.filters).map(([key, value]) => ({ id: key, value })) : undefined}
                // fetchData={fetchData}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <DetailInputValidation
                data={rowSelected}
                setViewSelected={redirectFunc}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

export default InputValidation;