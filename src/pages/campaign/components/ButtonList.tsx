import React, { useState } from 'react';
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
    showAllButton: {
        padding: '0.8rem 1rem',
        textAlign: 'center',
        cursor: 'pointer',
        color: '#009C8F',
        textDecoration: 'none',
        '&:hover': {
            backgroundColor: '#FBFBFB',
        },
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    modalContent: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '0.5rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80%',
        overflowY: 'auto',
    },
}));

const ButtonList: React.FC<{ buttons: Dictionary }> = ({ buttons }) => {
    const classes = useStyles();
    const [showAll, setShowAll] = useState(false);

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

    const handleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <div>
            {Array.isArray(buttons) && buttons.slice(0, 2).map((button: Dictionary, index: number) => (
                <a className={classes.buttonPreview} key={index}>
                    <div style={{ fontSize: '1.2rem', display: 'flex', alignContent: 'center', gap: '4px' }}>{getButtonIcon(button.type)} {button.btn.text}</div>
                </a>
            ))}

            {Array.isArray(buttons) && buttons.length > 2 && (
                <a className={classes.showAllButton} onClick={handleShowAll}>
                    See all options
                </a>
            )}

            {showAll && (
                <div className={classes.modalOverlay} onClick={handleShowAll}>
                    <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                        {buttons.slice(2).map((button: Dictionary, index: number) => (
                            <a className={classes.buttonPreview} key={index}>
                                <div style={{ fontSize: '1.2rem', display: 'flex', alignContent: 'center', gap: '4px' }}>{getButtonIcon(button.type)} {button.btn.text}</div>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonList;
