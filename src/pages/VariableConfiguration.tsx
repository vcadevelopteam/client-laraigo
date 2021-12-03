/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs } from 'components';
import { getValuesFromDomain, getVariableConfigurationLst, getVariableConfigurationSel, downloadCSV, uploadCSV, insarrayVariableConfiguration } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import TableZyxEditable from 'components/fields/table-editable';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, getMultiCollection, execute, getCollectionAux, resetMainAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import { chatblock_reset } from 'store/botdesigner/actions';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void;
}

const arrayBread = [
    { id: "view-1", name: "Variable Configuration" },
    { id: "view-2", name: "Variable Configuration detail" }
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
    }
}));

const VariableConfiguration: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const detailResult = useSelector(state => state.main.mainAux);
    const botdesignerResult = useSelector(state => state.botdesigner.chatblock);

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitDownload, setWaitDownload] = useState(false);
    const [waitSave, setWaitSave] = useState(false);

    const [valuefile, setvaluefile] = useState('');

    const columns = React.useMemo(
        () => [
            {
                accessor: 'chatblockid',
                NoFilter: true,
                isComponent: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    const id = props.cell.row.id;
                    return (
                        <React.Fragment>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                size="small"
                                onClick={() => handleEdit(row)}>
                                <VisibilityIcon style={{ color: '#B6B4BA' }} />
                            </IconButton>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"    
                                size="small"
                                onClick={() => handleDownload(row)}>
                                <GetAppIcon
                                    titleAccess={t(langKeys.download)}
                                    style={{ color: '#B6B4BA' }} />
                            </IconButton>
                            <input
                                id={`upload-file${id}`}
                                name="file"
                                type="file"
                                accept="text/csv"
                                value={valuefile}
                                style={{ display: 'none' }}
                                onChange={(e) => handleUpload(row, e.target.files)}
                            />
                            <label htmlFor={`upload-file${id}`}>
                                <IconButton
                                    size="small"
                                    component="span">
                                    <PublishIcon
                                        titleAccess={t(langKeys.import)}
                                        style={{ color: '#B6B4BA' }}/>
                                </IconButton>
                            </label> 
                        </React.Fragment>
                    )
                }
            },
            {
                Header: t(langKeys.flow),
                accessor: 'title',
                NoFilter: true
            },
            {
                Header: t(langKeys.channel_plural),
                accessor: 'channels',
                NoFilter: true
            }
        ],
        []
    )

    const fetchData = () => dispatch(getCollection(getVariableConfigurationLst()));
    const fetchDetailData = (id: string) => dispatch(getCollectionAux(getVariableConfigurationSel(id)));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
        ]));
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.variableconfiguration).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    useEffect(() => {
        if (botdesignerResult) {
            handleEdit(botdesignerResult);
            dispatch(chatblock_reset());
        }
    }, [botdesignerResult])

    const handleDownload = (row: Dictionary) => {
        setWaitDownload(true);
        dispatch(showBackdrop(true));
        fetchDetailData(row.chatblockid);
    }

    useEffect(() => {
        if (!detailResult.loading && !detailResult.error) {
            if (waitDownload) {
                downloadData(detailResult.data);
                dispatch(showBackdrop(false));
                setWaitDownload(false);
                dispatch(resetMainAux());
            }
        }
    }, [detailResult]);

    const downloadData = (data: Dictionary[]) => {
        if (data.length > 0) {
            let mapdata = data.map(({ variable, description, fontcolor, fontbold, priority, visible }) => {
                    return { variable, description, fontcolor, fontbold, priority, visible }
            });
            let filename = `variableconfiguration_${rowSelected.row?.title}.csv`;
            downloadCSV(filename, mapdata);
        }
    }

    const handleUpload = async (row: Dictionary, files: any) => {
        const file = files[0];
        const owner = (({ corpid, orgid, chatblockid }) => ({ corpid, orgid, chatblockid }))(row);
        const data = await uploadCSV(file, owner);
        setvaluefile('')
        if (data) {
            uploadData(data);
        }
    }

    const uploadData = (data: any) => {
        dispatch(showBackdrop(true));
        dispatch(execute(insarrayVariableConfiguration(data)));
        setWaitSave(true)
    }

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.variableconfiguration_plural, { count: 2 })}
                data={mainResult.mainData.data}
                download={false}
                loading={mainResult.mainData.loading}
                register={false}
            />
        )
    }
    else
        return (
            <DetailVariableConfiguration
                data={rowSelected}
                setViewSelected={setViewSelected}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
            />
        )
}

const DetailVariableConfiguration: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, multiData, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const detailResult = useSelector(state => state.main.mainAux);
    const executeRes = useSelector(state => state.main.execute);
    
    const [waitSave, setWaitSave] = useState(false);
    
    const [dataTable, setDataTable] = useState<any[]>([]);
    const [skipAutoReset, setSkipAutoReset] = useState(false)

    const fetchDetailData = (id: string) => dispatch(getCollectionAux(getVariableConfigurationSel(id)));

    useEffect(() => {
        fetchDetailData(row?.chatblockid);
        return () => {
            dispatch(resetMainAux());
        };
    }, []);

    useEffect(() => {
        if (!detailResult.loading && !detailResult.error) {
            setDataTable(detailResult.data);
        }
    }, [detailResult]);

    useEffect(() => {
        if (waitSave) {
            if (!executeRes.loading && !executeRes.error) {
                dispatch(showSnackbar({ show: true, success: true, message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.variableconfiguration).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeRes, waitSave])

    const onSubmit = () => {
        const callback = () => {
            dispatch(execute(insarrayVariableConfiguration(dataTable)));
            dispatch(showBackdrop(true));
            setWaitSave(true)
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_save),
            callback
        }))
    };

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.variable),
                accessor: 'variable',
                NoFilter: false,
                sortType: 'string'
            },
            {
                Header: t(langKeys.label),
                accessor: 'description',
                NoFilter: false,
                sortType: 'string',
                editable: true,
            },
            {
                Header: t(langKeys.color),
                accessor: 'fontcolor',
                NoFilter: false,
                type: 'color',
                editable: true,
                width: 160,
                maxWidth: 160
            },
            {
                Header: t(langKeys.bold),
                accessor: 'fontbold',
                NoFilter: false,
                type: 'boolean',
                sortType: 'basic',
                editable: true,
                width: 180,
                maxWidth: 180
            },
            {
                Header: t(langKeys.order),
                accessor: 'priority',
                NoFilter: false,
                type: 'number',
                sortType: 'number',
                editable: true,
                width: 150,
                maxWidth: 150,
            },
            {
                Header: t(langKeys.show),
                accessor: 'visible',
                NoFilter: false,
                type: 'boolean',
                sortType: 'basic',
                editable: true,
                width: 180,
                maxWidth: 180
            }
        ],
        []
    )

    const [updatingDataTable, setUpdatingDataTable] = useState(false);
    const updateCell = (rowIndex: number, columnId: any, value: any) => {
        // We also turn on the flag to not reset the page
        setSkipAutoReset(true);
        setDataTable((old: any) =>
        old.map((row: any, index: number) => {
            if (index === rowIndex) {
                return {
                    ...old[rowIndex],
                    [columnId]: value,
                }
            }
            return row
        })
        )
        setUpdatingDataTable(!updatingDataTable);
    }

    const updateColumn = (rowIndexs: number[], columnId: any, value: any) => {
        // We also turn on the flag to not reset the page
        setSkipAutoReset(true);
        setDataTable((old: any) =>
        old.map((row: any, index: number) => {
            if (rowIndexs.includes(index)) {
                return {
                    ...old[index],
                    [columnId]: value,
                }
            }
            return row
        })
        )
        setUpdatingDataTable(!updatingDataTable);
    }

    useEffect(() => {
        setSkipAutoReset(false)
    }, [updatingDataTable])

    const ButtonsElement = () => {
        return (
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
                        type="button"
                        startIcon={<SaveIcon color="secondary" />}
                        style={{ backgroundColor: "#55BD84" }}
                        onClick={() => onSubmit()}
                    >{t(langKeys.save)}
                    </Button>
                }
            </div>
        )
    }

    return (
        <div style={{ width: '100%' }}>
            <TemplateBreadcrumbs
                breadcrumbs={arrayBread}
                handleClick={setViewSelected}
            />
            <TableZyxEditable
                columns={columns}
                titlemodule={`${t(langKeys.variableconfiguration_plural, { count: 2 })}${row ? ` (${row.title})` : ''}`}
                data={dataTable}
                ButtonsElement={ButtonsElement}
                download={false}
                loading={detailResult.loading}
                register={false}
                filterGeneral={false}
                updateCell={updateCell}
                updateColumn={updateColumn}
                skipAutoReset={skipAutoReset}
            />
        </div>
    )
}

export default VariableConfiguration;