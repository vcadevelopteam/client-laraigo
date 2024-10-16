
import React, { useEffect, useState } from 'react'; 
import { useSelector } from 'hooks';
import { TemplateBreadcrumbs } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { IconButton } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import { useDispatch } from 'react-redux';
import { showBackdrop, showSnackbar } from 'store/popus/actions';
import { convertLocalDate } from 'common/helpers';
import { resetAllMain } from 'store/main/actions'
import { downloadmodelrasaia, downloadrasaia, modellistrasaia } from 'store/rasaia/actions';
import GetAppIcon from '@material-ui/icons/GetApp';
import { CellProps } from 'react-table';
import { Dictionary } from '@types';

interface IntentionProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}

export const ModelTest: React.FC<IntentionProps> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [waitSave, setWaitSave] = useState(false);
    const [sendTrainCall, setSendTrainCall] = useState(false);
    const operationRes = useSelector(state => state.witai.witaioperationresult);
    const [waitExport, setWaitExport] = useState(false);
    const multiResult = useSelector(state => state.main.multiData);
    const dataModelAi = useSelector(state => state.main.mainAux);

    const [waitImport, setWaitImport] = useState(false);
    const [waitDownload, setWaitDownload] = useState(false);
    const [modelData, setModelData] = useState<any>([]);
    const trainResult = useSelector(state => state.rasaia.rasaiatrainresult);
    const exportResult = useSelector(state => state.rasaia.rasaiadownloadresult);
    const dowloadResult = useSelector(state => state.rasaia.downloadModel);
    const mainData = useSelector(state => state.rasaia.rasaiamodellistresult);

    const fetchData = () => {dispatch(modellistrasaia({model_uuid: dataModelAi?.data?.[0]?.model_uuid||""}))};

    
    useEffect(() => {
        if(sendTrainCall){
            if(!trainResult.loading && !trainResult.error){
                let message=t(langKeys.bot_training_scheduled)
                dispatch(showSnackbar({ show: true, severity: "success", message:  message}))
                setSendTrainCall(false);
                dispatch(showBackdrop(false));
            }else if(trainResult.error){
                dispatch(showSnackbar({ show: true, severity: "error", message: trainResult.message + "" }))
                setSendTrainCall(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [trainResult,sendTrainCall]);
    useEffect(() => {
        if(mainData.success && !mainData.error){
            setModelData(mainData?.data||[])
        }
    }, [mainData]);
    
    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!multiResult.loading && !multiResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
            } else if (multiResult.error) {
                const errormessage = t(multiResult.code || "error_unexpected_error", { module: t(langKeys.model_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                setWaitSave(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [multiResult, waitSave])

    useEffect(() => {
        if (waitDownload) {
            if (!dowloadResult.loading && !dowloadResult.error) {
                dispatch(showBackdrop(false));
                setWaitDownload(false);
                window.open(dowloadResult?.url||"", "_blank");
            } else if (dowloadResult.error) {
                const errormessage = t(dowloadResult.code || "error_unexpected_error", { module: t(langKeys.model_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitDownload(false);
            }
        }
    }, [dowloadResult, waitDownload]);
    
    useEffect(() => {
        if (waitImport) {
            if (!operationRes.loading && !operationRes.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_transaction) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitImport(false);
            } else if (operationRes.error) {
                const errormessage = t(operationRes.code || "error_unexpected_error", { module: t(langKeys.model_plural).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitImport(false);
            }
        }
    }, [operationRes, waitImport]);

    const columns = React.useMemo(
        () => [
            {
                Header: "",
                accessor: 'personid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <IconButton
                            size='small'
                            disabled={waitDownload}
                            onClick={() => {
                                dispatch(downloadmodelrasaia({model_uuid: dataModelAi?.data?.[0]?.model_uuid||"", model_name: row?.model_name||""}));
                                setWaitDownload(true);
                            }}
                        >
                            <GetAppIcon />
                        </IconButton>
    
                    )
                }
            },
            {
                Header: t(langKeys.name),
                accessor: 'model_name',
                width: "auto",
                NoFilter: true,
                
            },
            {
                Header: t(langKeys.creationDate),
                accessor: 'createdate',
                width: "auto",
                NoFilter: true,
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return convertLocalDate(row.createdate).toLocaleString()
                }
            },
            {
                Header: t(langKeys.status),
                accessor: 'status',
                NoFilter: true,
                prefixTranslation: 'status_',
                width: "auto",
                Cell: (props: CellProps<Dictionary>) => {
                    const { status } = props.cell.row.original;
                    return (t(`status_${status}`.toLowerCase()) || "").toUpperCase()
                }
            },
        ],
        []
    );

    
    const triggerExportData = () => {
        dispatch(downloadrasaia({model_uuid: dataModelAi?.data?.[0]?.model_uuid||"", origin: "synonym"}))
        dispatch(showBackdrop(true));
        setWaitExport(true);
    };

    useEffect(() => {
        if (waitExport) {
            if (!exportResult.loading && !exportResult.error) {
                dispatch(showBackdrop(false));
                setWaitExport(false);
                window.open(exportResult?.url||"", '_blank');
            } else if (exportResult.error) {
                const errormessage = t(exportResult.code || "error_unexpected_error", { module: t(langKeys.blacklist).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitExport(false);
            }
        }
    }, [exportResult, waitExport]);
    
    return (
        <React.Fragment>
            <div style={{ height: 10 }}></div>
            <div style={{ width: "100%" }}>
                {!!arrayBread && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TemplateBreadcrumbs
                        breadcrumbs={[...arrayBread,{ id: "view-1", name:  t(langKeys.model_plural) }]}
                        handleClick={setExternalViewSelected}
                    />
                </div>}
                <TableZyx
                    columns={columns}
                    data={modelData}
                    filterGeneral={false}
                    titlemodule={!!arrayBread?t(langKeys.model_plural):""}
                    loading={mainData.loading}
                    download={false}
                    triggerExportPersonalized={true}
                    exportPersonalized={triggerExportData}
                    pageSizeDefault={20}
                    initialPageIndex={0}
                />
            </div>
        </React.Fragment>
        );
}