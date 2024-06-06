import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PhoneIcon from '@material-ui/icons/Phone';
import ReplyIcon from '@material-ui/icons/Reply';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Dictionary } from '@types';

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
    flexgrow1: {
        flexGrow: 1
    },
    subtitle: {
        fontSize: '0.9rem',       
        color: 'grey', 
        marginBottom:'0.5rem',
    },
    title: {
       fontSize: '1rem', 
       color: 'black' 
    },
    buttonPreview: {
        color: '#009C8F',    
        padding: '0.8rem 1rem',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
   
        textDecoration: 'none',
        borderTop: '1px solid #D7D7D7',
        '&:hover': {
            backgroundColor: '#FBFBFB',
        },
    },
    previewHour: {
        display:'flex', justifyContent:'right', fontSize:'0.78rem', color:'grey', margin:'10px 0'
    }, 
    pdfPreview: {
        width: '100%',
        height: '500px',
        border: 'none',
        display: 'block',
        margin: '0 auto',
        borderRadius: '0.5rem',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        background: '#F5D9D9',
        padding: '10px',
        marginTop:'7px',
        borderRadius: '5px',
        maxWidth: '100%',
        overflow: 'hidden',
    },
    copyButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    icon: {
        marginRight: '10px',
        color:'#DF3636',
    },
    fileName: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: 1,
    },
    carouselContainer: {
        display: 'flex',
        overflowX: 'auto',
        gap: '1rem',
        padding: '1rem 0',
    },
    carouselItem: {
        minWidth: '200px',
        maxWidth: '300px',
        borderRadius: '0.5rem',
        backgroundColor: '#fff',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '1rem',
        textAlign: 'center',
    },
}));

interface PdfAttachmentProps {
    url: string;
}
const PdfAttachment: React.FC<PdfAttachmentProps> = ({ url }) => {
    const classes = useStyles();

    const getFileName = (url: string) => {
        const matches = url.match(/\/([^/?#]+\.pdf)(?:[?#]|$)/i);
        return matches && matches[1] ? matches[1] : 'Archivo PDF';
    };

    const getTruncatedFileName = (fileName: string, maxLength: number) => {
        const extension = ".pdf";
        if (fileName.length <= maxLength) {
            return fileName;
        }
        const truncated = fileName.slice(0, maxLength - extension.length - 3) + "...";
        return truncated + extension;
    };

    const fileName = getFileName(url);
    const truncatedFileName = getTruncatedFileName(fileName, 30);

    return (
        <div className={classes.container}>
            <PictureAsPdfIcon className={classes.icon} />
            <span className={classes.fileName}>{truncatedFileName}</span>
        </div>
    );
};

const ButtonList: React.FC<{ buttons: any }> = ({ buttons }) => {
    const classes = useStyles();

    const getButtonIcon = (type: string) => {
        switch (type) {
            case 'URL':
                return <OpenInNewIcon style={{ height: '18px' }} />;
            case 'PHONE':
            case 'PHONE_NUMBER':
                return <PhoneIcon style={{ height: '18px' }} />;
            case 'QUICK_REPLY':
                return <ReplyIcon style={{ height: '18px' }} />;
            case 'AUTHENTICATION':
                return <FileCopyIcon style={{ height: '18px' }} />;
            default:
                return <ReplyIcon style={{ height: '18px' }} />;
        }
    };

    return (
        <div>
            {Array.isArray(buttons) ? buttons.map((button: Dictionary, index: number) => (
                <a className={classes.buttonPreview} key={index}>
                    {getButtonIcon(button.type)} {button.btn.text}
                </a>
            )) : (
                buttons && (
                    <div className={classes.buttonPreview}>
                        {getButtonIcon('AUTHENTICATION')} {buttons}
                    </div>
                )
            )}
        </div>
    );
};

const CarouselPreview: React.FC<{ carouselData: any }> = ({ carouselData }) => {
    const classes = useStyles();
    return (
        <div className={classes.carouselContainer}>
            {carouselData.map((item: Dictionary, index: number) => (
                <div className={classes.carouselItem} key={index}>
                    <img
                        src={item.header || "https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg"}
                        alt="Carousel Header"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem' }}
                    />
                    <p>{item.body}</p>
                    {item.buttons?.length > 0 && (
                        <ButtonList buttons={item.buttons} />
                    )}
                </div>
            ))}
        </div>
    );
};

const replaceVariables = (text: string, variableValues: Dictionary = {}) => {
    return text.replace(/{{(\d+)}}/g, (_, variableNumber) => {
        return variableValues[variableNumber] || `{{${variableNumber}}}`;
    });
};

const TemplatePreview: React.FC<{ selectedTemplate: Dictionary, variableValues: Dictionary }> = ({ selectedTemplate, variableValues }) => {
    const classes = useStyles();
    const renderedHeader = replaceVariables(selectedTemplate.header || "", variableValues);
    const renderedBody = replaceVariables(selectedTemplate.body || "", variableValues);

    return (
        <div className={classes.containerDetail} style={{ width: '100%' }}>
            <div className={classes.containerDetail} style={{ display: 'block', alignContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <div style={{ maxWidth: '25rem', borderRadius: '0.5rem', backgroundColor: '#FDFDFD', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', padding: '1rem 1rem 0rem 1rem' }}>
                       
                        <div className='templatePreview'>
                            {selectedTemplate?.category === "MARKETING" || selectedTemplate?.category === "UTILITY" || selectedTemplate?.type === "SMS" ? (
                                <div>
                                    {selectedTemplate?.headertype === "DOCUMENT" ? (
                                        <PdfAttachment url={selectedTemplate.header} />
                                    ) : selectedTemplate?.headertype === "MULTIMEDIA" ? (
                                        <iframe
                                            src={selectedTemplate.header || "https://d36ai2hkxl16us.cloudfront.net/thoughtindustries/image/upload/a_exif,c_fill,w_750/v1/course-uploads/7a95ec5e-b843-4247-bc86-c6e2676404fd/15ax1uzck54z-NuxeoGeneric.png"}
                                            style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '0.5rem' }}
                                        />
                                    ) : selectedTemplate?.headertype === "IMAGE" ? (
                                        <img
                                            src={selectedTemplate.header || "https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg"}
                                            alt="Carousel Header"
                                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem' }}
                                        />
                                    ) : selectedTemplate?.headertype === "TEXT" ? (
                                        <div style={{ fontSize: '1.2rem' }}>{renderedHeader}</div>
                                    ) : selectedTemplate?.headertype === "VIDEO" ? (
                                        <video controls style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '0.5rem' }}>
                                            <source src={selectedTemplate.header} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <div style={{ fontSize: '1.2rem' }}>{renderedHeader}</div>
                                    )}

                                    <p>{renderedBody}</p>

                                    {selectedTemplate?.templatetype === "CAROUSEL" && selectedTemplate.carouseldata?.length > 0 && (
                                        <CarouselPreview carouselData={selectedTemplate.carouseldata} />
                                    )}

                                    <p style={{ color: 'grey', fontSize: '0.8rem' }}>{selectedTemplate.footer}</p>
                                    <span className={classes.previewHour}> 11:12</span>

                                    {selectedTemplate.buttonsenabled && selectedTemplate.buttons?.length > 0 && (
                                        <ButtonList buttons={selectedTemplate.buttons} />
                                    )}

                                    {selectedTemplate.buttonsenabled && selectedTemplate.buttonsgeneric?.length > 0 && (
                                        <ButtonList buttons={selectedTemplate.buttonsgeneric} />
                                    )}

                                    {selectedTemplate.buttonsenabled && selectedTemplate.buttonsquickreply?.length > 0 && (
                                        <ButtonList buttons={selectedTemplate.buttonsquickreply} />
                                    )}
                                </div>
                            ) : selectedTemplate?.category === "AUTHENTICATION" ? (
                                <div>
                                    <p>Tu código de verificación es 12345678.
                                        {selectedTemplate.authenticationdata.safetyrecommendation && (
                                            <span> Por tu seguridad, no lo compartas</span>
                                        )}
                                    </p>
                                    {selectedTemplate.authenticationdata.showexpirationdate && (
                                        <div>
                                            <p>Este código caduca en {selectedTemplate.authenticationdata.codeexpirationminutes} minutos.</p>
                                        </div>
                                    )}
                                    <span className={classes.previewHour}> 11:12</span>
                                    {selectedTemplate.authenticationdata.buttontext && (
                                        <ButtonList buttons={selectedTemplate.authenticationdata.buttontext} />
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p>No se ha seleccionado una Plantilla</p>
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;