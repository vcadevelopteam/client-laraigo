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
import FileCopyIcon from '@material-ui/icons/FileCopy';
import NoImage from '../../../icons/noimage.jpg'

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
        borderRadius: '0px 10px 10px 10px',
    },
    messageCard2: {
        display: 'flex',
        width: 300,
        height: 'fit-content',
        flexDirection: 'column',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        border: '1px solid black',
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
        marginBottom: 8,
    },
    media: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    cardMediaContainer: {
        height: 200,
        width: '100%',
        backgroundColor: '#DFCFE9',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardMedia: {
        width: 'auto',
        objectFit: 'cover',
        height: '100%',
    },
    body: {
        wordWrap: 'break-word',
        whiteSpace: 'pre-line',
        marginBottom: 10,
    },
    bodyCar: {
        wordWrap: 'break-word',
        whiteSpace: 'pre-line',
    },
    footer: {
        fontSize: 12,
        color: 'grey',
        wordWrap: 'break-word',
        whiteSpace: 'pre-line'
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
    cardButton2: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 10px 0px 10px',
        color: '#009C8F',
        borderTop: '1px solid #DDDDDD',
        gap: 6,
    },
    icon: {
        color: '#009C8F'
    },
    container: {
        backgroundColor: '#DFD6C6',
        padding: '5px 5px 5px 10px',
        borderRadius: 5,
    },
    chatTime: {
        textAlign: 'end',
        fontSize: 10,
    },
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

interface MessagePreviewMultimediaProps {
    headerType: string;
    header: string;
    selectedFile: File | null;
    bodyObject: Descendant[];
    footer: string;
    buttonstext: string[];
    buttonslink: Dictionary[];
}

export const MessagePreviewMultimedia: React.FC<MessagePreviewMultimediaProps> = ({headerType, header, selectedFile, bodyObject, footer, buttonstext, buttonslink}) => {
    const classes = useStyles();
    const concatenatedText = bodyObject.map((obj) => obj?.children?.[0]?.text).join('\n\n');
    const combinedButtons = [
        ...buttonstext.map(text => ({ type: 'text', text: text })),
        ...buttonslink.map((btn) => ({ type: btn.type, text: btn.text })),
    ];

    return (
        <div className={classes.messagePrevContainer}>
            <div className={classes.container} style={{width: 350}}>
                <div className={classes.messageCard}>
                    {headerType === 'text' ? (
                        <span className={classes.headerText}>{header}</span>
                    ) : headerType === 'multimedia' ? (
                        <>
                        {selectedFile && selectedFile.type && selectedFile.type.startsWith('image/') ? (
                                <div className={classes.cardMediaContainer}>
                                    <img src={URL.createObjectURL(selectedFile)} alt="Selected Image" className={classes.cardMedia} />
                                </div>
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
                    {concatenatedText !== '' && (
                        <div className={classes.body} style={{marginTop: 10}}>{concatenatedText}</div>
                    )}
                    {footer !== '' && (
                        <span className={classes.footer}>{footer}</span>
                    )}
                    <span className={classes.chatTime} style={{color: 'black', marginTop: 10}}>16:59</span>
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
                                        <div className={index === combinedButtons.length - 1 ? classes.cardButton2 : classes.cardButton}>
                                            {icon}
                                            <span>{btn.text}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {combinedButtons.length > 3 &&(
                            <div className={classes.cardButton2}>
                                <ListIcon className={classes.icon}/>
                                <span>See all options</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface MessagePreviewCarouselProps {
    bodyObject: Descendant[];
    carouselCards: Dictionary[];
}

export const MessagePreviewCarousel: React.FC<MessagePreviewCarouselProps> = ({bodyObject, carouselCards}) => {
    const classes = useStyles();
    const concatenatedText = bodyObject.map((obj) => obj?.children?.[0]?.text).join('\n\n');

    return (
        <div className={classes.messagePrevContainer}>
            <div className={classes.container} style={{width: 350}}>
                <div className={classes.messageCard}>
                    {concatenatedText !== '' && (
                        <div className={classes.bodyCar}>{concatenatedText}</div>
                    )}
                    <span className={classes.chatTime}>11:54</span>
                </div>
            </div>
            <div style={{height: 6}}/>
            {carouselCards.length > 0 && (
                <div className={classes.container} style={{overflowX: 'auto', display: 'flex', width: 'fit-content', height: 'fit-content', maxWidth: 640}}>
                    {carouselCards.map((card, index) => {
                        return (
                            <div key={index} className={classes.messageCard2}>
                                <div className={classes.cardMediaContainer}>
                                    <img src={card.image ? URL.createObjectURL(card.image) : NoImage} alt="Selected Image" className={classes.cardMedia}/>
                                </div>
                                <div className={classes.bodyCar}>{card.body}</div>
                                {card.buttons.length > 0 && (
                                    <>
                                        {card.buttons.map((btn, i) => {
                                            return (
                                                <div key={i} className={classes.cardButton2}>
                                                    {btn.type === 'text' ? (
                                                        <ReplyIcon className={classes.icon}/>
                                                    ) : btn.type === 'link' ? (
                                                        <OpenInNewIcon className={classes.icon}/>
                                                    ) : (
                                                        <PhoneIcon className={classes.icon}/>
                                                    )}
                                                    <span>{btn.btn.text}</span>
                                                </div>
                                            )
                                        })}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

interface MessagePreviewAuthenticationProps {
    buttontext: string;
    safetyAdvice: boolean;
    dateAdvice: boolean;
    expiresValue: number;
}

export const MessagePreviewAuthentication: React.FC<MessagePreviewAuthenticationProps> = ({buttontext, safetyAdvice, dateAdvice, expiresValue}) => {
    const classes = useStyles();
    
    return (
        <div className={classes.messagePrevContainer}>
            <div className={classes.container} style={{width: 350}}>
                <div className={classes.messageCard}>
                    <div>Tu código de verificación es 123456.{safetyAdvice ? ' Por tu seguridad, no lo compartas' : ''}</div>
                    {dateAdvice && (
                        <span style={{color: 'grey', fontSize: 13, marginTop: 5}}>Este código caduca en {expiresValue} minutos.</span>
                    )}
                    <span className={classes.chatTime}>11:54</span>
                    {buttontext !== '' && (
                        <div className={classes.cardButton2}>
                            <FileCopyIcon className={classes.icon}/>
                            <span>{buttontext}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};