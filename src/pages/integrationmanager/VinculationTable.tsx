import { integrationManagerBulkloadIns, integrationManagerCodePersonDel, integrationManagerCodePersonSel, uploadExcel } from "common/helpers";
import { TemplateBreadcrumbs, TitleDetail } from "components";
import TableZyx from "components/fields/table-simple";
import { langKeys } from "lang/keys";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { execute, exportData, getCollectionAux2, uploadFile } from "store/main/actions";
import { useSelector } from 'hooks';
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";
import ClearIcon from '@material-ui/icons/Clear';
import { processzip_send } from "store/integrationmanager/actions";
import { Button } from "@material-ui/core";

interface VinculationTableProps {
    title: string;
    setViewSelected: (value: string) => any;
    row: any;
}
const key = "id"
const VinculationTable: React.FC<VinculationTableProps> = ({
    title,
    setViewSelected,
    row,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [waitValidation, setWaitValidation] = useState(false);
    const [waitDelete, setWaitDelete] = useState(false);
    const [waitSaveUpload, setWaitSaveUpload] = useState(false);
    const [waitSaveZip, setWaitSaveZip] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const executeResult = useSelector(state => state.main.execute);
    const zipResult = useSelector(state => state.integrationmanager.processzip);
    const collectionAux2 = useSelector(state => state.main.mainAux2);
    const uploadResult = useSelector(state => state.main.uploadFile);

    const fetchData = () => dispatch(getCollectionAux2(integrationManagerCodePersonSel({ integrationmanagerid: row.id, type: title === "code_table" ? "CODE" : "PERSON" })))

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (!collectionAux2.loading && !collectionAux2.error) {
            const flattenedData = collectionAux2.data.map((obj) => {
                let newData = { ...obj };
                delete newData.json_data;
                delete newData.tracking_data;

                newData = { ...newData, ...obj.json_data, ...obj.tracking_data };

                return newData;
            });
            flattenedData.forEach(item => {
                if (item.hasOwnProperty('Fecha de caducidad')) {
                    const fecha = new Date(item['Fecha de caducidad'])
                    
                    const dia = fecha.getUTCDate();
                    const mes = fecha.getUTCMonth() + 1; 
                    const anio = fecha.getUTCFullYear();

                    item['Fecha de caducidad'] = `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${anio}`;
                }
            });
            setData(flattenedData)
        }
    }, [collectionAux2])
    useEffect(() => {
        if(waitSaveUpload){
            if(!uploadResult.error && !uploadResult.loading){
                setWaitSaveUpload(false);
                setWaitSaveZip(true)
                dispatch(processzip_send({
                    fileurl: uploadResult.url,
                    integrationmanagerid: row.id
                }))
            }else if (uploadResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: "Error" }));            
                setWaitSaveUpload(false);
                dispatch(showBackdrop(false));
            }
        }
    }, [waitSaveUpload, uploadResult])
    useEffect(() => {
        if (waitSaveZip) {
            if (!zipResult.loading && !zipResult.error) {
                dispatch(showBackdrop(false));
                setWaitSaveZip(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                fetchData()
            } else if (zipResult.error) {
                const message = t(zipResult.code || "error_unexpected_error", { module: t(title).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: message }))
                dispatch(showBackdrop(false));
                setWaitSaveZip(false);
            }
        }
    }, [zipResult, waitSaveZip]);

    const validateObjects = (data) => {
        let headers: any = [...row[title].columns]
        headers = [...new Set(headers)];
        const validObjects = [];
        for (const obj of data) {
            const missingKeys = new Set(headers);
            for (const key in obj) {
                missingKeys.delete(key);
            }
            if (missingKeys.size === 0) {
                validObjects.push(obj);
            }
        }
        return validObjects;
    };
    const handleUpload = async (files: any) => {
        const file = files?.item(0);
        files = null
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if(fileExtension==="7z" || fileExtension ==="zip"){
                const idd = new Date().toISOString()
                const fd = new FormData();
                fd.append('file', file, file.name);
                dispatch(showBackdrop(true));
                dispatch(uploadFile(fd));
                setWaitSaveUpload(true);
            }else{
                let data: any = await uploadExcel(file, undefined);
                data = validateObjects(data)
                
                let codigosSet = new Set();
    
                let hayRepetidos = false;
    
                if(title === "code_table"){
                    data.forEach(objeto => {
                        if (codigosSet.has(objeto.Codigo)) {
                            hayRepetidos = true;
                        } else {
                            codigosSet.add(objeto.Codigo);
                        }
                    });
                }else{
                    data.forEach(objeto => {
                        if (codigosSet.has(objeto.Persona)) {
                            hayRepetidos = true;
                        } else {
                            codigosSet.add(objeto.Persona);
                        }
                    });
                }
                if(!hayRepetidos){
                    let regexFecha = /^\d{2}\/\d{2}\/\d{4}$/;
                    
                    let objetosFiltrados = data.filter(objeto => {
                        if (!objeto.hasOwnProperty("Fecha de caducidad")) {
                            return true;
                        }
                        if (!isNaN(objeto["Fecha de caducidad"]) && Number.isInteger(parseFloat(objeto["Fecha de caducidad"]))) {
                            return true; 
                        }
                        return regexFecha.test(objeto["Fecha de caducidad"]);
                    });
                    const fechaBaseExcel = new Date(1900, 0, 1);
                    
                    objetosFiltrados.forEach(objeto => {
                        if (objeto.hasOwnProperty("Fecha de caducidad")) {
                            if (!isNaN(objeto["Fecha de caducidad"]) && Number.isInteger(parseFloat(objeto["Fecha de caducidad"]))) {
                                const numeroSerieFecha = objeto["Fecha de caducidad"];
                                const fecha = new Date(fechaBaseExcel.getTime() + (numeroSerieFecha - 1) * 24 * 60 * 60 * 1000);
                                fecha.setUTCHours(0, 0, 0, 0);
                                objeto["Fecha de caducidad"] = fecha;
                            } else {
                                const partesFecha = objeto["Fecha de caducidad"].split("/");
                                const dia = parseInt(partesFecha[0], 10);
                                const mes = parseInt(partesFecha[1], 10) - 1;
                                const anio = parseInt(partesFecha[2], 10);
                                const fecha = new Date(anio, mes, dia);
                                objeto["Fecha de caducidad"] = fecha;
                            }
                        }
                    });
    
                    if (objetosFiltrados.length > 0) {
                        const callback = () => {
                            dispatch(execute(integrationManagerBulkloadIns({
                                integrationmanagerid: row.id,
                                table: JSON.stringify(objetosFiltrados),
                                type: title === "code_table" ? "CODE" : "PERSON"
                            })))
                            setWaitValidation(true)
                            dispatch(showBackdrop(true));
                        }
                        dispatch(manageConfirmation({
                            visible: true,
                            question: t(langKeys.confirmation_save),
                            callback
                        }))
                    }
                    else {
                        dispatch(showBackdrop(false));
                        dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.no_records_valid) }));
                    }
                }else{
                    dispatch(showBackdrop(false));
                    dispatch(showSnackbar({ show: true, severity: "error", message: title === "code_table"?t(langKeys.repeated_code):t(langKeys.repeated_person) }));
                }
            }
        }
    };

    const columnsData = useMemo(() => {
        let objs: any = [...row[title].columns, ...row[title].tracking_columns]
        objs = [...new Set(objs)];
        return objs.map((c) => ({
            Header: c,
            accessor: c,
            width: objs.length ? `${(Math.floor(100 / objs.length))}%` : "10%",
            /*Cell: (props: any) => {
                const row = props.cell.row.original || {};
                if(props.column.Header === "Fecha de caducidad"){
                    console.log(row["Fecha de caducidad"])
                    const fecha = new Date(row["Fecha de caducidad"]);
                    
                    const dia = fecha.getUTCDate();
                    const mes = fecha.getUTCMonth() + 1; 
                    const anio = fecha.getUTCFullYear();

                    return `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${anio}`;
                }else{
                    return row[props.column.Header]||""
                }
            }*/
        }));
    }, [row]);


    const deleteDataFunction = () => {
        if(Object.keys(selectedRows).join()){
            const callback = () => {
                dispatch(showBackdrop(true));
                dispatch(execute(integrationManagerCodePersonDel({
                    integrationmanagerid: row.id,
                    type: title === "code_table" ? "CODE" : "PERSON",
                    ids: Object.keys(selectedRows).join()
                })));
                setWaitDelete(true);
            };
    
            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_delete_data),
                    callback,
                })
            );
        }
    };

    useEffect(() => {
        if (waitValidation) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showBackdrop(false));
                setWaitValidation(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_register) }))
                fetchData()
            } else if (executeResult.error) {
                const message = t(executeResult.code || "error_unexpected_error", { module: t(title).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: message }))
                dispatch(showBackdrop(false));
                setWaitValidation(false);
            }
        }
    }, [executeResult, waitValidation]);

    useEffect(() => {
        if (waitDelete) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showBackdrop(false));
                setWaitDelete(false);
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData()
            } else if (executeResult.error) {
                const message = t(executeResult.code || "error_unexpected_error", { module: t(title).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: message }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [executeResult, waitDelete]);

    return (        
        <div style={{width:"100%"}}>
            <TemplateBreadcrumbs
                breadcrumbs={[
                    {
                        id: "view-1",
                        name: t(langKeys.integrationmanagerdetail),
                    },
                    {
                        id: title,
                        name: t(title),
                    },
                ]}
                handleClick={setViewSelected}
            />
            <TitleDetail
                title={t(title)}
            />
            <TableZyx
                columns={columnsData}
                data={data}
                download={true}
                selectionKey={key}
                titlemodule={" "}
                useSelection
                setSelectedRows={setSelectedRows}
                pageSizeDefault={20}
                filterGeneral={false}
                importData={true}
                ButtonsElement={() => (
                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        startIcon={<ClearIcon color="secondary" />}
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => setViewSelected("view-1")}
                    >{t(langKeys.back)}</Button>
                )}
                loading={collectionAux2.loading}
                importDataFunction={handleUpload}
                deleteData={true}
                deleteDataFunction={deleteDataFunction}
                acceptTypeLoad="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv,application/zip,application/x-7z-compressed"
            />
        </div>

    );
};

export default VinculationTable;