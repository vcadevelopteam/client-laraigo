import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getValuesFromDomain, getDocumentLibrary } from 'common/helpers';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { cleanMemoryTable, getCollection, getMultiCollection, resetAllMain, setMemoryTable } from 'store/main/actions';
import { showSnackbar, showBackdrop } from 'store/popus/actions';
import DocumentLibraryMainView from './views/DocumentLibraryMainView';
import DocumentLibraryDetailView from './views/DocumentLibraryDetailView';

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

const DocumentLibrary: FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [viewSelected, setViewSelected] = useState("view-1");
    const [rowSelected, setRowSelected] = useState<RowSelected>({ row: null, edit: false });
    const [waitSave, setWaitSave] = useState(false);

    const arrayBread = [
        { id: "view-1", name: t(langKeys.documentlibrary) },
    ];
    function redirectFunc(view: string) {
        setViewSelected(view)
    }

    const fetchData = () => dispatch(getCollection(getDocumentLibrary()));

    useEffect(() => {
        fetchData();
        dispatch(getMultiCollection([
            getValuesFromDomain("GRUPOS"),
            getValuesFromDomain("TIPODOMINIO")
        ]));

        dispatch(setMemoryTable({
            id: "IDDOCUMENTLIBRARY"
        }))
        return () => {
            dispatch(resetAllMain());
            dispatch(cleanMemoryTable());
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
                const errormessage = t(executeResult.code ?? "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }))
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave])

    if (viewSelected === "view-1") {

        if (mainResult.mainData.error) {
            return <h1>ERROR</h1>;
        }

        return (
            <DocumentLibraryMainView
                setRowSelected={setRowSelected}
                setViewSelected={setViewSelected}
                fetchData={fetchData}
            />
        )
    }
    else
        return (
            <DocumentLibraryDetailView
                data={rowSelected}
                setViewSelected={redirectFunc}
                multiData={mainResult.multiData.data}
                fetchData={fetchData}
                arrayBread={arrayBread}
            />
        )
}

export default DocumentLibrary;