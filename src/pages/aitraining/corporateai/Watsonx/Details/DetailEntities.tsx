
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { FieldEdit, TemplateBreadcrumbs, TitleDetail } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Box, Button, makeStyles, Tab, Tabs } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from '@types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import SaveIcon from '@material-ui/icons/Save';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { watsonxIntentDetailSel } from 'common/helpers/requestBodies';
import AddIcon from '@material-ui/icons/Add';
import { EntitiesTable } from '../components/EntitiesTable';
import { getItemsDetail, getMentionwatsonx, insertEntitywatsonx, resetItemsDetail } from 'store/watsonx/actions';
import { SynonymList } from '../components/SynonymList';


interface RowSelected {
    row: Dictionary | null,
    edit: Boolean
}

interface DetailProps {
    data: RowSelected;
    fetchData?: () => void;
    setViewSelected: (view: string) => void;
    setExternalViewSelected?: (view: string) => void;
    setIntentionSelected: (view: any) => void;
    arrayBread: any;
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

export const DetailEntities: React.FC<DetailProps> = ({ data: { row, edit }, fetchData, setViewSelected, setExternalViewSelected, arrayBread, setIntentionSelected }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const [disableSave, setDisableSave] = useState(!row);
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [newExample, setNewExample] = useState("");
    const [sinonyms, setSinonyms] = useState<any>([""]);
    const [dataMentions, setDataMentions] = useState<any>([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [examples, setexamples] = useState<any>(row?.values?.split(",")?.reduce((acc: any, x: any) => [...acc, { name: x }], []) || []);
    const mainResultWatson = useSelector(state => state.watson.items);
    const selectedSkill = useSelector(state => state.watson.selectedRow);
    const operationRes = useSelector(state => state.watson.entity);
    const mainResult = useSelector(state => state.watson.itemsdetail);
    const mentionDataList = useSelector(state => state.watson.mentions);
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

    useEffect(() => {
        if (!!row?.watsonitemid) {
            dispatch(getItemsDetail(watsonxIntentDetailSel(row?.watsonitemid)))
            dispatch(getMentionwatsonx(row.item_name))
        }
        return () => {
            dispatch(resetItemsDetail());
        };        
    }, [])

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setexamples(mainResult.data.map(x => ({ ...x, synonyms: JSON.parse(x.synonyms)?.length ? JSON.parse(x.synonyms) : [""] })))
        }
    }, [mainResult])

    useEffect(() => {
        if (!mentionDataList.loading && !mentionDataList.error) {
            setDataMentions(mentionDataList?.data||[])
        }
    }, [mentionDataList])

    React.useEffect(() => {
        register('watsonid');
        register('watsonitemid');
        register('description');
        register('operation');
        register('item_name', { validate: (value) => (value && value.length) || t(langKeys.field_required) });
    }, [edit, register]);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.userexample),
                accessor: 'intention_value',
                NoFilter: true,
                sortType: 'string',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const location = JSON.parse(row.location)
                    const intentionValue = row.intention_value
                    const start = location[0] ;
                    const end = location[1] + 1 ;
                    
                    const beforeHighlight = intentionValue.slice(0, start);
                    const highlightedWord = intentionValue.slice(start, end);
                    const afterHighlight = intentionValue.slice(end);
                  
                    return (
                      <p>
                        {beforeHighlight}
                        <span style={{ color: 'purple', textDecoration: 'underline' }}>
                          {highlightedWord}
                        </span>
                        {afterHighlight}
                      </p>
                    );
                }
            },
            {
                Header: t(langKeys.intention),
                accessor: 'intention',
                NoFilter: true,
                sortType: 'string',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <label
                            className={classes.labellink}
                            onClick={() => {          
                                setViewSelected("view-3");
                                setIntentionSelected({ row: mainResultWatson.data.filter(x=>x.watsonitemid === row.watsonitemid)[0], edit: true })
                            }}
                        >
                            #{row.intention}
                        </label>
                    )
                }
            }
        ],
        []
    )

    useEffect(() => {
        if (waitSave) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                dispatch(showBackdrop(false));
                setViewSelected("mainview")
                setTimeout(() => { fetchData && fetchData() }, 500);
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.sinonim).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [operationRes, waitSave])

    const onSubmit = handleSubmit((data) => {
        const cleanedExamples = examples.map((item:any) => {
            const cleanedSynonyms = item.synonyms.map((syn:any) => syn.trim()).filter((syn:any) => syn !== "");

            return {
                ...item,
                synonyms: cleanedSynonyms.length > 0 ? cleanedSynonyms : null
            };
        });
        const callback = () => {
            dispatch(insertEntitywatsonx({ ...data, detail: cleanedExamples }))
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
            {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <TemplateBreadcrumbs
                    breadcrumbs={[...arrayBread, { id: "view-2", name: t(langKeys.sinonims) }]}
                    handleClick={setExternalViewSelected}
                />
            </div>}
            <form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <TitleDetail
                            title={row ? `${row.description}` : `${t(langKeys.newentity)}`}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            startIcon={<ClearIcon color="secondary" />}
                            style={{ backgroundColor: "#FB5F5F" }}
                            onClick={() => setViewSelected("mainview")}
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
                            helperText2={t(langKeys.entitynametooltip2)}
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
                                    setDisableSave(false)
                                }}
                            >{t(langKeys.create)}</Button>
                        </div>
                    }

                </div>
                {!disableSave && (

                    <div className={classes.containerDetail}>
                        <div className='row-zyx'>
                            <FieldEdit
                                label={t(langKeys.value)}
                                className="col-6"
                                variant='outlined'
                                size="small"
                                valueDefault={newExample}
                                onChange={(value) => setNewExample(value.toLowerCase())}
                                helperText2={t(langKeys.valuesynonymhelper)}
                            />
                            <div className='col-6'>
                                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                                    {t(langKeys.sinonims)}
                                </Box>
                                <Box lineHeight="18px" fontSize={12} mb={.5} style={{ display: "flex", color: "#aaaaaa" }}>
                                    {t(langKeys.sinonimshelper11)}
                                </Box>
                                <SynonymList sinonyms={sinonyms} setSinonyms={setSinonyms} />
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            type="button"
                            className='col-3'
                            disabled={newExample === ""}
                            color="primary"
                            startIcon={<AddIcon color="secondary" />}
                            style={{ backgroundColor: newExample === "" ? "#dbdbdc" : "#0078f6" }}
                            onClick={() => {
                                if (!examples.filter((x: any) => (x.value).toLocaleLowerCase() === newExample.toLocaleLowerCase()).length) {
                                    let filteredexamples = sinonyms.filter((synonym: string) => synonym.trim() !== "")
                                    if (!filteredexamples.length) filteredexamples = [""]
                                    setexamples([...examples, { value: newExample, watsonitemdetailid: 0, status: "ACTIVO", synonyms: filteredexamples }]);
                                    setNewExample("")
                                    setSinonyms([""])
                                } else {
                                    dispatch(showSnackbar({ show: true, severity: "error", message: "Ya existe ese valor" }))
                                }
                            }}
                        >{`${t(langKeys.add)} ${t(langKeys.value)}`}</Button>

                        <Tabs
                            value={currentTab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={(e, value) => setCurrentTab(value)}
                        >
                            <Tab label={t(langKeys.dictionary)} />
                            <Tab label={t(langKeys.annotations)} />
                        </Tabs>
                        {(currentTab === 0) && <>
                            <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
                                <Button
                                    disabled={Object.keys(selectedRows).length === 0}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: Object.keys(selectedRows).length === 0 ? "#dbdbdc" : "#FB5F5F" }}
                                    onClick={() => { setexamples(examples.filter((x: any) => !selectedRows.includes(x.value))) }}
                                >{t(langKeys.delete)}</Button>
                            </div>
                            <div style={{ width: '100%' }}>
                                <EntitiesTable loading={false} tableData={examples} setTableData={setexamples} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
                            </div>
                        </>}
                        {(currentTab === 1) && <>
                            <TableZyx columns={columns} data={dataMentions}
                            />
                        </>}
                    </div>

                )}
            </form>
        </div>
    );
}