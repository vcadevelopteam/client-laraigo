/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { TemplateBreadcrumbs } from 'components';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { Button } from '@material-ui/core';
import TableZyx from 'components/fields/table-simple';
import ClearIcon from '@material-ui/icons/Clear';
import { useDispatch } from 'react-redux';
import { manageConfirmation, showBackdrop, showSnackbar } from 'store/popus/actions';
import { convertLocalDate, uploadExcel } from 'common/helpers';
import { intentimport } from 'store/witia/actions';
import { resetAllMain } from 'store/main/actions'
import { downloadrasaia, modellistrasaia, trainrasaia } from 'store/rasaia/actions';

interface IntentionProps {
    setExternalViewSelected?: (view: string) => void;
    arrayBread?: any;
}

export const ModelsRasa: React.FC<IntentionProps> = ({ setExternalViewSelected, arrayBread }) => {
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [waitSave, setWaitSave] = useState(false);
    const [sendTrainCall, setSendTrainCall] = useState(false);
    const operationRes = useSelector(state => state.witai.witaioperationresult);
    const [waitExport, setWaitExport] = useState(false);
    const multiResult = useSelector(state => state.main.multiData);
    const dataModelAi = useSelector(state => state.main.mainAux);

    const [waitImport, setWaitImport] = useState(false);
    const [modelData, setModelData] = useState<any>([]);
    const trainResult = useSelector(state => state.rasaia.rasaiatrainresult);
    const exportResult = useSelector(state => state.rasaia.rasaiadownloadresult);
    const mainData = useSelector(state => state.rasaia.rasaiamodellistresult);

    const fetchData = () => {dispatch(modellistrasaia({model_uuid: dataModelAi?.data?.[0]?.model_uuid||""}))};
    const selectionKey = 'name';

    
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
            setModelData(mainData.data.reduce((acc:any,x:any)=>[...acc, {name:x}],[]))
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
    }, [operationRes, operationRes]);

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'name',
                width: "auto",
                NoFilter: true,
                
            },
        ],
        []
    );
    const handleDelete = () => {
        const callback = () => {/*
            let allRequestBody: IRequestBody[] = [];
            Object.keys(selectedRows).forEach(x => {
                allRequestBody.push(rasaSynonimIns({...mainResult.mainData.data.find(y=>y.rasasynonymid === parseInt(x)), operation:"DELETE", id: x}));
            });
            dispatch(getMultiCollection(allRequestBody))
            dispatch(showBackdrop(true));
            setWaitSave(true);*/
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    
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

    const handleUpload = async (files: any[]) => {
        const file = files[0];
        if (file) {
            const data: any = (await uploadExcel(file, undefined) as any[]).filter((d: any) => !['', null, undefined].includes(d.intent_name));
            if (data.length > 0) {
                let datareduced = data.reduce((acc:any,element:any)=>{
                    let repeatedindex = acc.findIndex((item:any)=>item.name === element.intent_name)
                    if (repeatedindex < 0){
                        return [...acc, {
                            name: element.intent_name,
                            description: element.intent_description,
                            datajson: JSON.parse(element.intent_datajson),
                            utterance_datajson: [{
                                name: element.utterance_name,
                                datajson: JSON.parse(element.utterance_datajson)
                            }]
                        }]
                    }else{
                        let newacc = acc
                        newacc[repeatedindex].utterance_datajson.push(
                            {
                                name: element.utterance_name,
                                datajson: JSON.parse(element.utterance_datajson)
                            })                         
                        return newacc

                    }
                },[])
                dispatch(showBackdrop(true));
                setWaitImport(true)
                dispatch(intentimport({
                    utterance_datajson: JSON.stringify(datareduced.reduce((acc:any,x:any) => [...acc,...x.utterance_datajson],[])),
                    datajson: JSON.stringify(datareduced.map((x:any) => ({ name:x.name, description:x.description, datajson:x.datajson }))),
                }))            
            }
            else {
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) }));
            }
        }
    }
    
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
                    useSelection={true}
                    titlemodule={!!arrayBread?t(langKeys.model_plural):""}
                    selectionKey={selectionKey}
                    setSelectedRows={setSelectedRows}
                    ButtonsElement={() => (     
                        <div style={{display: "flex", justifyContent: "end", width: "100%"}}>                       
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <Button
                                    disabled={Object.keys(selectedRows).length===0}
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    startIcon={<ClearIcon color="secondary" />}
                                    style={{ backgroundColor: Object.keys(selectedRows).length===0?"#dbdbdc":"#FB5F5F" }}
                                    onClick={handleDelete}
                                >{t(langKeys.delete)}</Button>
                                <Button
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    disabled={dataModelAi.loading|| trainResult.loading}
                                    style={{ backgroundColor: "#7721ad" }}
                                    onClick={()=>{dispatch(trainrasaia({model_uuid: dataModelAi?.data?.[0]?.model_uuid||""}));setSendTrainCall(true);}}
                                >{t(langKeys.train)}</Button>
                            </div>
                        </div>
                    )}
                    loading={mainData.loading}
                    download={true}
                    triggerExportPersonalized={true}
                    exportPersonalized={triggerExportData}
                    importCSV={handleUpload}
                    pageSizeDefault={20}
                    initialPageIndex={0}
                />
            </div>
        </React.Fragment>
        );
}