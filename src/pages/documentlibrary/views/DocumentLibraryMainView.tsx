import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { TemplateIcons } from 'components';
import { documentLibraryIns, exportExcel, templateMaker } from 'common/helpers';
import { Dictionary } from "@types";
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { execute } from 'store/main/actions';
import { showSnackbar, showBackdrop, manageConfirmation } from 'store/popus/actions';
import TableZyx from 'components/fields/table-simple';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ModalDocPreview from '../modal/ModalDocPreview';
import { Button, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import ListAltIcon from "@material-ui/icons/ListAlt";

interface RowSelected {
    row: Dictionary | null;
    edit: boolean;
}

interface DocumentLibraryMainViewProps {
    setViewSelected: (a: string) => void;
    setRowSelected: (a: RowSelected) => void;    
    fetchData: () => void;
}

const selectionKey = 'documentlibraryid';

const DocumentLibraryMainView: FC<DocumentLibraryMainViewProps> = ({setViewSelected, setRowSelected, fetchData}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.main);
    const executeResult = useSelector(state => state.main.execute);
    const [waitSave, setWaitSave] = useState(false);
    const [openModalPreview, setOpenModalPreview] = useState<any>(null);
    const user = useSelector(state => state.login.validateToken.user);
    const [selectedRows, setSelectedRows] = useState<any>({});
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
                NoFilter: true,
                width: '15%',
            },
            {
                Header: t(langKeys.description),
                accessor: 'description',
                NoFilter: true,
                width: '15%',
            },
            {
                Header: t(langKeys.category),
                accessor: 'category',
                NoFilter: true,
                width: '15%',
            },
            {
                Header: t(langKeys.group_plural),
                accessor: 'groups',
                NoFilter: true,
                width: '15%',
            },
            {
                Header: t(langKeys.registrationdate),
                accessor: 'createdate',
                NoFilter: true,
                width: '15%',
            },
            {
                Header: t(langKeys.changeDate),
                accessor: 'changedate',
                NoFilter: true,
                width: '15%',
            },
            {
                Header: t(langKeys.uploadedby),
                accessor: 'createby',
                NoFilter: true,
                width: '15%',
            },
            {
                Header: t(langKeys.change_by),
                accessor: 'changeby',
                NoFilter: true,
                width: '15%',
            },
            {
                Header: "",
                accessor: 'link',
                NoFilter: true,
                width: '15%',  
                isComponent: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;
                    return (
                    <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>
                        
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                if(row?.link?.endsWith("pdf")){
                                    setOpenModalPreview({
                                        link: row?.link||"",
                                        title: row?.title || "",})
                                }else{
                                    window.open(row?.link, "_blank");
                                }
                            }}
                            style={{ display: 'block' }}
                        >
                            <VisibilityIcon style={{ color: '#B6B4BA' }} />
                        </IconButton>

                    </div>)
                    
                    
                }
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
            dispatch(execute(documentLibraryIns({ ...row, id: row?.documentlibraryid||"", operation: 'DELETE', status: 'ELIMINADO' })));
            dispatch(showBackdrop(true));
            setWaitSave(true);
        }

        dispatch(manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback
        }))
    }

    const handleTemplate = () => {
        const data = [
            {},
            {},
            (mainResult?.multiData?.data?.[0]?.data || [])?.reduce((a, d) => ({ ...a, [d.domainvalue]: d.domaindesc }), {}),
            {},
            {},
        ];
        const header = [
            "title",
            "description",
            "groups",
            "linkfile",
            "category",
        ];
        exportExcel(`${t(langKeys.template)} ${t(langKeys.import)}`, templateMaker(data, header));
    };

    return (
        <div style={{ width: "100%", display: 'flex', flexDirection: 'column', flex: 1 }}>
            <TableZyx
                columns={columns}
                titlemodule={t(langKeys.documentlibrary)}
                helperText={t(langKeys.documentlibraryhelperText)}
                data={mainResult.mainData.data}
                download={true}
                useSelection={true}
                selectionKey={selectionKey}
                onClickRow={handleEdit}
                setSelectedRows={setSelectedRows}
                loading={mainResult.mainData.loading}
                register={superadmin}
                handleRegister={handleRegister}
                ButtonsElement={() => (
                    <>
                        <Button
                            color="primary"
                            disabled={mainResult.mainData.loading || Object.keys(selectedRows).length === 0}
                            onClick={() => {
                                debugger
                            }}
                            startIcon={<ClearIcon style={{ color: 'white' }} />}
                            variant="contained"
                            style={{ backgroundColor: !(mainResult.mainData.loading || Object.keys(selectedRows).length === 0)?"#FB5F5F":"#dbdbdc" }}
                        >{t(langKeys.delete)}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={mainResult.loading}
                            startIcon={<ListAltIcon color="secondary" />}
                            onClick={handleTemplate}
                            style={{ backgroundColor: "#55BD84" }}
                        >
                            {`${t(langKeys.template)}  ${t(langKeys.import)}`}
                        </Button>
                    </>
                )}
            />
            <ModalDocPreview
                openModal={openModalPreview}
                setOpenModal={setOpenModalPreview}
            />
        </div>
    )
}

export default DocumentLibraryMainView;