import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons } from 'components';
import { insDomain } from 'common/helpers';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import TableZyx from 'components/fields/table-simple';

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DocumentLibraryMainViewProps {
    setViewSelected: (a: string) => void;
    setRowSelected: (a: RowSelected) => void;    
    fetchData: () => void;
}

const DocumentLibraryMainView: FC<DocumentLibraryMainViewProps> = ({setViewSelected, setRowSelected, fetchData}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [waitSave, setWaitSave] = useState(false);
    const user = useSelector(state => state.login.validateToken.user);
    const superadmin = (user?.roledesc ?? "").split(",").some(v => ["SUPERADMIN", "ADMINISTRADOR", "ADMINISTRADOR P"].includes(v));

    const columns = React.useMemo(
        () => [
            {
                accessor: 'documentlibraryid',
                NoFilter: true,
                isComponent: true,
                minWidth: 60,
                width: '1%',
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                        <TemplateIcons
                            deleteFunction={() => handleDelete(row)}
                        />
                    )
                }
            },
            {
                Header: t(langKeys.title),
                accessor: 'title',
                NoFilter: true
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true
            },
            {
                Header: t(langKeys.category),
                accessor: 'category',
                NoFilter: true
            },
            {
                Header: t(langKeys.group_plural),
                accessor: 'groups',
                NoFilter: true,
            },
            {
                Header: t(langKeys.registrationdate),
                accessor: 'createdate',
                NoFilter: true,
            },
            {
                Header: t(langKeys.changeDate),
                accessor: 'changedate',
                NoFilter: true
            },
            {
                Header: t(langKeys.uploadedby),
                accessor: 'createby',
                NoFilter: true
            },
            {
                Header: t(langKeys.change_by),
                accessor: 'changeby',
                NoFilter: true
            },
        ],
        []
    );

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "success", message: t(langKeys.successful_delete) }))
                fetchData();
                dispatch(showBackdrop(false));
                setWaitSave(false);
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", { module: t(langKeys.domain).toLocaleLowerCase() })
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

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
            dispatch(execute(insDomain({ ...row, operation: 'DELETE', status: 'ELIMINADO' })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    return (
        <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.documentlibrary)}
                data={mainResult.mainData.data}
                download={true}
                onClickRow={handleEdit}
                loading={mainResult.mainData.loading}
                register={superadmin}
                handleRegister={handleRegister}
            />
        </div>
    )
}

export default DocumentLibraryMainView;