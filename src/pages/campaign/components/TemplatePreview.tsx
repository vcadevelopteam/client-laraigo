import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PhoneIcon from '@material-ui/icons/Phone';
import ReplyIcon from '@material-ui/icons/Reply';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ListIcon from '@material-ui/icons/List';
import CloseIcon from '@material-ui/icons/Close';
import { Dictionary } from '@types';
import { IconButton, Modal } from '@material-ui/core';

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
    buttonPreview2: {          
        padding: '0.8rem 1rem',
        display: 'flex',
        justifyContent: 'left',
        textAlign: 'center',
        cursor: 'pointer',
        color:'grey',
        textDecoration: 'none',
        borderBottom: '1px solid #f9f9f9',
        '&:hover': {
            backgroundColor: '#FBFBFB',
        },
    },
    previewHour: {
        display:'flex', justifyContent:'right', fontSize:'0.9rem', color:'grey', margin:'10px 0'
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
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: '0.5rem',
    },
    dropdownContent: {
        position: 'absolute',
        backgroundColor: '#f9f9f9',
        minWidth: '35rem',
        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
        zIndex: 1,
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        padding: '12px 16px',
    },    
    
    closeButton: {
        display: 'flex',
        justifyContent: 'flex-start',
        margin:'1rem 1rem 0rem 1rem'
    },
    dropDownList: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
        border: 'none',
        borderRadius: '4px',
        zIndex: 10,
        width: '100%',
    },
}));

interface PdfAttachmentProps {
    url: string;
}
const PdfAttachment: React.FC<PdfAttachmentProps> = ({ url }) => {
    const classes = useStyles();

    const getFileName = (url: string) => {
        if (!url) return 'Archivo PDF';
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
    const [showAllButtons, setShowAllButtons] = useState(false);

    const handleShowAllButtons = () => {
        setShowAllButtons(true);
    };

    const handleClose = () => {
        setShowAllButtons(false);
    };

    const getButtonIcon = (type: string) => {
        switch (type) {
            case 'URL':
                return <OpenInNewIcon style={{ height: '24px' }} />;
            case 'PHONE':
            case 'PHONE_NUMBER':
                return <PhoneIcon style={{ height: '24px' }} />;
            case 'QUICK_REPLY':
                return <ReplyIcon style={{ height: '24px' }} />;
            case 'AUTHENTICATION':
                return <FileCopyIcon style={{ height: '24px' }} />;
            default:
                return <ReplyIcon style={{ height: '24px' }} />;
        }
    };

    const renderButtons = (buttonsToRender: any[], className: string = classes.buttonPreview) => {
        if (!Array.isArray(buttonsToRender)) {
            return null;
        }
        return buttonsToRender.map((button: Dictionary, index: number) => (
            <a className={className} key={index}>
                <div style={{ fontSize: '1.2rem', display: 'flex', alignContent: 'center', gap: '4px' }}>
                    {getButtonIcon(button.type)} {button.btn.text}
                </div>
            </a>
        ));
    };
    

    return (
        <div style={{ position: 'relative' }}>
            {renderButtons(buttons.slice(0, 2))}
            {buttons.length > 2 && (
                <a className={classes.buttonPreview} onClick={handleShowAllButtons}>
                    <div style={{ fontSize: '1.2rem', display: 'flex', alignContent: 'center', gap: '4px' }}>
                        <ListIcon /> See all options
                    </div>
                </a>
            )}
            {showAllButtons && (
                <div className={classes.dropDownList}>
                    <div style={{ cursor: 'pointer' }}>
                        <div style={{ height: '6px', width: '10%', backgroundColor: 'grey', borderRadius: '4px', margin: '0 auto' }}></div>
                        <CloseIcon onClick={handleClose} className={classes.closeButton} />
                        <div style={{ textAlign: 'center', width: '100%', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>All Options</div>
                    </div>
                    {renderButtons(buttons.slice(2), classes.buttonPreview2)}
                </div>
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
                    <p style={{fontSize:'1rem'}}>{item.body}</p>
                    {item.buttons?.length > 0 && (
                        <ButtonList buttons={item.buttons} />
                    )}
                </div>
            ))}
        </div>
    );
};


interface TemplatePreviewProps {
    selectedTemplate: Dictionary;
    bodyVariableValues: Dictionary;
    bubbleVariableValues: Dictionary;
    headerVariableValues: Dictionary;
    videoHeaderValue: string;
    cardImageValues: Dictionary;
    dynamicUrlValues: Dictionary;
    carouselVariableValues: Dictionary;
}

const replaceVariables = (text: string, bodyVariableValues: Dictionary = {}, bubbleVariableValues: Dictionary = {}, dynamicUrlValues: Dictionary = {}, cardImageValues: Dictionary = {}, carouselVariableValues: Dictionary = {}, carouselIndex?: number) => {
    return text.replace(/{{(\d+)}}/g, (_, variableNumber) => {
        if (carouselIndex !== undefined && carouselVariableValues[carouselIndex]) {
            return carouselVariableValues[carouselIndex][variableNumber] || `{{${variableNumber}}}`;
        }
        return bodyVariableValues[variableNumber] || bubbleVariableValues[variableNumber] || dynamicUrlValues[variableNumber] || (carouselIndex !== undefined && cardImageValues[carouselIndex]?.[variableNumber]) || `{{${variableNumber}}}`;
    });
};


const TemplatePreview: React.FC<TemplatePreviewProps> = ({
    selectedTemplate,
    bodyVariableValues,
    bubbleVariableValues,
    headerVariableValues,
    videoHeaderValue,
    cardImageValues,
    dynamicUrlValues,
    carouselVariableValues
}) => {
    const classes = useStyles();
    const renderedHeader = replaceVariables(selectedTemplate.header || "", headerVariableValues);
    const renderedBody = replaceVariables(selectedTemplate.body || "", bodyVariableValues);

    const renderedCarouselData = selectedTemplate.carouseldata?.map((item: Dictionary, index: number) => ({
        ...item,
        header: cardImageValues?.[index] || item.header,
        body: replaceVariables(item.body || "", {}, bubbleVariableValues, {}, {}, carouselVariableValues, index),
        buttons: item.buttons?.map((button: Dictionary) => ({
            ...button,
            btn: {
                ...button.btn,
                url: replaceVariables(button.btn.url || "", {}, {}, dynamicUrlValues, {}, carouselVariableValues, index)
            }
        })) || []
    })) || [];

    const combinedButtons = [
        ...(selectedTemplate.buttonsgeneric || []),
        ...(selectedTemplate.buttonsquickreply || [])
    ];   

    return (
        <div className={classes.containerDetail} style={{ width: '100%' }}>
            <div className={classes.containerDetail} style={{ display: 'block', alignContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <div style={{ maxWidth: '40rem', borderRadius: '0.5rem', backgroundColor: '#FDFDFD', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', padding: '1rem 1rem 0rem 1rem' }}>
                       
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
                                        <div style={{ fontSize: '1.5rem' }}>{renderedHeader}</div> //cambia texto
                                    ) : selectedTemplate?.headertype === "VIDEO" ? (
                                        <video controls style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '0.5rem' }}>
                                            <source src={selectedTemplate.header} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <div style={{ fontSize: '1.1rem' }}>{renderedHeader}</div>
                                    )}

                                    <p style={{fontSize:'1.1rem'}}>{renderedBody}</p>

                                    {selectedTemplate?.templatetype === "CAROUSEL" && renderedCarouselData.length > 0 && (
                                        <CarouselPreview carouselData={renderedCarouselData} />
                                    )}

                                    <p style={{ color: 'grey', fontSize: '1rem' }}>{selectedTemplate.footer}</p>
                                    <span className={classes.previewHour}> 11:12</span>

                                    {selectedTemplate.buttonsenabled && combinedButtons.length > 0 && (
                                        <ButtonList buttons={combinedButtons} />
                                    )}
                                </div>
                            ) : selectedTemplate?.category === "AUTHENTICATION" ? (
                                <div>
                                    <p style={{fontSize:'1.2rem'}}>Tu código de verificación es <span dangerouslySetInnerHTML={{ __html: '{{1}}' }}></span>.
                                        {selectedTemplate.authenticationdata.safetyrecommendation && (
                                            <span> Por tu seguridad, no lo compartas</span>
                                        )}
                                    </p>
                                    {selectedTemplate.authenticationdata.showexpirationdate && (
                                        <div>
                                            <p style={{fontSize:'1rem'}}>Este código caduca en {selectedTemplate.authenticationdata.codeexpirationminutes} minutos.</p>
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