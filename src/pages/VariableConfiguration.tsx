/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons, TemplateBreadcrumbs, TitleDetail, FieldView, FieldEdit, FieldSelect, FieldEditMulti, FieldCheckbox, DialogZyx } from 'components';
import { getValuesFromDomain, getVariableConfigurationLst, getVariableConfigurationSel, downloadCSV, uploadCSV, insVariableConfiguration } from 'common/helpers';
import { Dictionary, MultiData } from "@types";
import TableZyx from '../components/fields/table-simple';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useFieldArray, useForm } from 'react-hook-form';
import { getCollection, resetMain, getMultiCollection, execute, getCollectionAux, resetMainAux } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface DetailProps {
    data: RowSelected;
    setViewSelected: (view: string) => void;
    multiData: MultiData[];
    fetchData: () => void
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

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const [dataTable, setDataTable] = useState([]);
    const [valuefile, setvaluefile] = useState('');

    const columns = React.useMemo(
        () => [
            {
                accessor: 'chatblockid',
                NoFilter: true,
                isComponent: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            size="small"
                            onClick={handleEdit}>
                            <EditIcon style={{ color: '#B6B4BA' }} />
                        </IconButton>
                    )
                }
            },
            {
                Header: t(langKeys.title),
                accessor: 'title',
                NoFilter: true
            },
            {
                Header: t(langKeys.channel_plural),
                accessor: 'channels',
                NoFilter: true
            },
            {
                accessor: 'actions',
                NoFilter: true,
                isComponent: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <React.Fragment>
                            <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                size="small"
                                onClick={() => handleDownload(row)}>
                                <GetAppIcon style={{ color: '#B6B4BA' }} />
                            </IconButton>
                            <input
                                id="upload-file"
                                name="file"
                                type="file"
                                accept="text/csv"
                                value={valuefile}
                                style={{ display: 'none' }}
                                onChange={(e) => handleUpload(row, e.target.files)}
                            />
                            <label htmlFor="upload-file">
                                <IconButton
                                    size="small"
                                    component="span">
                                    <PublishIcon style={{ color: '#B6B4BA' }}/>
                                </IconButton>
                            </label> 
                        </React.Fragment>
                    )
                }
            }
        ],
        []
    )

    const fetchData = () => dispatch(getCollection(getVariableConfigurationLst()));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("ESTADOGENERICO"),
        ]));
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.variableconfiguration).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, success: false, message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

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

    const handleDownload = (row: Dictionary) => {
        setRowSelected({ row, edit: false });
        dispatch(resetMainAux());
        dispatch(getCollectionAux(getVariableConfigurationSel(row?.chatblockid || '')));
    }

    useEffect(() => {
        if (!detailResult.loading && !detailResult.error) {
            downloadData(detailResult.data);
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
        uploadData(data);
    }

    const uploadData = (data: any) => {
        dispatch(showBackdrop(true));
        dispatch(execute({
            header: null,
            detail: [
                ...data.map((x: any) => insVariableConfiguration(x))
            ]
        }, true));
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
                handleRegister={handleRegister}
            />
        )
    }
    else
        return (
            <div></div>
            // <DetailIntegrationManager
            //     data={rowSelected}
            //     setViewSelected={setViewSelected}
            //     multiData={mainResult.multiData.data}
            //     fetchData={fetchData}
            // />
        )
}

export default VariableConfiguration;