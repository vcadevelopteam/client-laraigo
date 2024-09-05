import React, { FC, useEffect, useMemo, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateBreadcrumbs } from 'components';
import { getValuesFromDomain, getVariableConfigurationLst, getVariableConfigurationSel, uploadCSV, insarrayVariableConfiguration, exportExcel } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import TableZyxEditable from 'components/fields/table-editable';
import { Menu, Button, IconButton, makeStyles, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, getMultiCollection, execute, getCollectionAux, resetMainAux, resetAllMain } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import { MoreVert as MoreVertIcon, GetApp as GetAppIcon, Publish as PublishIcon, Save as SaveIcon, Clear as ClearIcon } from '@material-ui/icons';
import { chatblock_reset } from 'store/botdesigner/actions';
import { CellProps } from 'react-table';

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
                minWidth: 20,
                maxWidth: 20,
                width: 20,
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    const id = props.cell.row.id;
                    return (
                        <TemplateIcons
                            layoutKey={id}
                            valuefile={valuefile}
                            exportFn={e => {
                                e.stopPropagation();
                                handleDownload(row);
                            }}
                            importFn={e => handleUpload(row, e.target.files)}
                        />
                    );
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
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_import) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.variableconfiguration).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
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
            const mapdata = data.map(({ variable, description, fontcolor, fontbold, priority, visible }) => ({
                variable,
                description,
                fontcolor,
                fontbold,
                priority,
                visible
            }));

            const columns = [
                { accessor: "variable", Header: t(langKeys.variable) },
                { accessor: "description", Header: t(langKeys.description) },
                { accessor: "fontcolor", Header: t(langKeys.fontcolor) },
                { accessor: "fontbold", Header: t(langKeys.fontbold) },
                { accessor: "priority", Header: t(langKeys.priority) },
                { accessor: "visible", Header: t(langKeys.visible) },
            ];

            // Convert the data to CSV format
            const csvRows = [];
            const headers = columns.map(col => col.Header).join(",");
            csvRows.push(headers);

            mapdata.forEach(row => {
                const values = columns.map(col => row[col.accessor as keyof typeof row]);
                csvRows.push(values.join(","));
            });

            // Create a CSV blob and trigger the download
            const csvString = csvRows.join("\n");
            const blob = new Blob([csvString], { type: "text/csv" });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `variableconfiguration_${rowSelected.row?.title}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const handleUpload = async (row: Dictionary, files: HTMLInputElement["files"]) => {
        const file = files?.[0];
        const owner = (({ corpid, orgid, chatblockid }) => ({ corpid, orgid, chatblockid }))(row);
        const data = await uploadCSV(file, owner);
        setvaluefile('')
        if (data) {
            uploadData(data);
        }
    }

    const uploadData = (data: Dictionary[]) => {
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
                onClickRow={handleEdit}
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

const DetailVariableConfiguration: React.FC<DetailProps> = ({ data: { row, edit }, setViewSelected, fetchData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const detailResult = useSelector(state => state.main.mainAux);
    const executeRes = useSelector(state => state.main.execute);

    const [waitSave, setWaitSave] = useState(false);

    const [dataTable, setDataTable] = useState<Dictionary[]>([]);
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
                dispatch(showSnackbar({ show: true, severity: "success", message: t(row ? langKeys.successful_edit : langKeys.successful_register) }))
                fetchData();
                dispatch(showBackdrop(false));
                setViewSelected("view-1")
            } else if (executeRes.error) {
                const errormessage = t(executeRes.code || "error_unexpected_error", { module: t(langKeys.variableconfiguration).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
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

    const arrayBread = useMemo(() => ([
        { id: "view-1", name: t(langKeys.variableconfiguration, { count: 2 }) },
        { id: "view-2", name: t(langKeys.variableconfigurationdetail) },
    ]), [t]);

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
    const updateCell = (rowIndex: number, columnId: string, value: string) => {
        // We also turn on the flag to not reset the page
        setSkipAutoReset(true);
        setDataTable((old: Dictionary) =>
            old.map((row: Dictionary, index: number) => {
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

    const updateColumn = (rowIndexs: number[], columnId: string, value: string) => {
        // We also turn on the flag to not reset the page
        setSkipAutoReset(true);
        setDataTable((old: Dictionary) =>
            old.map((row: Dictionary, index: number) => {
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

interface TemplateIconsProps {
    layoutKey: string;
    valuefile: string;
    exportFn: (event: React.MouseEvent<HTMLLIElement>) => void;
    importFn: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TemplateIcons: React.FC<TemplateIconsProps> = ({ layoutKey, valuefile, exportFn, importFn }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                size="small"

                onClick={(e) => {
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                }}
            >
                <MoreVertIcon style={{ color: '#B6B4BA' }} />
            </IconButton>
            <input
                id={`${layoutKey}-import-input`}
                name="file"
                type="file"
                accept="text/csv"
                value={valuefile}
                style={{ display: 'none' }}
                onChange={importFn}
                onClick={e => e.stopPropagation()}
            />
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={e => {
                        exportFn(e);
                        handleClose(e);
                    }}
                >
                    <ListItemIcon color="inherit">
                        <GetAppIcon width={22} style={{ fill: '#7721AD' }} />
                    </ListItemIcon>
                    <ListItemText>
                        <Trans i18nKey={langKeys.download} />
                    </ListItemText>
                </MenuItem>
                <label htmlFor={`${layoutKey}-import-input`}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon color="inherit">
                            <PublishIcon width={18} style={{ fill: '#7721AD' }} />
                        </ListItemIcon>
                        <ListItemText>
                            <Trans i18nKey={langKeys.import} />
                        </ListItemText>
                    </MenuItem>
                </label>
            </Menu>
        </div>
    )
}
