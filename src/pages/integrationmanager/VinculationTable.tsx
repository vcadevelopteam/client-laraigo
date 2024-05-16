import { Dictionary } from "@types";
import { integrationManagerBulkloadIns, integrationManagerCodePersonDel, integrationManagerCodePersonExport, integrationManagerCodePersonSel, uploadExcel } from "common/helpers";
import { TemplateBreadcrumbs, TitleDetail } from "components";
import TableZyx from "components/fields/table-simple";
import { langKeys } from "lang/keys";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { execute, exportData, getCollectionAux2 } from "store/main/actions";
import { useSelector } from 'hooks';
import { manageConfirmation, showBackdrop, showSnackbar } from "store/popus/actions";

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
    const [data, setData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>({});
    const executeResult = useSelector(state => state.main.execute);
    const collectionAux2 = useSelector(state => state.main.mainAux2);

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
            setData(flattenedData)
        }
    }, [collectionAux2])

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
                    return regexFecha.test(objeto["Fecha de caducidad"]);
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
    };

    const columnsData = useMemo(() => {
        let objs: any = [...row[title].columns, ...row[title].tracking_columns]
        objs = [...new Set(objs)];
        return objs.map((c) => ({
            Header: c,
            accessor: c,
            width: objs.length ? `${(Math.floor(100 / objs.length))}%` : "10%"
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
                dispatch(showSnackbar({ show: true, severity: "error", message: "error" }))
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
                dispatch(showSnackbar({ show: true, severity: "error", message: "error" }))
                dispatch(showBackdrop(false));
                setWaitDelete(false);
            }
        }
    }, [executeResult, waitDelete]);

    return (
        <div>
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
                useSelection
                setSelectedRows={setSelectedRows}
                pageSizeDefault={20}
                filterGeneral={false}
                importData={true}
                loading={collectionAux2.loading}
                importDataFunction={handleUpload}
                deleteData={true}
                deleteDataFunction={deleteDataFunction}
            />
        </div>

    );
};

export default VinculationTable;