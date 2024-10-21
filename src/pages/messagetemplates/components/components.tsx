import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { Button, IconButton, Menu, MenuItem, Tooltip, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Dictionary } from "@types";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import messageImage from '../../../icons/wsp_fondo.jpg'
import { PictureAsPdf as PdfIcon, Description as DocIcon, InsertDriveFile as ExcelIcon, Slideshow as PptIcon } from '@material-ui/icons'; // Importa íconos de Material-UI
import ReplyIcon from '@material-ui/icons/Reply';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PhoneIcon from '@material-ui/icons/Phone';
import ListIcon from '@material-ui/icons/List';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ClearIcon from "@material-ui/icons/Clear";
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
        fontWeight: "bold",
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
        minWidth: 300,
        flexDirection: 'column',
        padding: '10px 10px 0px 10px',
        backgroundColor: 'white',
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
    cardButtonModal2: {
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
    },
    container: {
        backgroundColor: '#DFD6C6',
        padding: '5px 5px 5px 10px',
        borderRadius: 5,
    },
    containerCarousel: {
        backgroundColor: '#DFD6C6',
        padding: '5px 5px 0px 10px',
        borderRadius: '5px 5px 0px 0px',
        overflowX: 'hidden',
        display: 'flex',
        width: 'fit-content',
        height: 'fit-content',
        maxWidth: 640,
    },
    chatTime: {
        textAlign: 'end',
        fontSize: 10,
    },
    fileHeader: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        gap: 10,
    },
    btntext: {
        flexGrow: 1,
        textAlign: "center",
    },
    dialog: {
        width: '30%',
        display: "flex",
        flexDirection: "column",
        backgroundColor: 'white',
        padding: 20,
        border: '1px solid #C7C7C7',
        borderRadius: 4,
    },
    headerStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        flexGrow: 1,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "bold",
    },
    buttonsContainer: {
        display: 'flex',
        backgroundColor: '#DFD6C6',
        padding: '0px 5px 5px 10px',
        overflowX: 'hidden',
        maxWidth: 640,
        width: 'fit-content',
        borderRadius: '0px 0px 5px 5px',
    },
    combinedContainer: {
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'scroll',
        cursor: 'grab',
    },
    normaltext: {
        fontSize: '0.88rem',
        display:'flex',
        alignItems:'center',
        gap:'3px',
    }
}));

interface TemplateIconsProps {
    fastAnswer: () => void;
    urlWeb: () => void;
    callNumber: () => void;
    textbtn: Dictionary[];
    urlbtn: Dictionary[];
    phonebtn: Dictionary[];
    isNew: boolean;
    buttonsType?: string;
}

export const AddButtonMenu: React.FC<TemplateIconsProps> = ({
    fastAnswer,
    urlWeb,
    callNumber,
    textbtn,
    urlbtn,
    phonebtn,
    isNew
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleClickTyping = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget as HTMLElement);
        e.stopPropagation();
    };
    const handleMenuFastAnswer = () => {
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
                disabled={!isNew}
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
                {textbtn?.length < 10 && (
                    <MenuItem onClick={handleMenuFastAnswer}>
                        <span style={{ fontWeight: 'bold' }}>{t(langKeys.fastanswer)}</span>
                    </MenuItem>
                )}
                {urlbtn?.length < 2 && (
                    <MenuItem onClick={handleMenuUrlWeb} style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        <span style={{ fontWeight: 'bold' }}>{t(langKeys.gotothewebsite)}</span>
                        <span style={{ fontSize: 13 }}>2 botones como máximo</span>
                    </MenuItem>
                )}
                {phonebtn?.length < 1 && (
                    <MenuItem onClick={handleMenuCallNumber} style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        <span style={{ fontWeight: 'bold' }}>{t(langKeys.callnumber)}</span>
                        <span style={{ fontSize: 13 }}>1 botón como máximo</span>
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};

export const AddButtonMenuCard: React.FC<TemplateIconsProps> = ({
    fastAnswer,
    urlWeb,
    callNumber,
    textbtn,
    urlbtn,
    phonebtn,
    isNew,
    buttonsType
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handleClickTyping = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget as HTMLElement);
        e.stopPropagation();
    };
    const handleMenuFastAnswer = () => {
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
                disabled={!isNew}
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
                {(textbtn?.length < 10 && (buttonsType === 'text' || buttonsType === 'none')) && (
                    <MenuItem onClick={handleMenuFastAnswer}>
                        <span style={{ fontWeight: 'bold' }}>{t(langKeys.fastanswer)}</span>
                    </MenuItem>
                )}
                {(urlbtn?.length < 2 && (buttonsType === 'url' || buttonsType === 'none')) && (
                    <MenuItem onClick={handleMenuUrlWeb} style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        <span style={{ fontWeight: 'bold' }}>{t(langKeys.gotothewebsite)}</span>
                        <span style={{ fontSize: 13 }}>2 botones como máximo</span>
                    </MenuItem>
                )}
                {(phonebtn?.length < 1 && (buttonsType === 'phone' || buttonsType === 'none')) && (
                    <MenuItem onClick={handleMenuCallNumber} style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        <span style={{ fontWeight: 'bold' }}>{t(langKeys.callnumber)}</span>
                        <span style={{ fontSize: 13 }}>1 botón como máximo</span>
                    </MenuItem>
                )}
            </Menu>
        </div>
    );
};

interface CustomTitleHelperProps {
    title: string;
    helperText?: string;
    titlestyle?: React.CSSProperties;
}

export const CustomTitleHelper: React.FC<CustomTitleHelperProps> = ({ title, helperText, titlestyle }) => {
    const classes = useStyles();
    return (
        <span className={classes.subtittles} style={titlestyle}>
            {title}
            {helperText ? (
                <Tooltip title={helperText} arrow placement="top" >
                    <InfoRoundedIcon color="action" className={classes.iconHelpText} />
                </Tooltip>
            ) : ""}
        </span>
    );
};

export const CustomTextWithHelper: React.FC<CustomTitleHelperProps> = ({ title, helperText }) => {
    const classes = useStyles();
    return (
        <span className={classes.normaltext}>
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
    headervariables: string[];
    body: string;
    bodyvariables: Dictionary[];
    footer: string;
    buttonstext: string[];
    buttonslink: Dictionary[];
    isNew: boolean;
    buttonsGeneral: Dictionary[];
    isNew: boolean;
}

export const MessagePreviewMultimedia: React.FC<MessagePreviewMultimediaProps> = ({ headerType, header, headervariables, body, bodyvariables, footer, buttonstext, buttonslink, buttonsGeneral, isNew }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [showAllButtons, setShowAllButtons] = useState(false)
    const combinedButtons = buttonsGeneral?.[0]?.name === "quickreply" ? [
        ...buttonstext.map(text => ({ type: 'text', text: text })),
        ...buttonslink.map((btn) => ({ type: btn.type, text: btn.text }))
    ] : [
        ...buttonslink.map((btn) => ({ type: btn.type, text: btn.text })),
        ...buttonstext.map(text => ({ type: 'text', text: text }))
    ];
    
    const parseFormattedText = (text: string) => {
        const monospace = /```(.*?)```/g;
        text = text.replace(monospace, '<code>$1</code>');

        const bold = /\*(.*?)\*/g;
        text = text.replace(bold, '<strong>$1</strong>');

        const italic = /_(.*?)_/g;
        text = text.replace(italic, '<em>$1</em>');

        const strikethrough = /~(.*?)~/g;
        text = text.replace(strikethrough, '<del>$1</del>');

        return text;
    };

    const getFileIcon = (url: string) => {
        const extension = url?.split('.')?.pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return (
                    <div className={classes.fileHeader} style={{ backgroundColor: '#F5D9D9' }}>
                        <PdfIcon style={{ color: '#D80000' }} />
                        <span>{header?.split('/')?.pop()?.replace(/%20/g, ' ')}</span>
                    </div>
                );
            case 'doc':
            case 'docx':
                return (
                    <div className={classes.fileHeader} style={{ backgroundColor: '#CDDEF5' }}>
                        <DocIcon style={{ color: '#001F4D' }} />
                        <span>{header?.split('/')?.pop()?.replace(/%20/g, ' ')}</span>
                    </div>
                );
            case 'xls':
            case 'xlsx':
                return (
                    <div className={classes.fileHeader} style={{ backgroundColor: '#B3E7E0' }}>
                        <ExcelIcon style={{ color: '#00493F' }} />
                        <span>{header?.split('/')?.pop()?.replace(/%20/g, ' ')}</span>
                    </div>
                );
            case 'ppt':
            case 'pptx':
                return (
                    <div className={classes.fileHeader} style={{ backgroundColor: '#FAD3C7' }}>
                        <PptIcon style={{ color: '#CE3203' }} />
                        <span>{header?.split('/')?.pop()?.replace(/%20/g, ' ')}</span>
                    </div>
                );
            default:
                return;
        }
    };

    const getFormattedHeader = () => {
        if (headerType === 'TEXT' && headervariables.length > 0) {
            return header.replace('{{1}}', headervariables[0]);
        }
        return header;
    };

    const getFormattedBody = () => {
        let formattedBody = body;
        bodyvariables.forEach(variable => {
            const regex = new RegExp(`\\{\\{${variable.variable}\\}\\}`, 'g');
            formattedBody = formattedBody.replace(regex, variable.text);
        });
        return formattedBody;
    };

    return (
        <>
            <div className={classes.messagePrevContainer} style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                <div className={classes.container} style={{ width: 350, height: 'fit-content' }}>
                    <div className={classes.messageCard}>
                        {headerType === 'TEXT' ? (
                            <span className={classes.headerText}>{getFormattedHeader()}</span>
                        ) : (headerType !== 'TEXT' && headerType !== 'NONE') ? (
                            <>
                                {(header !== '' && headerType === 'IMAGE') ? (
                                    <>
                                        {((isNew && (header.endsWith(".jpg") || header.endsWith(".png"))) || !isNew) ? (
                                            <div className={classes.cardMediaContainer}>
                                                <img src={header} alt="Cabecera" className={classes.cardMedia} />
                                            </div>
                                        ) : (
                                            <div>{t(langKeys.selectcorrectimage)}</div>
                                        )}
                                    </>
                                ) : (header !== '' && headerType === 'VIDEO') ? (
                                    <>
                                        {header.endsWith(".mp4") ? (
                                            <video controls className={classes.cardMedia}>
                                                <source src={header} type="video/mp4" />
                                                Tu navegador no soporta la etiqueta de video.
                                            </video>
                                        ) : (
                                            <div>{t(langKeys.selectcorrectvideo)}</div>
                                        )}
                                    </>
                                ) : (header !== '' && headerType === 'DOCUMENT') ? (
                                    <>
                                        {header.endsWith(".pdf") ? (
                                            <>
                                                {getFileIcon(header)}
                                            </>
                                        ) : (
                                            <div>{t(langKeys.selectcorrectdocument)}</div>
                                        )}
                                    </>
                                ) : (
                                    <span>No media selected</span>
                                )}
                            </>
                        ) : (
                            <></>
                        )}
                        {body !== '' && (
                            <div className={classes.body} style={{ marginTop: 10 }}
                                dangerouslySetInnerHTML={{ __html: parseFormattedText(getFormattedBody()) }}>
                            </div>
                        )}
                        {footer !== '' && (
                            <span className={classes.footer}>{footer}</span>
                        )}
                        <span className={classes.chatTime} style={{ color: 'black', marginTop: 10 }}>16:59</span>
                        <div>
                            {combinedButtons.map((btn, index) => {
                                let icon;
                                switch (btn.type) {
                                    case 'text':
                                        icon = <ReplyIcon className={classes.icon} />;
                                        break;
                                    case 'URL':
                                        icon = <OpenInNewIcon className={classes.icon} />;
                                        break;
                                    case 'PHONE':
                                        icon = <PhoneIcon className={classes.icon} />;
                                        break;
                                    case 'PHONE_NUMBER':
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
                            {combinedButtons.length > 3 && (
                                <div className={classes.cardButton2} style={{ cursor: 'pointer' }} onClick={() => setShowAllButtons(true)}>
                                    <ListIcon className={classes.icon} />
                                    <span>See all options</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {showAllButtons && (
                    <div className={classes.dialog}>
                        <div className={classes.headerStyle}>
                            <IconButton onClick={() => setShowAllButtons(false)}>
                                <ClearIcon />
                            </IconButton>
                            <span className={classes.title}>All Options</span>
                        </div>
                        <div>
                            {combinedButtons.map((btn: Dictionary, index: number) => {
                                let icon;
                                switch (btn.type) {
                                    case 'text':
                                        icon = <ReplyIcon className={classes.icon} />;
                                        break;
                                    case 'URL':
                                        icon = <OpenInNewIcon className={classes.icon} />;
                                        break;
                                    case 'PHONE':
                                        icon = <PhoneIcon className={classes.icon} />;
                                        break;
                                    case 'PHONE_NUMBER':
                                        icon = <PhoneIcon className={classes.icon} />;
                                        break;
                                    default:
                                        icon = null;
                                }
                                return (
                                    <div key={index}>
                                        <div className={index === combinedButtons.length - 1 ? classes.cardButtonModal2 : classes.cardButton}>
                                            {icon}
                                            <span className={classes.btntext}>{btn.text}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

interface MessagePreviewCarouselProps {
    body: string;
    bodyvariables: Dictionary[];
    carouselCards: Dictionary[];
}

export const MessagePreviewCarousel: React.FC<MessagePreviewCarouselProps> = ({ body, bodyvariables, carouselCards }) => {
    const classes = useStyles();
    const containerRef = useRef(null);
    const containerRef2 = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Ajusta el factor de desplazamiento si es necesario
        containerRef.current.scrollLeft = scrollLeft - walk;
        containerRef2.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Ajusta el factor de desplazamiento si es necesario
        containerRef.current.scrollLeft = scrollLeft - walk;
        containerRef2.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const parseFormattedText = (text: string) => {
        const monospace = /```(.*?)```/g;
        text = text.replace(monospace, '<code>$1</code>');

        const bold = /\*(.*?)\*/g;
        text = text.replace(bold, '<strong>$1</strong>');

        const italic = /_(.*?)_/g;
        text = text.replace(italic, '<em>$1</em>');

        const strikethrough = /~(.*?)~/g;
        text = text.replace(strikethrough, '<del>$1</del>');

        return text;
    };

    const getFormattedBody = (body: string, bodyvariables: Dictionary[]) => {
        let formattedBody = body;
        bodyvariables.forEach(variable => {
            const regex = new RegExp(`\\{\\{${variable.variable}\\}\\}`, 'g');
            formattedBody = formattedBody.replace(regex, variable.text);
        });
        return formattedBody;
    };

    return (
        <div className={classes.messagePrevContainer}>
            <div className={classes.container} style={{ width: 350 }}>
                <div className={classes.messageCard}>
                    {body !== '' && (
                        <div className={classes.body} style={{ marginTop: 10 }}
                            dangerouslySetInnerHTML={{ __html: parseFormattedText(getFormattedBody(body, bodyvariables)) }}>
                        </div>
                    )}
                    <span className={classes.chatTime}>11:54</span>
                </div>
            </div>
            <div style={{ height: 6 }} />
            <div
                className={classes.combinedContainer}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className={classes.containerCarousel} ref={containerRef}>
                    {carouselCards.length > 0 && carouselCards.map((card, index) => (
                        <div key={index} className={classes.messageCard2} style={{ borderRadius: '15px 15px 0px 0px' }}>
                            <div className={classes.cardMediaContainer} style={{ width: 280 }}>
                                <img src={card.header ? card.header : NoImage} alt="Selected Image" className={classes.cardMedia} />
                            </div>
                            <div className={classes.bodyCar}>{getFormattedBody(card.body, card.bodyvariables)}</div>
                        </div>
                    ))}
                </div>
                <div className={classes.buttonsContainer} ref={containerRef2}>
                    {carouselCards.length > 0 && carouselCards.map((card, index) => (
                        <div key={index} className={classes.messageCard2} style={{ borderRadius: '0px 0px 15px 15px', padding: '15px 10px 10px 10px' }}>
                            {card.buttons.length > 0 && (
                                <>
                                    {card.buttons.map((btn: Dictionary, i: number) => (
                                        <div key={i} className={classes.cardButton2}>
                                            {btn.type === 'QUICK_REPLY' ? (
                                                <ReplyIcon className={classes.icon} />
                                            ) : btn.type === 'URL' ? (
                                                <OpenInNewIcon className={classes.icon} />
                                            ) : (
                                                <PhoneIcon className={classes.icon} />
                                            )}
                                            <span>{btn.btn.text}</span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface MessagePreviewAuthenticationProps {
    buttontext: string;
    safetyAdvice: boolean;
    dateAdvice: boolean;
    expiresValue: number;
}

export const MessagePreviewAuthentication: React.FC<MessagePreviewAuthenticationProps> = ({ buttontext, safetyAdvice, dateAdvice, expiresValue }) => {
    const classes = useStyles();

    return (
        <div className={classes.messagePrevContainer}>
            <div className={classes.container} style={{ width: 350 }}>
                <div className={classes.messageCard}>
                    <div>Tu código de verificación es 123456.{safetyAdvice ? ' Por tu seguridad, no lo compartas' : ''}</div>
                    {dateAdvice && (
                        <span style={{ color: 'grey', fontSize: 13, marginTop: 5 }}>Este código caduca en {expiresValue} minutos.</span>
                    )}
                    <span className={classes.chatTime}>11:54</span>
                    {buttontext !== '' && (
                        <div className={classes.cardButton2}>
                            <FileCopyIcon className={classes.icon} />
                            <span>{buttontext}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};