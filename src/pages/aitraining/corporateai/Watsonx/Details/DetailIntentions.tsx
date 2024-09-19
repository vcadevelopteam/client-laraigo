
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { DialogZyx, FieldEdit, FieldSelect, IOSSwitch, TemplateBreadcrumbs, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button, makeStyles } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { convertLocalDate } from 'common/helpers';
import { watsonxIntentDetailSel } from 'common/helpers/requestBodies';
import AddIcon from '@material-ui/icons/Add';
import { createNewMention, getItemsDetail, insertIntentwatsonx, resetItemsDetail } from 'store/watsonx/actions';


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

export const DetailIntentions: React.FC<DetailProps> = ({ data: { row, edit }, fetchData, setViewSelected, setExternalViewSelected, arrayBread }) => {
    const classes = useStyles();
    const [waitSave, setWaitSave] = useState(false);
    const [disableSave, setDisableSave] = useState(!row);
    const [openModal, setOpenModal] = useState(false);
    const [showEntities, setShowEntities] = useState(false);
    const [selectedRows, setSelectedRows] = useState<Dictionary>({});
    const [selectedWord, setSelectedWord] = useState<any>(null);
    const mainResultWatson = useSelector(state => state.watson.items);
    const selectedSkill = useSelector(state => state.watson.selectedRow);
    const [createdEntities, setCreatedEntities] = useState<any>([]);
    const [newIntention, setnewIntention] = useState("");
    const [newEntity, setNewEntity] = useState("");
    const [examples, setexamples] = useState<any>([]);
    const mainResult = useSelector(state => state.watson.itemsdetail);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const executeResult = useSelector(state => state.watson.intent);
    const selectionKey = "value"

    const { register, handleSubmit, setValue, getValues, formState: { errors }, watch } = useForm({
        defaultValues: {
            watsonid: selectedSkill.watsonid,
            watsonitemid: row?.watsonitemid || 0,
            operation: row ? "UPDATE" : "INSERT",
            item_name: row?.item_name || '',
            description: row?.description || '',
        }
    });

    const item_name_watch = watch("item_name");

    React.useEffect(() => {
        register('watsonid');
        register('operation');
        register('item_name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
        register('description');
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

    useEffect(() => {
        if (!!row?.watsonitemid) {
            dispatch(getItemsDetail(watsonxIntentDetailSel(row?.watsonitemid)))
        }
        return () => {
            dispatch(resetItemsDetail());
        }; 
    }, [])

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setexamples(mainResult.data)
        }
    }, [mainResult])

    const onSubmit = handleSubmit((data) => {
        const callback = () => {
            dispatch(insertIntentwatsonx({...data, detail: examples}))
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    });


    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.userexample),
                accessor: 'value',
                width: "auto",
                NoFilter: true,
                Cell: (props: any) => {
                    const index = props.cell.row.index;
                    if (showEntities) {
                        const sentence = props.cell.row.original.value;
                        const mentions = props.cell.row.original.mentions
                        const words = sentence.split(" ").filter((word: string) => word.trim() !== "");
                        let currentIndex = 0;
                        return (
                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                {words.map((word: string, i: number) => {
                                    const wordStart = sentence.indexOf(word, currentIndex);
                                    const wordEnd = wordStart + word.length;
                                    currentIndex = wordEnd;
                                    const mention = mentions?.find((mention:any) =>
                                        mention.value === word &&
                                        mention.location[0] === wordStart &&
                                        mention.location[1] === wordEnd
                                    );

                                    const isMention = !!mention;

                                    return (
                                        <span
                                            key={i}
                                            style={{
                                                border: "1px dashed black",
                                                padding: "2px 5px",
                                                cursor: "pointer",
                                                color: isMention ? "#7721ad" : "inherit",
                                                textDecoration: isMention ? "underline" : "none"
                                            }}
                                            onClick={() => {
                                                if (isMention) {
                                                    setNewEntity(mention.entity);
                                                }
                                                setSelectedWord({
                                                    value: word,
                                                    location: [wordStart, wordEnd],
                                                    sentenceindex: index
                                                });
                                                setOpenModal(true);
                                            }}
                                        >
                                            {word}
                                        </span>
                                    );
                                })}
                            </div>
                        );
                    } else {
                        return <FieldEdit
                            style={{ padding: 0 }}
                            valueDefault={props.cell.row.original.value}
                            onChange={(value) => {
                                let auxExamples = examples;
                                auxExamples[index].text = value;
                                auxExamples[index].createdate = new Date();
                                auxExamples[index].mentions = []
                                setexamples(auxExamples)
                            }}
                            size="small"
                        />
                    }

                }
            },
            {
                Header: t(langKeys.date),
                accessor: 'createdate',
                width: "300px",
                NoFilter: true,
                Cell: (props) => {
                    const createdate = props.cell.row.original?.createdate || new Date();
                    return convertLocalDate(createdate).toLocaleString()
                }
            },
            {
                Header: t(langKeys.conflicts),
                accessor: 'conflicts',
                width: "150px",
                type: "number",
                NoFilter: true,
                Cell: () => {
                    return 0
                }
            },
        ],
        [showEntities]
    );

    function addtoTable() {
        if (!!newEntity.trim()) {
            let entityList = (mainResultWatson?.data || []).filter(x => x.type === "entity")
            const entityExists = !!entityList.filter(x => x.item_name === newEntity).length
            if (!entityExists) {
                dispatch(createNewMention({
                    watsonid: selectedSkill.watsonid,
                    entity: newEntity,
                    value: selectedWord.value
                }))
                setCreatedEntities([...createdEntities, {
                    item_name: newEntity
                }])
            }
            const auxexamples = examples;
            auxexamples[selectedWord.sentenceindex].mentions = [
                ...(auxexamples[selectedWord.sentenceindex]?.mentions||[]),
                {
                    entity: newEntity,
                    location: selectedWord.location,
                    value: selectedWord.value
                }
            ]
            setexamples(auxexamples)
            setNewEntity("")
            setOpenModal(false)
        }
    }

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
                        <FieldEdit
                            className="col-12"
                            valueDefault={getValues("item_name")}
                            onChange={(value) => setValue('item_name', value)}
                            variant='outlined'
                            size="small"
                            disabled={!disableSave}
                            error={errors?.item_name?.message}
                            label={t(langKeys.name)}
                            inputProps={{ maxLength: 128 }}
                            helperText2={t(langKeys.intentionnametooltip)}
                            onInput={(e: any) => {
                                if (!((/^[a-zA-Z_]/g).test(e.target.value) && (/[a-zA-Z0-9\_]$/g).test(e.target.value))) {
                                    if (e.target.value !== "") e.target.value = name;
                                }
                            }}
                        />
                        <FieldEdit
                            className="col-12"
                            valueDefault={getValues("description")}
                            onChange={(value) => { setValue('description', value) }}
                            variant='outlined'
                            disabled={!disableSave}
                            size="small"
                            inputProps={{ maxLength: 1024 }}
                            error={errors?.item_name?.message}
                            label={t(langKeys.description)}
                            helperText2={t(langKeys.intentiondescriptiontooltip)}
                        />
                    </div>
                    {(disableSave) &&
                        <div className="row-zyx">
                            <Button
                                variant="contained"
                                type="button"
                                className='col-3'
                                disabled={!item_name_watch}
                                color="primary"
                                style={{ backgroundColor: !item_name_watch ? "#dbdbdc" : "#0078f6" }}
                                onClick={() => {
                                    let tempint = newIntention
                                    setnewIntention(tempint)
                                    setDisableSave(false)
                                }}
                            >{t(langKeys.create)}</Button>
                        </div>
                    }

                </div>
                {!disableSave && (
                    <div className={classes.containerDetail}>
                        <div className="row-zyx">
                            <FieldEdit
                                label={t(langKeys.userexample)}
                                className="col-9"
                                valueDefault={newIntention}
                                variant='outlined'
                                size="small"
                                onChange={(value) => setnewIntention(value)}
                                helperText2={t(langKeys.uniqueexamplesuserintention)}
                            />
                            <Button
                                variant="contained"
                                type="button"
                                className='col-3'
                                disabled={!newIntention}
                                color="primary"
                                startIcon={<AddIcon color="secondary" />}
                                style={{ backgroundColor: !newIntention ? "#dbdbdc" : "#0078f6", marginTop: 'auto' }}
                                onClick={() => {
                                    if (newIntention.trim()) {
                                        setexamples([{ value: newIntention, mentions: [], watsonitemdetailid: 0, status: "ACTIVO" }, ...examples])
                                        if (/\[[^\]]+\]/.test(newIntention)) {
                                            setOpenModal(true)
                                        }
                                        setnewIntention("")
                                    }

                                }}
                            >{t(langKeys.add)}</Button>
                        </div>

                        <div style={{ width: '100%' }}>
                            <TableZyx
                                columns={columns}
                                data={examples}
                                filterGeneral={false}
                                useSelection={true}
                                selectionKey={selectionKey}
                                setSelectedRows={setSelectedRows}
                                ButtonsElement={() => (
                                    <div style={{ display: "flex", justifyContent: "end", width: "100%", gap: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <IOSSwitch checked={showEntities} onChange={(e) => {
                                                setShowEntities(e.target.checked);
                                            }} />
                                            {t(langKeys.annotateentities)}
                                        </div>
                                        <Button
                                            disabled={Object.keys(selectedRows).length === 0}
                                            variant="contained"
                                            type="button"
                                            color="primary"
                                            startIcon={<ClearIcon color="secondary" />}
                                            style={{ backgroundColor: Object.keys(selectedRows).length === 0 ? "#dbdbdc" : "#FB5F5F" }}
                                            onClick={() => { setexamples(examples.filter((x: any) => !Object.keys(selectedRows).includes(x.value))) }}
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
                    handleClickButton1={() => {setOpenModal(false); setNewEntity("")}}
                    handleClickButton2={addtoTable}
                >
                    <div className="row-zyx">
                        <FieldSelect
                            freeSolo={true}
                            className={classes.containerFields}
                            valueDefault={newEntity}
                            helperText2={t(langKeys.entitydesctooltop)}
                            onChange={(value) => {
                                setNewEntity(value?.item_name || "")
                            }}
                            data={[...(mainResultWatson?.data || []).filter(x => x.type === "entity"), ...createdEntities]}
                            optionDesc="item_name"
                            optionValue="item_name"
                        />
                    </div>
                </DialogZyx>
            </form>
        </div>
    );
}
