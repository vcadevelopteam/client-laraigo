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
import BackupIcon from '@material-ui/icons/Backup';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { FieldEdit, TemplateIcons } from "components";
import { execute, uploadFile } from "store/main/actions";
import ClearIcon from '@material-ui/icons/Clear';
import { Dictionary } from "@types";
import { useForm } from "react-hook-form";
import { insAssistantAiDoc } from "common/helpers";
import { CellProps } from "react-table";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: "#fff",
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
        marginTop:"1.5rem",
        justifyContent: 'center',
        alignItems: 'center',
        gap:"1.5rem",
        display: 'flex'
    },
    card: {
        position: 'relative',
        width: '100%',
        padding:"1rem",
        backgroundColor: '#F5F5F5', 
        cursor: 'pointer'
    },
    cardContent: {
        textAlign: 'center',
        alignContent: 'center'
    },
    cardTitle: {
        fontWeight: 'bold',
        paddingBottom:'1rem'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerLeft: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '1rem',
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
        height: 90,
        width:"100%",
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
        textAlign: 'left',
    },
    gridWidth: {
        minWidth: 330
    },
    block10: {
        height: 10
    },
    uploadIcon: {
        height: 80,
        width:"100%",
        justifyContent: 'center',
        color: 'green'
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
        fontWeight:'bold',
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
    }
}));

interface TrainingTabDetailProps {
    row: Dictionary | null;
    fetchData: () => void;
}

const TrainingTabDetail: React.FC<TrainingTabDetailProps> = ({
    row,
    fetchData
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const executeResult = useSelector((state) => state.main.execute);
    const dispatch = useDispatch();
    const [waitSave, setWaitSave] = useState(false);
    const [viewSelected, setViewSelected] = useState('main');
    const dataDocuments = useSelector(state => state.main.mainAux);
    const [fileAttachment, setFileAttachment] = useState<File | null>(null);
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const uploadResult = useSelector(state => state.main.uploadFile);
    const [isModalOpen, setModalOpen] = useState(false);
    const [documentUrl, setDocumentUrl] = useState("");
    const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(null);


    useEffect(() => {
        fetchData();
    }, [])

    const { register, handleSubmit, setValue, getValues } = useForm({
        defaultValues: {
            assistantaiid: row?.assistantaiid,
            id: 0,
            description: '',
            url: '',
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
        register('type');
        register('status');
        register('operation');
    }, [register, setValue]);

    const onClickAttachment = useCallback(() => {
        const input = document.getElementById('attachmentInput');
        input!.click();
    }, []);

    const onChangeAttachment = useCallback((files: any) => {
        const file = files?.item(0);
        if (file) {
            setFileAttachment(file);
            const fd = new FormData();
            fd.append('file', file, file.name);
            dispatch(uploadFile(fd));
            setWaitUploadFile(true);
        }
    }, [])

    const handleUpload = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insAssistantAiDoc(data)));
            setWaitSave(true);
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        )
        handleClearFile()
    });

    const handleUploadURL = handleSubmit((data) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(insAssistantAiDoc({...data, type:"WEB"})));
            setWaitSave(true);
        };
        dispatch(
            manageConfirmation({
                visible: true,
                question: t(langKeys.confirmation_save),
                callback,
            })
        )
        handleClearFile()
    });


    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setValue('url', uploadResult?.url || '')
                setValue('description', fileAttachment?.name || '')
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult])

    const handleClearFile = () => {
        setFileAttachment(null);
        setWaitUploadFile(false);
        setValue('url', '')
    };

    const handleDelete = (row: Dictionary) => {
        const callback = () => {
          dispatch(
            execute(insAssistantAiDoc({ ...row, id: row.assistantaidocumentid, operation: "DELETE", status: "ELIMINADO", type: "NINGUNO" }))
          );
          dispatch(showBackdrop(true));
          setWaitSave(true);
        };
    
        dispatch(
          manageConfirmation({
            visible: true,
            question: t(langKeys.confirmation_delete),
            callback,
          })
        );
    };


    
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
      
    const handleViewDocument = (url: string) => {
        const isPreviewableType = url.endsWith('.pdf') || url.endsWith('.txt');
        
        if (isPreviewableType) {
            setDocumentUrl(url);
            setModalOpen(true);
        } else {
            setDocumentUrl('');
            setModalOpen(true);
            setSelectedDocumentUrl(url);
        }
    };
      

    const handleTrain = () => {
        console.log('trained')
    }

    const columns = React.useMemo(
        () => [
            {
                accessor: "assistantaidocumentid",
                NoFilter: true,
                disableGlobalFilter: true,
                isComponent: true,
                minWidth: 60,
                width: "1%",
                Cell: (props: CellProps<Dictionary>) => {
                  const row = props.cell.row.original;
                  return (
                    <TemplateIcons
                      deleteFunction={() => handleDelete(row)}
                      extraFunction={() => handleTrain()}
                      extraOption={t(langKeys.train)}
                      ExtraICon={() => <AutorenewIcon width={28} style={{ fill: '#7721AD' }} />}
                    />
                  );
                },
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
                        <IconButton onClick={() => handleViewDocument(row.url)}>
                            <VisibilityIcon />
                        </IconButton>
                    );
                },
            },
            {
                Header: t(langKeys.name),
                accessor: 'description',
                width: "auto",
            },
            {
                Header: t(langKeys.type),
                accessor: 'type',
                width: "auto",
            },
            {
                Header: t(langKeys.upload),
                accessor: 'createdate',
                width: "auto",
            },           
            {
                Header: t(langKeys.last_trainning),
                accessor: 'last_trainning',
                width: "auto",
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
                        message: t(langKeys.successful_delete),
                    })
                );
                fetchData()
                setViewSelected('main')
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

    if(viewSelected === 'main') {
        return (
            <>
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
                                        <BackupIcon className={classes.logo} style={{color:'green'}} />
                                        <div className={classes.cardTitle}>{t(langKeys.upload_document)}</div>
                                        <div className={classes.cardText}>{t(langKeys.upload_document_description)}</div>
                                    </div>
                                </Card>
                            </Grid>
                            <Grid item xs={2} md={1} lg={2} className={classes.gridWidth}>
                                <Card className={classes.card} onClick={() => setViewSelected('uploadURL')}>
                                    <div className={classes.cardContent}>
                                        <AttachFileIcon className={classes.logo} style={{color: 'blue'}} />
                                        <div className={classes.cardTitle}>{t(langKeys.import_web_page)}</div>
                                        <div className={classes.cardText}>{t(langKeys.import_web_page_description)}</div>
                                    </div>
                                </Card>
                            </Grid>
                        </div>
                    </div>
                </div>
                <div className={classes.containerDetail}>
                    <div className={classes.header}>
                        <div className={classes.headerLeft}>
                            <div>
                                <span className={classes.title}>
                                    {t(langKeys.saved_documents)}
                                </span>
                                <div className={classes.titleMargin}>
                                    <span>{t(langKeys.saved_documents_description)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={classes.titleMargin}>
                        <TableZyx
                            columns={columns}
                            data={dataDocuments.data}
                            filterGeneral={false}
                        />
                    </div>
                </div>
                <Modal open={isModalOpen}>
                    <div style={{ padding: '15vh 4%', alignItems: 'center', justifyContent: 'center'}}>
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
    } else if(viewSelected === 'uploadFile') {
        return (
            <>
                <div className={classes.containerDetail}>
                    <div className={classes.container2}>
                        <div>
                            <Button
                                type="button"
                                style={{color: '#7721AD'}}
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setViewSelected('main')}
                            >
                                {t(langKeys.knowledge_base)}
                            </Button>
                        </div>
                        <div className={classes.block10}/>
                        <div>
                            <span className={classes.title}>
                                {t(langKeys.upload)}
                            </span>
                            <div className={classes.titleMargin}>
                                <span>{t(langKeys.uploadFileText)}</span>
                            </div>
                        </div>                    
                    </div>
                    <div>
                        <input
                            accept="text/doc"
                            style={{ display: 'none'}}
                            id="attachmentInput"
                            type="file"
                            onChange={(e) => onChangeAttachment(e.target.files)}
                        />
                        { waitUploadFile || fileAttachment === null && (
                            <Card className={classes.uploadCard} onClick={onClickAttachment}>
                                <div className={classes.uploadCardContent}>
                                    <BackupIcon className={classes.uploadIcon}/>
                                    <div className={classes.uploadTitle}>{t(langKeys.clicktouploadfiles)}</div>
                                    <div>{t(langKeys.maximun10files)}</div>
                                </div>
                            </Card>
                        )}
                        {fileAttachment && (
                            <>
                                <Card className={classes.fileInfoCard}>
                                    <div className={classes.fileInfoCardContent}>
                                        <div className={classes.fileCardText}>
                                            <InsertDriveFileIcon style={{marginRight: 10}}/>
                                            <Typography className={classes.fileCardName}>
                                                {fileAttachment.name}
                                            </Typography>
                                        </div>
                                        <IconButton
                                            onClick={handleClearFile}
                                        >
                                            <ClearIcon style={{color: "#008439"}}/>
                                        </IconButton>
                                    </div>
                                </Card>
                                <div className={classes.block20}/>
                                <FieldEdit
                                    variant="outlined"
                                    label="URL"
                                    valueDefault={getValues('url')}
                                    style={{ flexGrow: 1 }}
                                />
                            </>
                        )}
                        <Button
                            variant="contained"
                            type="button"
                            startIcon={<AttachFileIcon />}
                            onClick={handleUpload}
                            className={classes.clipButton2}
                            disabled={fileAttachment === null}
                        >
                            {t(langKeys.import)}
                        </Button>
                    </div>
                </div>
            </>
        );
    } else if(viewSelected === 'uploadURL') {
        return (
            <>
                <div className={classes.containerDetail}>
                    <div className={classes.container2}>
                        <div>
                            <Button
                                type="button"
                                style={{color: '#7721AD'}}
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setViewSelected('main')}
                            >
                                {t(langKeys.knowledge_base)}
                            </Button>
                        </div>
                        <div className={classes.block10}/>
                        <div>
                            <span className={classes.title}>
                                {t(langKeys.importWebsite)}
                            </span>
                            <div className={classes.titleMargin}>
                                <span>{t(langKeys.uploadURLText)}</span>
                            </div>
                        </div>                    
                    </div>
                    <div className={classes.block20}/>
                    <div className="row-zyx">
                        <FieldEdit
                            className="col-12"
                            variant="outlined"
                            onChange={(value)=> setValue("description", value)}
                            label={t(langKeys.name)}
                        />
                        <FieldEdit
                            className="col-12"
                            variant="outlined"
                            onChange={(value)=> setValue("url", value)}
                            label={t(langKeys.website)}
                        />
                    </div>
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
            </>
        );
    } else return null;
};

export default TrainingTabDetail;
