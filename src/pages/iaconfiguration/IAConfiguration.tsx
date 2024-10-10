import React, { useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import { TemplateBreadcrumbs, TagTypeCell } from 'components';
import { convertLocalDate, getChannelsByOrg, getIntelligentModelsConfigurations, getIntelligentModelsSel, getValuesFromDomain, iaservicesBulkDel, insInteligentModelConfiguration } from 'common/helpers';
import { Dictionary } from "@types";
import TableZyx from '../../components/fields/table-simple';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { getCollection, resetAllMain, getMultiCollection, execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import ClearIcon from '@material-ui/icons/Clear';
import { CellProps } from 'react-table';
import { Delete } from '@material-ui/icons';
import IAConfigurationDetail from './IAConfigurationDetail';

interface RowSelected {
    row: Dictionary | null,
    edit: boolean
}

interface IAConfigurationProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}



const selectionKey = "intelligentmodelsconfigurationid"
const IAConfiguration: React.FC<IAConfigurationProps> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [selectedRows, setSelectedRows] = useState<any>({});

    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);


    const functionChange = (change: string) => {
        if (change === "view-0") {
            setExternalViewSelected && setExternalViewSelected("view-1");
        } else {
            setViewSelected(change);
        }
    }

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.conector),
                accessor: 'connector',
                width: 'auto',
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                width: 'auto',
            },
            {
                Header: t(langKeys.channeldesc),
                accessor: 'channeldesc',
                width: 'auto',
                Cell: (props: CellProps<Dictionary>) => {
                    const { row } = props.cell;
                    const data = row?.original?.channeldesc || '';
                    return <TagTypeCell separator={";"} data={data}/>

                },
            },
            {
                Header: t(langKeys.timesheet_registerdate),
                accessor: 'createdate',
                type: 'date',
                sortType: 'datetime',
                width: 'auto',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.createdate).toLocaleString()
                }
            },
            {
                Header: t(langKeys.createdBy),
                accessor: 'createby',
                width: 'auto',
            },
        ],
        []
    );

    const fetchData = () => dispatch(getCollection(getIntelligentModelsConfigurations()));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getIntelligentModelsSel(0),
            getChannelsByOrg(),
            getValuesFromDomain("TIPOMODELO"),
            getValuesFromDomain("ESTADOGENERICO")
        ]));
        return () => {
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
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.organization_plural).toLocaleLowerCase() })
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

    const handleEdit = (row: Dictionary) => {
        setViewSelected("view-2");
        setRowSelected({ row, edit: true });
    }

    const handleDelete = () => {

        const callback = () => {
            dispatch(execute(iaservicesBulkDel(Object.keys(selectedRows).join())));
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

            <div style={{ width: "100%" }}>
                {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread, { id: "view-1", name: t(langKeys.iaconfiguration) }]}
                        handleClick={functionChange}
                    />
                </div>}
                <TableZyx
                    onClickRow={handleEdit}
                    ButtonsElement={() => {
                        if (!setExternalViewSelected) {
                            return <><Button
                                variant="contained"
                                color="primary"
                                disabled={mainResult.mainData.loading || Object.keys(selectedRows).length === 0}
                                type='button'
                                style={{ backgroundColor: (mainResult.mainData.loading || Object.keys(selectedRows).length === 0) ? "#dbdbdb" : "#FB5F5F" }}
                                startIcon={<Delete style={{ color: 'white' }} />}
                                onClick={() => handleDelete()}
                            >{t(langKeys.delete)}
                            </Button>
                            </>
                        } else {
                            return (
                                <Button
                                    disabled={mainResult.mainData.loading}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: "#FB5F5F" }}
                                    onClick={() => setExternalViewSelected("view-1")}
                                >{t(langKeys.back)}</Button>
                            )
                        }
                    }}
                    columns={columns}
                    filterGeneral={false}
                    titlemodule={t(langKeys.iaconfiguration)}
                    data={mainResult.mainData.data}
                    download={false}
                    loading={mainResult.mainData.loading}
                    register={true}
                    handleRegister={handleRegister}
                    useSelection={true}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                />
            </div>
        )
    }
    else if (viewSelected === "view-2") {
        return (
            <IAConfigurationDetail
                data={rowSelected}
                setViewSelected={functionChange}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
    } else
        return null;

}

export default IAConfiguration;