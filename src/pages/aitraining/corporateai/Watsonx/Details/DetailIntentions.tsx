
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { DialogZyx, FieldEdit, TemplateBreadcrumbs, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, Button, makeStyles, TextField, Tooltip } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary, IRequestBody } from '@types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { convertLocalDate } from 'common/helpers';
import { execute, getCollection, getMultiCollection, resetAllMain } from 'store/main/actions';
import { rasaIntentIns, watsonxModelItemSel } from 'common/helpers/requestBodies';
import AddIcon from '@material-ui/icons/Add';
import { downloadrasaia, uploadrasaia } from 'store/rasaia/actions';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { ModelTestDrawer } from '../ModelTestDrawer';
import { getItemsWatson } from 'store/watsonx/actions';


interface RowSelected {
    row: Dictionary | null,
    edit: Boolean
}

interface DetailProps {
    data: RowSelected;
    fetchData?: () => void;
    setViewSelected: (view: string) => void;
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}
const useStyles = makeStyles((theme) => ({
    labellink: {
        color: '#7721ad',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    containerFields: {
        paddingRight: "16px"
    },
}));

const IntentionCell: React.FC<{ row: any, index: number, openModalEntity: (entity: any, index: number) => void }> = ({ row, index, openModalEntity }) => {
    const wordSeparation = [];
    let startIndex = 0;
    const classes = useStyles();

    while (true) {
        const delimiterIndex = row?.texto.indexOf('[', startIndex);

        if (delimiterIndex === -1) {
            wordSeparation.push(row?.texto.slice(startIndex));
            break;
        }

        wordSeparation.push(row?.texto.slice(startIndex, delimiterIndex));
        wordSeparation.push('[' + row?.texto.slice(delimiterIndex + '['.length, row?.texto.indexOf("]", delimiterIndex) + 1));

        startIndex = row?.texto.indexOf("]", delimiterIndex) + 1;
    }
    return <label>{wordSeparation.map((x: any, i: number) => {
        if (x.includes('[')) {
            return <label className={classes.labellink} onClick={() => openModalEntity(row, index)}>{x}</label>
        } else {
            return <>{x}</>
        }
    })}</label>
}

export const DetailIntentions: React.FC<DetailProps> = ({ data: { row, edit }, fetchData, setViewSelected, setExternalViewSelected, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [disableSave, setDisableSave] = useState(!row);
    const [disableCreate, setDisableCreate] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [name, setname] = useState(row?.intent_name || '');
    const [intentionIndex, setIntentionIndex] = useState(-1);
    const [newIntention, setnewIntention] = useState("");
    const [newEntity, setNewEntity] = useState<Dictionary>({
        entity: "",
        description: "",
        value: "",
    });
    const [examples, setexamples] = useState(row?.intent_examples || []);
    const mainResult = useSelector(state => state.main.mainAux);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeResult = useSelector(state => state.main.execute);
    const selectionKey = "texto"

    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        defaultValues: {
            type: 'NINGUNO',
            id: row?.rasaintentid || 0,
            rasaid: row?.rasaid || 0,
            intent_name: row?.intent_name || '',
            intent_description: row?.intent_description || '',
            operation: row ? "EDIT" : "INSERT",
            status: "ACTIVO",
        }
    });

    React.useEffect(() => {
        register('type');
        register('id');
        register('status');
        register('operation');
        register('intent_name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('intent_description'//, { validate: (value) => (value && value.length) || t(langKeys.field_required) }
        );
    }, [edit, register]);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData && fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("intentview")
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.whitelist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [executeResult, waitSave])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            let entitiesList: any[] = []
            examples.forEach((item: any) => {
                item.entidades.forEach((entidad: any) => {
                    entitiesList.push(entidad);
                });
            });
            let uniqueEntities: any[] = []
            let uniqueValues: any[] = []
            entitiesList.forEach((item: any) => {
                if (!uniqueEntities.includes(item.entity)) {
                    uniqueEntities.push(item.entity);
                }
                if (!uniqueValues.includes(item.value)) {
                    uniqueValues.push(item.value);
                }
            });
            let tempexamples = examples
            tempexamples.forEach((e: any) => delete e.updatedate)
            dispatch(execute(rasaIntentIns({ ...data, intent_examples: examples, entity_examples: uniqueEntities.length, entities: uniqueEntities.join(","), entity_values: uniqueValues.join(",") })))
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });

    const openModalEntity = (entity: any, index: number) => {
        setIntentionIndex(index);
        setOpenModal(true)
        setNewEntity({
            entity: entity.entidades[0].entity,
            description: entity.entidades[0]?.description || "",
            value: entity.entidades[0].value,
        });
    }
    const addtoTable = () => {
        if (!!newEntity.entity.trim() && !!newEntity.value.trim()) {
            let auxExamples = examples
            auxExamples[intentionIndex].entidades = [newEntity]
            setexamples(auxExamples)
            setNewEntity({
                entity: "",
                description: "",
                value: "",
            });
            setOpenModal(false)
        } else {
            dispatch(showSnackbar({ show: true, severity: "warning", message: t(langKeys.errorRasaEntity) }))
        }
    }


    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.userexample),
                accessor: 'texto',
                width: "auto",
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return <IntentionCell row={row} openModalEntity={openModalEntity} index={props.cell.row.index} />
                }
            },
        ],
        []
    );

    return (
        <div style={{ width: '100%' }}>
            {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TemplateBreadcrumbs
                    breadcrumbs={[...arrayBread, { id: "view-2", name: `${t(langKeys.intentions)} ${t(langKeys.detail)}` }]}
                    handleClick={setExternalViewSelected}
                />
            </div>}
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TitleDetail
                            title={row ? `#${row.item_name}` : t(langKeys.newintention)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("intentview")}
                        >{t(langKeys.back)}</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            disabled={disableSave}
                            color="primary"
                            type="submit"
                            startIcon={<SaveIcon color="secondary" />}
                            style={{ backgroundColor: disableSave ? "#dbdbdc" : "#55BD84" }}
                        >{t(langKeys.save)}
                        </Button>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className="row-zyx">
                        <div className={classes.containerFields}>
                            <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary">{t(langKeys.name)}</Box>
                            <TextField
                                color="primary"
                                fullWidth
                                value={name}
                                error={!!errors?.intent_name?.message}
                                helperText={errors?.intent_name?.message || null}
                                onInput={(e: any) => {
                                    if (!((/^[a-zA-Z_]/g).test(e.target.value) && (/[a-zA-Z0-9\_]$/g).test(e.target.value))) {
                                        if (e.target.value !== "") e.target.value = name
                                    }
                                }}
                                onChange={(e) => {
                                    setValue('intent_name', e.target.value)
                                    setname(e.target.value)
                                    setDisableCreate(getValues("intent_description") === "" || e.target.value === "")
                                }}
                            />
                        </div>
                        <div style={{ paddingTop: "8px", paddingBottom: "16px" }}>{t(langKeys.intentionnametooltip)}</div>
                        <FieldEdit
                            label={t(langKeys.description)}
                            className={classes.containerFields}
                            onChange={(value) => {
                                setValue('intent_description', value)
                                setDisableCreate(getValues("intent_name") === "" || value === "")
                            }}
                            valueDefault={row?.intent_description || ""}
                            error={errors?.intent_description?.message}
                        />
                        <div style={{ paddingTop: "8px" }}>{t(langKeys.intentiondescriptiontooltip)}</div>
                    </div>
                    {(disableSave) &&
                        <div className="row-zyx">
                            <Button
                                variant="contained"
                                type="button"
                                className='col-3'
                                disabled={disableCreate}
                                color="primary"
                                style={{ backgroundColor: disableCreate ? "#dbdbdc" : "#0078f6" }}
                                onClick={() => {
                                    let tempint = newIntention
                                    setnewIntention(tempint)
                                    setDisableCreate(true);
                                    setDisableSave(false)
                                }}
                            >{t(langKeys.create)}</Button>
                        </div>
                    }

                </div>
                {!disableSave && (

                    <div className={classes.containerDetail}>
                        <FieldEdit
                            label={t(langKeys.adduserexample)}
                            className="col-12"
                            valueDefault={newIntention}
                            onChange={(value) => setnewIntention(value)}
                        />
                        <div style={{ paddingTop: "8px", paddingBottom: "8px" }}>{t(langKeys.uniqueexamplesuser)}</div>
                        <Button
                            variant="contained"
                            type="button"
                            className='col-3'
                            disabled={newIntention === ""}
                            color="primary"
                            startIcon={<AddIcon color="secondary" />}
                            style={{ backgroundColor: newIntention === "" ? "#dbdbdc" : "#0078f6" }}
                            onClick={() => {
                                if (newIntention.trim()) {
                                    setexamples([{ texto: newIntention, entidades: [] }, ...examples])
                                    if (/\[[^\]]+\]/.test(newIntention)) {
                                        setOpenModal(true)
                                        setIntentionIndex(0)
                                    }
                                    setnewIntention("")
                                }

                            }}
                        >{t(langKeys.add)}</Button>

                        <div style={{ width: '100%' }}>
                            <TableZyx
                                columns={columns}
                                data={examples}
                                filterGeneral={false}
                                useSelection={true}
                                selectionKey={selectionKey}
                                setSelectedRows={setSelectedRows}
                                ButtonsElement={() => (
                                    <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
                                        <Button
                                            disabled={Object.keys(selectedRows).length === 0}
                                            variant="contained"
                                            type="button"
                                            color="primary"
                                            startIcon={<ClearIcon color="secondary" />}
                                            style={{ backgroundColor: Object.keys(selectedRows).length === 0 ? "#dbdbdc" : "#FB5F5F" }}
                                            onClick={() => { setexamples(examples.filter((x: any) => !Object.keys(selectedRows).includes(x.texto))) }}
                                        >{t(langKeys.delete)}</Button>
                                    </div>
                                )}
                                loading={mainResult.loading}
                                register={false}
                                download={false}
                                pageSizeDefault={20}
                                initialPageIndex={0}
                            />
                        </div>
                    </div>

                )}
                <DialogZyx
                    open={openModal}
                    title={t(langKeys.entities)}
                    buttonText1={t(langKeys.cancel)}
                    buttonText2={t(langKeys.save)}
                    handleClickButton1={() => setOpenModal(false)}
                    handleClickButton2={addtoTable}
                >
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.name)}
                            className={classes.containerFields}
                            onChange={(value) => {
                                setNewEntity({ ...newEntity, entity: value })
                            }}
                            valueDefault={newEntity.entity}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.description)}
                            className={classes.containerFields}
                            onChange={(value) => {
                                setNewEntity({ ...newEntity, description: value })
                            }}
                            valueDefault={newEntity.description}
                        />
                    </div>
                    <div className="row-zyx">
                        <FieldEdit
                            label={t(langKeys.value)}
                            className={classes.containerFields}
                            onChange={(value) => {
                                setNewEntity({ ...newEntity, value: value })
                            }}
                            valueDefault={newEntity.value}
                        />
                    </div>
                </DialogZyx>
            </form>
        </div>
    );
}

interface IntentionProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
    data?: any;
}