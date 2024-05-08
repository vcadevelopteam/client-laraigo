import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { Button, Menu, MenuItem, Tooltip, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Dictionary } from "@types";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import messageImage from '../../../icons/wsp_fondo.jpg'
import { Descendant } from "slate";
import ReplyIcon from '@material-ui/icons/Reply';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PhoneIcon from '@material-ui/icons/Phone';
import ListIcon from '@material-ui/icons/List';

const useStyles = makeStyles(() => ({
	main: {
		whiteSpace: "nowrap",
		display: "flex"
	},
    button: {
        margin: "10px",
        backgroundColor: '#F3F3F3',
        "&:hover": {
            backgroundColor: '#E6E6E6'
        }
    },
    subtittles: {
        fontSize: '1rem', 
        fontWeight:"bold",
    },   
    iconHelpText: {
        width: 15,
        height: 15,
        cursor: 'pointer',
    },
    messageCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        width: '40%',
        gap: 10,
    },
    messagePrevContainer: {
        height: '100%',
        width: '100%',
        backgroundImage: `url(${messageImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: 25,
    },
    headerText: {
        wordWrap: 'break-word',
        fontWeight: 'bold',
        fontSize: 18,
    },
    media: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    body: {
        wordWrap: 'break-word',
        whiteSpace: 'pre-line',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        color: 'grey'
    },
    cardButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        color: '#009C8F',
        borderTop: '1px solid #DDDDDD',
        gap: 6,
    },
    icon: {
        color: '#009C8F'
,    },
}));

interface TemplateIconsProps {
    fastAnswer: () => void;
    urlWeb: () => void;
    callNumber: () => void;
    textbtn: Dictionary[];
    urlbtn: Dictionary[];
    phonebtn: Dictionary[];
}

export const AddButtonMenu: React.FC<TemplateIconsProps> = ({
    fastAnswer,
    urlWeb,
    callNumber,
    textbtn,
    urlbtn,
    phonebtn
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleClickTyping = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget as HTMLElement);
        e.stopPropagation();
    };
    const handleMenuFastAnswer= () => {
        setAnchorEl(null);
        fastAnswer();
    };
    const handleMenuUrlWeb = () => {
        setAnchorEl(null);
        urlWeb();
    };
    const handleMenuCallNumber = () => {
        setAnchorEl(null);
        callNumber();
    };
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAnchorEl(null);
    };
    
    return (
        <div className={classes.main}>
            <Button
                onClick={handleClickTyping}
                startIcon={<AddIcon />}
                endIcon={<ArrowDropDownIcon />}
                className={classes.button}
                type="button"
                variant="outlined"
            >
                {t(langKeys.addbutton)}
            </Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {textbtn?.length < 7 && (
                    <MenuItem onClick={handleMenuFastAnswer}>
                        <span style={{fontWeight: 'bold'}}>{t(langKeys.fastanswer)}</span>
                    </MenuItem>
                )}
                {urlbtn?.length < 2 && (
                    <MenuItem onClick={handleMenuUrlWeb} style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                        <span style={{fontWeight: 'bold'}}>{t(langKeys.gotothewebsite)}</span>
                        <span style={{fontSize: 13}}>2 botones como máximo</span>
                    </MenuItem>
                )}
                {phonebtn?.length < 1 && (
                    <MenuItem onClick={handleMenuCallNumber} style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                        <span style={{fontWeight: 'bold'}}>{t(langKeys.callnumber)}</span>
                        <span style={{fontSize: 13}}>1 botón como máximo</span>
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};

interface CustomTitleHelperProps {
    title: string;
    helperText?: string; 
}
  
export const CustomTitleHelper: React.FC<CustomTitleHelperProps> = ({ title, helperText }) => {
    const classes = useStyles();
    return (
        <span className={classes.subtittles}>
            {title}
            {helperText ? (
                <Tooltip title={helperText} arrow placement="top" >
                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                </Tooltip>
            ) : ""}
        </span>
    );
};

interface MessagePreviewProps {
    headerType: string;
    header: string;
    selectedFile: File | null;
    bodyObject: Descendant[];
    footer: string;
    buttonstext: string[];
    buttonslink: string[];
    buttonsphone: string[];
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({headerType, header, selectedFile, bodyObject, footer, buttonstext, buttonslink, buttonsphone}) => {
    const classes = useStyles();
    const concatenatedText = bodyObject.map((obj) => obj?.children?.[0]?.text).join('\n\n');
    const combinedButtons = [
        ...buttonstext.map(text => ({ type: 'text', text })),
        ...buttonslink.map(text => ({ type: 'link', text })),
        ...buttonsphone.map(text => ({ type: 'phone', text }))
    ];

    return (
        <div className={classes.messagePrevContainer}>
            <div className={classes.messageCard}>
                {headerType === 'text' ? (
                    <span className={classes.headerText}>{header}</span>
                ) : headerType === 'multimedia' ? (
                    <>
                       {selectedFile && selectedFile.type && selectedFile.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(selectedFile)} alt="Selected Image" className={classes.media} />
                        ) : (
                            selectedFile && selectedFile.type && selectedFile.type.startsWith('video/') ? (
                                <video controls className={classes.media}>
                                    <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <span>No media selected</span>
                            )
                        )}
                    </>
                ) : (
                    <></>
                )}
                <div className={classes.body}>{concatenatedText}</div>
                <div className={classes.footer}>
                    {footer}
                    <span style={{fontSize: 10, color: 'black', textAlign: 'end', marginTop: 10}}>16:59</span>
                </div>
                <div>
                    {combinedButtons.map((btn, index) => {
                        let icon;
                        switch (btn.type) {
                            case 'text':
                                icon = <ReplyIcon className={classes.icon} />;
                                break;
                            case 'link':
                                icon = <OpenInNewIcon className={classes.icon} />;
                                break;
                            case 'phone':
                                icon = <PhoneIcon className={classes.icon} />;
                                break;
                            default:
                                icon = null;
                        }
                        return (
                            <div key={index}>
                                {((index <= 2 && combinedButtons.length === 3) || (index < 2 && combinedButtons.length !== 3)) && (
                                    <div className={classes.cardButton}>
                                        {icon}
                                        <span>{btn.text}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {combinedButtons.length > 3 &&(
                        <div className={classes.cardButton}>
                            <ListIcon className={classes.icon}/>
                            <span>See all options</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};