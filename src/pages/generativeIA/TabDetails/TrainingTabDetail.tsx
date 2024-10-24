import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { useSelector } from "hooks";
import { showSnackbar, showBackdrop, manageConfirmation } from "store/popus/actions";
import { useDispatch } from "react-redux";
import { Button, Card, Grid, IconButton, Modal, Typography } from "@material-ui/core";
import TableZyx from "components/fields/table-simple";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { FieldEdit } from "components";
import { execute, uploadFile } from "store/main/actions";
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from "@types";
import { FieldErrors, useForm } from "react-hook-form";
import { insAssistantAiDoc } from "common/helpers";
import { CellProps } from "react-table";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CachedIcon from '@material-ui/icons/Cached';
import { UploadFileIcon } from "icons";
import { deleteFile } from "store/gpt/actions";
import { addFile, assignFile } from "store/gpt/actions";
import { addFilesLlama, deleteFileLlama } from "store/llama/actions";
import DeleteIcon from '@material-ui/icons/Delete';
import { addFilesLlama3, deleteFileLlama3 } from "store/llama3/actions";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
    },
    containerDetail2: {
        marginTop: '1rem',
        display: 'flex',
        gap:'1rem'
    },
    containerBox: {
        width:'50%', 
        background: "#fff",
        padding: '1rem'
    },
    containerHeader: {
        marginTop: '1rem',
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    container2: {
        display: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardsContainer: {
        marginTop: "1.5rem",
        justifyContent: 'center',
        alignItems: 'center',
        gap: "1.5rem",
        display: 'flex'
    },
    card: {
        position: 'relative',
        width: '100%',
        padding: "1rem",
        backgroundColor: '#F5F5F5',
        cursor: 'pointer'
    },
    cardContent: {
        textAlign: 'center',
        alignContent: 'center'
    },
    cardTitle: {
        fontWeight: 'bold',
        paddingBottom: '1rem',
        fontSize: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#ffff',
        color: '#7721AD',
        '&:hover': {
            backgroundColor: '#EBEAED',
            borderRadius: 4
        }
    },
    logo: {
        height: 80,
        width: "100%",
        justifyContent: 'center',
        marginBottom: 5,
    },
    uploadCard: {
        marginTop: 20,
        width: '100%',
        height: 350,
        padding: 20,
        border: '3px dashed grey',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#E4E4E4',
        },
    },
    uploadCardContent: {
        textAlign: 'center',
    },
    clipButton: {
        backgroundColor: '#ffff',
        color: 'blue',
        border: '1px solid blue',
    },
    clipButton2: {
        backgroundColor: '#ffff',
        color: 'green',
        border: '1px solid green',
        marginTop: 20,
    },
    fileInfoCard: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: '#E4F8EA',
    },
    fileInfoCardContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleMargin: {
        marginTop: 10
    },
    cardText: {
        fontSize: '15px',
    },
    gridWidth: {
        minWidth: 500
    },
    gridWidth2: {
        minWidth: 200,
        width: '100%', 
    },    
    block10: {
        height: 10
    },
    uploadIcon: {
        height: 80,
        width: 80,
        padding: 10,
        justifyContent: 'center',
        color: 'green',
        backgroundColor: '#D3F9DD',
        borderRadius: '300px'
    },
    uploadTitle: {
        textDecoration: 'underline',
        marginBottom: 5
    },
    fileCardText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    fileCardName: {
        fontWeight: 'bold',
        fontSize: 20
    },
    block20: {
        height: 20
    },
    errorModalContent: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
    },
    purpleButton: {
        backgroundColor: '#ffff',
        color: '#7721AD'
    },
    loadingIndicator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        marginTop: 20
    },
    parameterContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    detailTitle: {
        fontWeight:'bold',
        fontSize: 18
    },
    widthBlock10: {
        width: 10
    },
    parameterDesc: {
        marginTop: 15
    }, 
    text: {
        fontSize: 16
    },
}));

interface TrainingTabDetailProps {
    row: Dictionary | null;
    fetchData: () => void;
    fetchAssistants: () => void;
    edit: boolean;
    setFile: (data: Dictionary[]) => void;
    provider: string;
    getValues: (field: string) => any;
    setValue: (field: any, value: any) => void;
    errors: FieldErrors
}

const TrainingTabDetail: React.FC<TrainingTabDetailProps> = ({
    row,
    fetchData,
    fetchAssistants,
    edit,
    setFile,
    provider,
    getValues,
    setValue,
    errors
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [waitSaveFileDelete, setWaitSaveFileDelete] = useState(false);
    const [viewSelected, setViewSelected] = useState('main');
    const dataDocuments = useSelector(state => state.main.mainAux);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [waitUploadFile2, setWaitUploadFile2] = useState(false);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const [isModalOpen, setModalOpen] = useState(false);
    const [documentUrl, setDocumentUrl] = useState("");
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [rowAux, setRowAux] = useState<Dictionary | null>(null);
    const [waitSaveAddFile, setWaitSaveAddFile] = useState(false);
    const [waitSaveAssignFile, setWaitSaveAssignFile] = useState(false);
    const executeFiles = useSelector((state) => state.gpt.gptResult);
    const llamaResult = useSelector((state) => state.llama.llamaResult);
    const llm3Result = useSelector(state => state.llama3.llama3Result);
    const multiDataAux = useSelector(state => state.main.multiDataAux);
    const [conector, setConector] = useState(row ? multiDataAux?.data?.[3]?.data?.find(item => item.id === row?.intelligentmodelsid) : {});
    const [waitSaveAddFileLlama, setWaitSaveAddFileLlama] = useState(false)
    const [waitSaveFileDeleteLlama, setWaitSaveFileDeleteLlama] = useState(false)
    const selectionKey = "assistantaidocumentid";
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [rowWithDataSelected, setRowWithDataSelected] = useState<Dictionary[]>([]);
    const [fileAttachments, setFileAttachments] = useState<any[]>([]);
    const [filesAux, setFilesAux] = useState<any[]>([]);
    const [fileIdsAux, setFileIdsAux] = useState<string[]>([])

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (!(Object.keys(selectedRows).length === 0 && rowWithDataSelected.length === 0)) {
            setRowWithDataSelected((p) =>
                Object.keys(selectedRows).map(
                    (x) =>
                        dataDocuments?.data.find((y) => y.assistantaidocumentid === parseInt(x)) ??
                        p.find((y) => y.assistantaidocumentid === parseInt(x)) ??
                        {}
                )
            );
        }
    }, [selectedRows]);

    const { register, handleSubmit, setValue: setFormValue, getValues: getFormValues } = useForm({
        defaultValues: {
            assistantaiid: row?.assistantaiid,
            id: 0,
            description: '',
            url: '',
            fileid: '',
            type: 'FILE',
            status: 'ACTIVO',
            operation: 'INSERT',
        }
    });
    React.useEffect(() => {
        register('assistantaiid');
        register('id');
        register('description');
        register('url');
        register('fileid');
        register('type');
        register('status');
        register('operation');
    }, [register, setFormValue]);

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById('attachmentInput');
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        setFilesAux(files);
        const file = files?.item(0);
        setFileAttachment(file);
        const fd = new FormData();
        fd.append('file', file, file.name);
        dispatch(uploadFile(fd));
        setWaitUploadFile2(true);
    }, [])

    useEffect(() => {
        if (waitUploadFile2) {
            if (!uploadResult.loading && !uploadResult.error) {
                const files2 = fileAttachments
                files2.push({ file_url: uploadResult?.url || '', file_name: fileAttachment?.name || '' })
                setFileAttachments(files2)

                const filesArray = Array.from(filesAux);
                filesArray.shift();
                const dataTransfer = new DataTransfer();
                filesArray.forEach(file => dataTransfer.items.add(file));
                const newFilesAux = dataTransfer.files;
                setWaitUploadFile2(false);
                if (newFilesAux.length > 0) onChangeAttachment(newFilesAux);
            } else if (uploadResult.error) {
                setWaitUploadFile2(false);
            }
        }
    }, [waitUploadFile2, uploadResult])

    useEffect(() => {
        if (waitSaveAssignFile) {
            if (!executeFiles.loading && !executeFiles.error) {
                setWaitSaveAssignFile(false);
                fileAttachments.map(async (file, index) => {
                    dispatch(execute(insAssistantAiDoc({
                        assistantaiid: row?.assistantaiid,
                        id: 0,
                        description: file.file_name,
                        url: file.file_url,
                        fileid: fileIdsAux[index],
                        type: 'FILE',
                        status: 'ACTIVO',
                        operation: 'INSERT',
                    })))
                })
                //dispatch(execute(insAssistantAiDoc({ ...getValues(), fileid: executeFiles.data.id })));
                setWaitSave(true);
            } else if (executeFiles.error) {
                const errormessage = t(executeFiles.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveAssignFile(false);
            }
        }
    }, [executeFiles, waitSaveAssignFile]);

    useEffect(() => {
        if (waitSaveAddFile) {
            if (!executeFiles.loading && !executeFiles.error) {
                setWaitSaveAddFile(false);
                const file_ids = executeFiles.data.map((item: Dictionary) => item.response.id);
                setFileIdsAux(file_ids);
                dispatch(assignFile({
                    assistant_id: row?.code,
                    file_ids: file_ids,
                    apikey: row?.apikey,
                }))
                setWaitSaveAssignFile(true);
            } else if (executeFiles.error) {
                const errormessage = t(executeFiles.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveAddFile(false);
            }
        }
    }, [executeFiles, waitSaveAddFile]);

    useEffect(() => {
        if (waitSaveAddFileLlama) {
            if(conector?.provider === "Laraigo") {
                if (!llm3Result.loading && !llm3Result.error) {
                    setWaitSaveAddFileLlama(false);
                    fileAttachments.map(async (file) => {
                        dispatch(execute(insAssistantAiDoc({
                            assistantaiid: row?.assistantaiid,
                            id: 0,
                            description: file.file_name,
                            url: file.file_url,
                            fileid: 'llamatest',
                            type: 'FILE',
                            status: 'ACTIVO',
                            operation: 'INSERT',
                        })))
                    })
                    setWaitSave(true);
                } else if (llm3Result.error) {
                    const errormessage = t(llm3Result.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setWaitSaveAddFileLlama(false);
                }
            } else {
                if (!llamaResult.loading && !llamaResult.error) {
                    setWaitSaveAddFileLlama(false);
                    fileAttachments.map(async (file) => {
                        dispatch(execute(insAssistantAiDoc({
                            assistantaiid: row?.assistantaiid,
                            id: 0,
                            description: file.file_name,
                            url: file.file_url,
                            fileid: 'llamatest',
                            type: 'FILE',
                            status: 'ACTIVO',
                            operation: 'INSERT',
                        })))
                    })
                    setWaitSave(true);
                } else if (llamaResult.error) {
                    const errormessage = t(llamaResult.code || "error_unexpected_error", {
                        module: t(langKeys.domain).toLocaleLowerCase(),
                    });
                    dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                    dispatch(showBackdrop(false));
                    setWaitSaveAddFileLlama(false);
                }
            }
        }
    }, [llamaResult, llm3Result, waitSaveAddFileLlama]);

    const handleUploadInNewAssistant = () => {
        setViewSelected('main')
        setFile(fileAttachments)
    }

    const handleUpload = handleSubmit(async () => {
        const callback = async () => {
            dispatch(showBackdrop(true));
            dispatch(addFile({
                files: fileAttachments,
                apikey: row?.apikey,
            }))
            setWaitSaveAddFile(true);
        };

        const callbackMeta = async () => {
            dispatch(showBackdrop(true));
            dispatch(addFilesLlama({
                urls: fileAttachments.map((item: Dictionary) => item.file_url),
                collection: row?.name
            }))
            setWaitSaveAddFileLlama(true);
        }

        const callbackLlm3 = async () => {
            dispatch(showBackdrop(true));
            dispatch(addFilesLlama3({
                urls: fileAttachments.map((item: Dictionary) => item.file_url),
                collection: row?.name,
                chunk_size: row?.chunk_size,
                chunk_overlap: row?.chunk_overlap,
            }))
            setWaitSaveAddFileLlama(true);
        }

        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback: (conector?.provider === 'Open AI' || conector?.provider === 'OpenAI') ? callback : conector?.provider === 'Laraigo' ? callbackLlm3 : callbackMeta,
            })
        );
    });

    const handleUploadURL = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insAssistantAiDoc({ ...data, type: "WEB" })));
            setWaitSave(true);
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        )
    });

    const handleMassiveDelete = () => {
        if (rowWithDataSelected.every(obj => obj.fileid === 'llamatest')) {
            const callback = async () => {
                dispatch(showBackdrop(true));
                rowWithDataSelected.map(async (row2) => {
                    if(row?.basemodel.startsWith('llama')) {
                        dispatch(deleteFileLlama3({
                            collection: row?.name,
                            filename: row2?.description,
                        }))
                    } else {
                        dispatch(deleteFileLlama({
                            collection: row?.name,
                            filename: row2?.description,
                        }))
                    }
                })
                rowWithDataSelected.map(async (row2) => {
                    dispatch(execute(insAssistantAiDoc({
                        ...row2,
                        id: row2?.assistantaidocumentid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                        type: "NINGUNO"
                    })));
                })
                setWaitSave(true);
            }
            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_delete_all),
                    callback,
                })
            );
        } else {
            const callback = async () => {
                dispatch(showBackdrop(true));
                dispatch(deleteFile({
                    file_ids: rowWithDataSelected.map((item) => item.fileid),
                    apikey: row?.apikey,
                }))
                setWaitSaveFileDelete(true)
            }
            dispatch(
                manageConfirmation({
                    visible: true,
                    question: t(langKeys.confirmation_delete_all),
                    callback,
                })
            );
        }
    }

    useEffect(() => {
        if (waitSaveFileDelete) {
            if (!executeFiles.loading && !executeFiles.error) {
                setWaitSaveFileDelete(false);
                rowWithDataSelected.map(async (row2) => {
                    dispatch(execute(insAssistantAiDoc({
                        ...row2,
                        id: row2?.assistantaidocumentid,
                        operation: "DELETE",
                        status: "ELIMINADO",
                        type: "NINGUNO"
                    })));
                })
                setWaitSave(true);
            } else if (executeFiles.error) {
                const errormessage = t(executeFiles.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveFileDelete(false);
            }
        }
    }, [executeFiles, waitSaveFileDelete]);

    useEffect(() => {
        if (waitSaveFileDeleteLlama) {
            if (!llamaResult.loading && !llamaResult.error) {
                setWaitSaveFileDeleteLlama(false);
                dispatch(execute(insAssistantAiDoc({
                    ...rowAux,
                    id: rowAux?.assistantaidocumentid,
                    operation: "DELETE",
                    status: "ELIMINADO",
                    type: "NINGUNO"
                })));
                setWaitSave(true);
                setRowAux(null)
            } else if (llamaResult.error) {
                const errormessage = t(llamaResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSaveFileDeleteLlama(false);
            }
        }
    }, [llamaResult, waitSaveFileDeleteLlama]);

    const handleDownloadDocument = () => {
        if (selectedDocumentUrl) {
            const downloadLink = document.createElement('a');
            const fileNameMatch = selectedDocumentUrl.match(/\/([^/]+)$/);
            const fileName = fileNameMatch ? fileNameMatch[1] : 'downloaded_file';

            downloadLink.download = fileName;

            document.body.appendChild(downloadLink);
            downloadLink.href = selectedDocumentUrl;
            downloadLink.click();
            document.body.removeChild(downloadLink);

        } else {
            console.error('Intento de descarga fallido. URL del documento no disponible.');
        }
    };

    const handleViewDocument = (url: string, type: string) => {
        if (type === "WEB") {
            window.open(url, "_blank");
        } else {
            const isPreviewableType = url.endsWith('.pdf') || url.endsWith('.txt');

            if (isPreviewableType) {
                setDocumentUrl(url);
                setModalOpen(true);
            } else {
                setDocumentUrl('');
                setModalOpen(true);
                setSelectedDocumentUrl(url);
            }
        }
    };

    const columns = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'description',
                width: "auto",
            },
            {
                Header: t(langKeys.uploaddate),
                accessor: 'createdate',
                width: "auto",
            },
            {
                accessor: "viewDocument",
                NoFilter: true,
                disableGlobalFilter: true,
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                    const row = props.cell.row.original;
                    return (
                        <IconButton onClick={() => handleViewDocument(row.url, row.type)} style={{ padding: 0 }}>
                            <VisibilityIcon />
                        </IconButton>
                    );
                },
            },
        ],
        []
    );

    const columns2 = React.useMemo(
        () => [
            {
                Header: t(langKeys.name),
                accessor: 'file_name',
                width: "auto",
            },
            {
                Header: t(langKeys.uploaddate),
                accessor: 'createdate',
                width: "auto",
                Cell: () => {
                    return <div>Por subir</div>
                }
            },
        ],
        []
    );

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(
                    showSnackbar({
                        show: true,
                        severity: "success",
                        message: t(langKeys.successful_register),
                    })
                );
                fetchData()
                fetchAssistants()
                setViewSelected('main')
                setFileAttachments([])
                setFileIdsAux([])
                dispatch(showBackdrop(false));
            } else if (executeResult.error) {
                const errormessage = t(executeResult.code || "error_unexpected_error", {
                    module: t(langKeys.domain).toLocaleLowerCase(),
                });
                dispatch(showSnackbar({ show: true, severity: "error", message: errormessage }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [executeResult, waitSave]);

    const handleDrop = (event: Dictionary) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        onChangeAttachment(files);
    };

    const handleDragOver = (event: Dictionary) => {
        event.preventDefault();
    };

    const handleRemoveAttachment = (index: number) => {
        setFileAttachments(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleUploadGeneral = () => {        
        if(edit) {
            if(conector?.provider === 'Open AI' || conector?.provider === 'OpenAI') {
                if(fileAttachments.some((attachment) => attachment.file_name.endsWith('.xlsx'))) {
                    if(row?.codeinterpreter) {
                        if(dataDocuments.data.length + fileAttachments.length > 20) dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.openaifileslimit) }));
                        else handleUpload()
                    } else {
                        dispatch(showSnackbar({ show: true, severity: "error", message: "Para subir excel a un asistente Open AI se necesita activar code interpreter. Si desea lograrlo, active code interpreter y guarde el asistente antes de subir este tipo de archivo." }));
                    }
                } else {
                    if(dataDocuments.data.length + fileAttachments.length > 20) dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.openaifileslimit) }));
                    else handleUpload()
                }
            } else {
                handleUpload()
            }
        } else {
            if((conector?.provider === 'Open AI' || conector?.provider === 'OpenAI') && fileAttachments.length > 20){
                dispatch(showSnackbar({ show: true, severity: "error", message: t(langKeys.openaifileslimit) }));
            } else {
                handleUploadInNewAssistant()
            }
        }
    }

    if (viewSelected === 'main') {
        return (
            <>
                { provider?.trim().toLowerCase() === 'openai' ? (
                    <div className={classes.containerDetail}>
                         <div className="row-zyx">
                             <div className={classes.container2}>
                                 <div>
                                     <span className={classes.title}>
                                         {t(langKeys.knowledge_base)}
                                     </span>
                                     <div className={classes.titleMargin}>
                                         <span>{t(langKeys.knowledge_based_description)}</span>
                                     </div>
                                 </div>
                             </div>
                             <div className={classes.cardsContainer}>
                                 <Grid item xs={2} md={1} lg={2} className={classes.gridWidth}>
                                     <Card className={classes.card} onClick={() => setViewSelected('uploadFile')}>
                                         <div className={classes.cardContent}>
                                             <UploadFileIcon className={classes.logo} />
                                             <div className={classes.cardTitle}>{t(langKeys.upload_document)}</div>
                                             <div className={classes.cardText}>{(conector?.provider === 'Open AI' || conector?.provider === 'OpenAI') ? t(langKeys.upload_document_description) : t(langKeys.upload_document_description).replace(', Excel', '')}</div>
                                         </div>
                                     </Card>
                                 </Grid>
                             </div>
                         </div>
                    </div>
                    ) : (
                        <div className={classes.containerDetail2}>
                            <div className={classes.containerBox}>
                                <div className={classes.container2}>
                                    <div>
                                        <span className={classes.title}>
                                            {t(langKeys.knowledge_base)}
                                        </span>
                                        <div className={classes.titleMargin}>
                                            <span>{t(langKeys.knowledge_based_description)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.cardsContainer}>
                                    <Grid item xs={12} sm={8} md={8} lg={6} className={classes.gridWidth2}>
                                        <Card className={classes.card} onClick={() => setViewSelected('uploadFile')}>
                                            <div className={classes.cardContent}>
                                                <UploadFileIcon className={classes.logo} />
                                                <div className={classes.cardTitle}>{t(langKeys.upload_document)}</div>
                                                <div className={classes.cardText}>{(conector?.provider === 'Open AI' || conector?.provider === 'OpenAI') ? t(langKeys.upload_document_description) : t(langKeys.upload_document_description).replace(', Excel', '')}</div>
                                            </div>
                                        </Card>
                                    </Grid>
                                </div>
                            </div>
                            <div className={classes.containerBox}>
                                <div className={classes.container2}>
                                    <div>
                                        <span className={classes.title}>
                                            {t(langKeys.parameters)}
                                        </span>                                
                                    </div>
                                </div>
                                <div className={classes.parameterDesc}><span className={classes.text}>Los parámetros de tamaño y superposición del chunk se utilizan para controlar la granularidad de la división del texto.</span></div>
                                <div className={classes.block20}/>
                                <div className={classes.parameterContainer}>
                                    <span className={classes.detailTitle}>{'Tamaño del chunk'}</span>
                                    <div className={classes.widthBlock10}/>
                                    <div className={classes.widthBlock10}/>
                                        <FieldEdit
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            width={80}
                                            valueDefault={getValues('chunk_size')}
                                            onChange={(value) => setValue('chunk_size', value)}
                                            error={errors?.chunk_size?.message}
                                        />
                                </div>
                                <div className={classes.parameterDesc}><span className={classes.text}>{'Cantidad de caracteres para cada fragmento del documento a subir a la base de conocimientos. Cuando los documentos se agrega a la base de conocimientos, estos se dividen en fragmentos (chunks).'}</span></div>
                                <div className={classes.block20}/>
                                <div className={classes.parameterContainer}>
                                    <span className={classes.detailTitle}>{'Superposición del chunk'}</span>
                                    <div className={classes.widthBlock10}/>
                                    <div className={classes.widthBlock10}/>
                                    <FieldEdit
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        width={80}
                                        valueDefault={getValues('chunk_overlap')}
                                        onChange={(value) => setValue('chunk_overlap', value)}
                                        error={errors?.chunk_overlap?.message}
                                    />
                                </div>
                                <div className={classes.parameterDesc}><span className={classes.text}>{'Asigna la cantidad máxima de caracteres que deben superponerse entre dos chunks adyacentes. Los parámetros de tamaño y superposición del chunk se utilizan para controlar la granularidad de la división del texto.'}</span></div>
                            </div>
                        </div>
                    )
                }
                <div className={classes.containerDetail}>
                    <div className={classes.header}>
                        <div>
                            <span className={classes.title}>
                                {t(langKeys.saved_documents)}
                            </span>
                            <div className={classes.titleMargin}>
                                <span>{t(langKeys.saved_documents_description)}</span>
                            </div>
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                type="button"
                                startIcon={<DeleteIcon color={rowWithDataSelected.length === 0 ? "#A7A5A5" : "primary"} />}
                                className={classes.purpleButton}
                                disabled={rowWithDataSelected.length === 0}
                                onClick={handleMassiveDelete}
                            >
                                {t(langKeys.delete)}
                            </Button>
                        </div>
                    </div>
                    <div className={classes.titleMargin}>
                        <TableZyx
                            columns={edit ? columns : columns2}
                            data={edit ? dataDocuments.data : fileAttachments}
                            filterGeneral={false}
                            selectionKey={edit ? selectionKey : ''}
                            setSelectedRows={edit ? setSelectedRows : () => { return }}
                            useSelection={edit ? true : false}
                        />
                    </div>
                </div>
                <Modal open={isModalOpen}>
                    <div style={{ padding: '15vh 4%', alignItems: 'center', justifyContent: 'center' }}>
                        <div className={!documentUrl ? classes.errorModalContent : ''}>
                            {documentUrl && (
                                <iframe title="Document Viewer" src={documentUrl} width="100%" height="700" />
                            )}
                            {!documentUrl && (
                                <>
                                    <p>{t(langKeys.error_previewing_file)}</p>
                                    <p>{t(langKeys.download_file_instead)}</p>

                                    <Button
                                        className={classes.button}
                                        style={{ border: '1px solid #7721AD', marginRight: '1rem' }}
                                        variant="contained"
                                        onClick={() => handleDownloadDocument()}
                                        startIcon={<CloudDownloadIcon />}
                                    >
                                        {t(langKeys.download)}
                                    </Button>
                                </>
                            )}
                            <Button
                                style={{ border: '1px solid #7721AD' }}
                                className={classes.button}
                                variant="contained"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setModalOpen(false)}
                            >
                                {t(langKeys.back)}
                            </Button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    } else if (viewSelected === 'uploadFile') {
        return (
            <>
                <div className={classes.containerDetail}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <div className={classes.container2}>
                            <div>
                                <Button
                                    type="button"
                                    style={{ color: '#7721AD' }}
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => {
                                        setViewSelected('main')
                                        setFileAttachments([])
                                    }}
                                >
                                    {t(langKeys.knowledge_base)}
                                </Button>
                            </div>
                            <div className={classes.block10} />
                            <div>
                                <span className={classes.title}>
                                    {t(langKeys.upload)}
                                </span>
                                <div className={classes.titleMargin}>
                                    <span>{t(langKeys.uploadFileText)}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="contained"
                            type="button"
                            startIcon={<AttachFileIcon />}
                            onClick={handleUploadGeneral}
                            className={classes.clipButton2}
                            disabled={fileAttachments.length < 1 || waitUploadFile2}
                        >
                            {t(langKeys.import)}
                        </Button>
                    </div>
                    <div>
                        <input
                            accept="text/doc"
                            style={{ display: 'none' }}
                            id="attachmentInput"
                            type="file"
                            multiple
                            onChange={(e) => onChangeAttachment(e.target.files)}
                            disabled={waitUploadFile2}
                        />
                        <Card
                            className={classes.uploadCard}
                            onClick={onClickAttachment}
                            onDrop={(e) => handleDrop(e)}
                            onDragOver={(e) => handleDragOver(e)}
                            draggable
                        >
                            <div className={classes.uploadCardContent}>
                                <UploadFileIcon className={classes.uploadIcon} />
                                <div className={classes.uploadTitle}>{t(langKeys.clicktouploadfiles)}</div>
                                <div>{t(langKeys.maximun10files)}</div>
                            </div>
                        </Card>
                        {fileAttachments.length > 0 && (
                            <>
                                {fileAttachments.map((file, index) => {
                                    return (
                                        <>
                                            <Card className={classes.fileInfoCard}>
                                                <div className={classes.fileInfoCardContent}>
                                                    <div className={classes.fileCardText}>
                                                        <InsertDriveFileIcon style={{ marginRight: 10 }} />
                                                        <Typography className={classes.fileCardName}>
                                                            {file.file_name}
                                                        </Typography>
                                                    </div>
                                                    <IconButton
                                                        onClick={() => handleRemoveAttachment(index)}
                                                    >
                                                        <ClearIcon style={{ color: "#008439" }} />
                                                    </IconButton>
                                                </div>
                                            </Card>
                                        </>
                                    )
                                })}
                            </>
                        )}
                        {waitUploadFile2 && (
                            <div className={classes.loadingIndicator}>
                                <CachedIcon color="primary" style={{ marginRight: 8 }} />
                                <span>Cargando documentos...</span>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    } else if (viewSelected === 'uploadURL') {
        return (
            <div className={classes.containerDetail}>
                <div className={classes.container2}>
                    <div>
                        <Button
                            type="button"
                            style={{ color: '#7721AD' }}
                            startIcon={<ArrowBackIcon />}
                            onClick={() => setViewSelected('main')}
                        >
                            {t(langKeys.knowledge_base)}
                        </Button>
                    </div>
                    <div className={classes.block10} />
                    <div>
                        <span className={classes.title}>
                            {t(langKeys.importWebsite)}
                        </span>
                        <div className={classes.titleMargin}>
                            <span>{t(langKeys.uploadURLText)}</span>
                        </div>
                    </div>
                </div>
                <div className={classes.block20} />
                <div className="row-zyx">
                    <FieldEdit
                        className="col-12"
                        variant="outlined"
                        onChange={(value) => setValue("description", value)}
                        label={t(langKeys.name)}
                    />
                    <FieldEdit
                        className="col-12"
                        variant="outlined"
                        onChange={(value) => setValue("url", value)}
                        label={t(langKeys.website)}
                    />
                </div>
                {fileAttachment && (
                    <>
                        <Card className={classes.fileInfoCard}>
                            <div className={classes.fileInfoCardContent}>
                                <div className={classes.fileCardText}>
                                    <InsertDriveFileIcon style={{ marginRight: 10 }} />
                                    <Typography className={classes.fileCardName}>
                                        {fileAttachment.name}
                                    </Typography>
                                </div>
                                <IconButton>
                                    <ClearIcon style={{ color: "#008439" }} />
                                </IconButton>
                            </div>
                        </Card>
                        <div className={classes.block20} />
                        {loading ? (
                            <div className={classes.loadingIndicator}>
                                <CachedIcon color="primary" style={{ marginRight: 8 }} />
                                <span>Cargando respuesta...</span>
                            </div>
                        ) : (
                            <>
                                <div className={classes.loadingIndicator}>
                                    <CachedIcon color="primary" style={{ marginRight: 8 }} />
                                    <span>Cargado con éxito!</span>
                                </div>
                                <FieldEdit
                                    variant="outlined"
                                    label="URL"
                                    valueDefault={getFormValues('url')}
                                    style={{ flexGrow: 1 }}
                                    disabled={true}
                                />
                            </>
                        )}
                    </>
                )}
                <Button
                    variant="contained"
                    type="button"
                    startIcon={<AttachFileIcon />}
                    className={classes.clipButton}
                    onClick={handleUploadURL}
                >
                    {t(langKeys.import)}
                </Button>
            </div>
        );
    } else return null;
};

export default TrainingTabDetail;