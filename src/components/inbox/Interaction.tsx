import React, { useState } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { IInteraction, IGroupInteraction, Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { BotIcon, AgentIcon, DownloadIcon2, InteractiveListIcon, SeenIcon, DocIcon, FileIcon1 as FileIcon, PdfIcon, PptIcon, TxtIcon, XlsIcon, ZipIcon } from 'icons';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { langKeys } from 'lang/keys';
import { useSelector } from 'hooks';
import { manageLightBox } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { convertLocalDate, validateIsUrl } from 'common/helpers';
import Dialog from '@material-ui/core/Dialog';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const useStylesInteraction = makeStyles((theme) => ({
    containerCarousel: {
        width: 230,
        backgroundColor: '#f0f2f5',
        borderRadius: 18,
        position: 'relative',
    },
    imageCardCarousel: {
        width: '100%',
        objectFit: 'cover',
        height: '100%'
    },
    buttonCarousel: {
        backgroundColor: '#e4e6eb',
        textAlign: 'center',
        borderRadius: 6,
        height: 36,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 600,
        cursor: 'pointer',
    },
    buttonLeft: {
        position: 'absolute',
        top: '45%',
        left: -20,
        backgroundColor: 'white'
    },
    buttonRight: {
        position: 'absolute',
        top: '45%',
        right: -20,
        backgroundColor: 'white'
    },
    containerTime: {
        visibility: 'hidden',
        fontSize: 12,
        float: 'right',
        marginLeft: 4,
        paddingRight: 6,
        lineHeight: 1,
        width: 50
    },
    timeSeen: {
        color: '#4fc3f7'
    },
    timeInteraction: {
        position: 'absolute',
        bottom: 1.5,
        height: 16,
        right: 0,
        visibility: 'visible',
        color: '#757377',
        padding: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: 4
    },
    timeInteractionWithBackground: {
        position: 'absolute',
        bottom: 3,
        display: 'flex',
        alignItems: 'center',
        height: 13,
        right: 0,
        visibility: 'visible',
        backgroundColor: '#00000059',
        color: '#fff',
        padding: '3px 2px 3px 3px',
        borderRadius: 4,
        marginRight: 4,
        gap: 4
    }
}));

const ShoppingCart: React.FC<{ onlyTime?: string, interactiontext: string, createdate: string, classes: any, userType: string }> = ({ interactiontext, createdate, classes, userType, onlyTime }) => {
    const [open, setOpen] = React.useState(false);
    const { t } = useTranslation();

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const jsonIntt = JSON.parse(interactiontext);

    // const firstimage = jsonIntt.SectionList?.[0]?.ProductList?.[0]?.ImageReference || "";
    // const totalitems = jsonIntt.SectionList.reduce((a: number, i: Dictionary) => a + i.ProductList.length, 0)

    return (
        <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
            [classes.interactionTextAgent]: userType !== 'client',
        })}>
            <div style={{ width: 300 }}>
                <div style={{ display: 'flex', backgroundColor: "#f5f6f6" }}>
                    <img width="70px" height="70px" alt="reference" src={jsonIntt.Product_items[0].ImageReference} />
                    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{jsonIntt.Product_items.length} {t(langKeys.elements)}</div>
                            <div style={{ fontWeight: 'bold' }}>{jsonIntt.Product_items.reduce((acc: number, item: Dictionary) => acc + parseFloat(item.Item_price) * parseFloat(item.Quantity), 0).toFixed(2)} {jsonIntt.Product_items[0].Currency}</div>
                        </div>
                    </div>
                </div>
                <div>
                    {jsonIntt.Text}
                </div>
                <div style={{ height: 2, borderTop: '1px solid rgb(235, 234, 237)', marginTop: 4 }}></div>
                <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00a5f4', cursor: 'pointer' }}
                    onClick={handleClickOpen}
                >{t(langKeys.show_shopping_cart)}</div>
                <TimerInteraction interactiontype="interactivelist" createdate={createdate} userType={userType} time={onlyTime || ""} />
            </div>
            <SwipeableDrawer
                anchor='right'
                open={open}
                onClose={handleClose}
                onOpen={handleClickOpen}
            >
                <div style={{ width: 400, padding: 16 }}>
                    <h4 >{t(langKeys.cart_sent)}</h4>
                    <div>
                        <div style={{ fontWeight: 500 }}>{jsonIntt.Product_items.length} {t(langKeys.elements)}</div>
                        <div style={{ color: '#8696a0' }}>{jsonIntt.Product_items.reduce((acc: number, item: Dictionary) => acc + parseFloat(item.Item_price) * parseFloat(item.Quantity), 0).toFixed(2)} {jsonIntt.Product_items[0].Currency}</div>
                        <div style={{ marginTop: 16 }}>
                        </div>
                    </div>
                    <div>
                        {jsonIntt.Product_items.map((item: Dictionary, index: number) => (
                            <div key={index}>
                                <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                                    <img width="80px" alt="reference" height="80px" src={item.ImageReference} />
                                    <div style={{ display: 'flex', alignItems: 'center', width: '75%', borderTop: '1px solid #ebebeb' }}>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ fontWeight: 500 }}>{item.Title}</div>
                                            <div style={{ color: '#8696a0' }}>{item.Currency} {parseFloat(item.Item_price).toFixed(2)} • {t(langKeys.quantity)}: {item.Quantity}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SwipeableDrawer>
        </div>
    )
}

const CatalogProduct: React.FC<{ onlyTime?: string, interactiontext: string, createdate: string, classes: any, userType: string }> = ({ interactiontext, createdate, classes, userType, onlyTime }) => {
    const [open, setOpen] = React.useState(false);
    const { t } = useTranslation();
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const jsonIntt = JSON.parse(interactiontext);

    if (jsonIntt.Type === "product_list" || jsonIntt.Type === "dynamic") {
        const firstimage = jsonIntt.SectionList?.[0]?.ProductList?.[0]?.ImageReference || "";
        const totalitems = jsonIntt.SectionList.reduce((a: number, i: Dictionary) => a + i.ProductList.length, 0)

        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })}>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: "#f5f6f6", width: 300 }}>
                    {firstimage && <img width="70px" height="70px" src={firstimage} alt="fist" />}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>{jsonIntt.Body}</div>
                            <div style={{ color: '#8696a0' }}>{totalitems} {t(langKeys.elements)}</div>
                        </div>
                    </div>
                </div>
                <div style={{ padding: 8 }}>
                    <div style={{ fontWeight: 500 }}>{jsonIntt.Body}</div>
                    <div style={{ color: '#8696a0' }}>{jsonIntt.Footer}</div>
                </div>
                <div style={{ height: 2, borderTop: '1px solid rgb(235, 234, 237)', marginTop: 4 }}></div>
                <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00a5f4', cursor: 'pointer' }}
                    onClick={handleClickOpen}
                >
                    <InteractiveListIcon /> {t(langKeys.show_items)}
                </div>
                <TimerInteraction interactiontype="interactivelist" createdate={createdate} userType={userType} time={onlyTime || ""} />
                <SwipeableDrawer
                    anchor='right'
                    open={open}
                    onClose={handleClose}
                    onOpen={handleClickOpen}
                >
                    <div style={{ width: 400, padding: 16 }}>
                        <div style={{ marginBottom: 16 }}>{jsonIntt.Body}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, }}>
                            {jsonIntt.SectionList.map((item: Dictionary, index11: number) => (
                                <div key={index11} style={{ cursor: 'pointer' }}>
                                    <div style={{ color: "#008069", marginBottom: 16 }}>{item.Title}</div>
                                    {item.ProductList.map((itemProduct: Dictionary, index22: number) => (
                                        <div key={index22}>
                                            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
                                                <img width="80px" alt="reference" height="80px" src={itemProduct.ImageReference} />
                                                <div style={{ display: 'flex', alignItems: 'center', width: '75%', borderTop: '1px solid #ebebeb' }}>
                                                    <div style={{ width: '100%' }}>
                                                        <div style={{ fontWeight: 500 }}>{itemProduct.Title}</div>
                                                        <div style={{ color: '#8696a0', overflow: "hidden", wordBreak: "break-word", fontWeight: 500, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{itemProduct.Description}</div>
                                                        <div style={{ color: '#8696a0' }}>{itemProduct.Currency} {itemProduct.Price || 10.0}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </SwipeableDrawer>
            </div>
        )
    } else {
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })}>
                <div style={{ width: 300, display: 'flex', flexDirection: 'column' }}>
                    <img width="100%" src={jsonIntt?.Product?.ImageReference} height="320px" alt="reference" />
                    <div style={{ backgroundColor: "#f5f6f6", padding: 8 }}>
                        <div>{jsonIntt?.Product?.Title}</div>
                        <div style={{ color: '#dff3cc' }}>{jsonIntt?.Product?.Price} {jsonIntt?.Product?.Currency}</div>
                    </div>
                    <div style={{ padding: 8 }}>
                        <div style={{ fontWeight: 'bold' }}>{jsonIntt?.Body}</div>
                        <div style={{ color: '#8696a0' }}>{jsonIntt?.Footer}</div>
                    </div>
                </div>
                <TimerInteraction interactiontype="interactivelist" createdate={createdate} userType={userType} time={onlyTime || ""} />
            </div>
        )
    }
}

const InteractiveList: React.FC<{ onlyTime?: string, interactiontext: string, createdate: string, classes: any, userType: string }> = ({ interactiontext, createdate, classes, userType, onlyTime }) => {
    const [open, setOpen] = React.useState(false);
    const { t } = useTranslation();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const jsonIntt = JSON.parse(interactiontext);

    return (
        <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
            [classes.interactionTextAgent]: userType !== 'client',
        })}>
            {jsonIntt.headertype === "text" ? (
                <div style={{ fontWeight: 500 }}>{jsonIntt.header}</div>
            ) : jsonIntt.header}
            {jsonIntt.body}
            {jsonIntt.footer && (
                <div style={{ color: 'rgb(0,0,0,0.45)', fontSize: 12 }}>{jsonIntt.footer}</div>
            )}
            <div style={{ height: 2, borderTop: '1px solid rgb(235, 234, 237)', marginTop: 4 }}></div>
            <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00a5f4', cursor: 'pointer' }}
                onClick={handleClickOpen}
            >
                <InteractiveListIcon />{t(langKeys.options)}
            </div>
            <TimerInteraction interactiontype="interactivelist" createdate={createdate} userType={userType} time={onlyTime || ""} />
            <Dialog
                onClose={handleClose}
                aria-labelledby="simple-dialog-title"
                open={open}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>{t(langKeys.options)}</DialogTitle>
                <DialogContent>
                    {jsonIntt.sections[0].buttons.map((button: any, i: number) => (
                        <div
                            key={i}
                            style={{
                                background: '#FFF',
                                borderRadius: 4,
                                padding: '12px 8px',
                                textTransform: 'uppercase',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                            {button.title}
                            <RadioButtonUncheckedIcon />
                        </div>
                    ))}
                </DialogContent>
            </Dialog>
        </div>
    )
}
const Carousel: React.FC<{ carousel: Dictionary[] }> = ({ carousel }) => {
    const classes = useStylesInteraction();
    const [pageSelected, setPageSelected] = useState(0);

    if (carousel.length === 0) return null;
    return (
        <div className={classes.containerCarousel}>
            <div style={{ height: 157 }}>
                <img src={carousel[pageSelected].mediaUrl} className={classes.imageCardCarousel} alt="logocarousel" />
            </div>
            <div style={{ padding: '12px', wordBreak: 'break-word' }}>
                <div>
                    <div style={{ fontWeight: 600 }}>{carousel[pageSelected].title}</div>
                    <div>{carousel[pageSelected].description}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 8 }}>
                    {(carousel[pageSelected].actions as Dictionary[]).map((action: Dictionary, index: number) => {
                        return <div className={classes.buttonCarousel} key={index}>{action.text}</div>
                    })}
                </div>
            </div>
            {pageSelected > 0 &&
                <Fab
                    className={classes.buttonLeft}
                    size="small"
                    onClick={() => setPageSelected(pageSelected - 1)}
                >
                    <NavigateBeforeIcon style={{ color: '#2E2C34' }} />
                </Fab>
            }
            {pageSelected < carousel.length - 1 &&
                <Fab
                    className={classes.buttonRight}
                    onClick={() => setPageSelected(pageSelected + 1)}
                    size="small"
                >
                    <NavigateNextIcon style={{ color: '#2E2C34' }} />
                </Fab>
            }
        </div>
    )
}
const TimerInteraction: React.FC<{ interactiontype: string, time: string, createdate: string, background?: boolean, userType?: string }> = ({ time, background, userType, createdate, interactiontype }) => {
    const classes = useStylesInteraction();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const [isSeen, setIsSeen] = useState(false)

    React.useEffect(() => {
        if (ticketSelected?.lastseendate && interactiontype !== "LOG") {
            const lastSeenDate = new Date(ticketSelected?.lastseendate);
            const interactionDate = new Date(createdate!!);

            setIsSeen(interactionDate <= lastSeenDate);
        }
    }, [createdate, interactiontype, ticketSelected?.lastseendate])

    return (
        <span className={classes.containerTime}>
            {time}
            {!background ?
                <div className={classes.timeInteraction}>
                    {time}
                    {userType !== "client" && <SeenIcon className={clsx({
                        [classes.timeSeen]: isSeen,
                    })} />}
                </div> :
                <div className={classes.timeInteractionWithBackground}>
                    {time}
                    {userType !== "client" && <SeenIcon className={clsx({
                        [classes.timeSeen]: isSeen,
                    })} />}
                </div>
            }
        </span>
    )
}

const PickerInteraction: React.FC<{ userType: string, fill?: string }> = ({ userType, fill = '#FFF' }) => {
    if (userType === 'client')
        return (
            <svg viewBox="0 0 11 20" width="11" height="20" style={{ position: 'absolute', bottom: -1, left: -9, fill }}>
                <svg id="message-tail-filled" viewBox="0 0 11 20"><g transform="translate(9 -14)" fill="inherit" fillRule="evenodd"><path d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z" transform="matrix(1 0 0 -1 0 49)" id="corner-fill" fill="inherit"></path></g></svg>

            </svg>
        )
    else
        return (
            <svg viewBox="0 0 11 20" width="11" height="20" style={{ position: 'absolute', bottom: 0, right: -9, transform: 'translateY(1px) scaleX(-1)', fill }}>
                <svg id="message-tail-filled" viewBox="0 0 11 20"><g transform="translate(9 -14)" fill="inherit" fillRule="evenodd"><path d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z" transform="matrix(1 0 0 -1 0 49)" id="corner-fill" fill="inherit"></path></g></svg>
            </svg>
        )
}

const ItemInteraction: React.FC<{ classes: any, interaction: IInteraction, userType: string }> = ({ interaction: { interactionid, interactiontype, interactiontext, listImage, indexImage, createdate, onlyTime }, classes, userType }) => {
    const ref = React.useRef<HTMLIFrameElement>(null);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [showfulltext, setshowfulltext] = useState(interactiontext.length <= 450)
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAqrFCH95Tbqwo6opvVPcdtrVd-1fnBLr4" /*"AIzaSyCBij6DbsB8SQC_RRKm3-X07RLmvQEnP9w"*/,
    });

    const [height, setHeight] = React.useState("0px");
    const onLoad = () => {
        setHeight(((ref as any)?.current.contentWindow.document.body.scrollHeight + 20) + "px");
    };

    console.log(interactiontext)
    console.log(interactiontype)
    if (!interactiontext.trim() || interactiontype === "typing")
        return null;
    if (interactiontype === "text")
        return (
            <div
                title={convertLocalDate(createdate).toLocaleString()}
                className={clsx(classes.interactionText, {
                    [classes.interactionTextAgent]: userType !== 'client',
                })}
            >
                <span dangerouslySetInnerHTML={{ __html: validateIsUrl(showfulltext ? interactiontext : interactiontext.substring(0, 450) + "... ") }}></span>
                {!showfulltext && (
                    <div style={{ color: "#53bdeb", display: "contents", cursor: "pointer" }} onClick={() => setshowfulltext(true)}>{t(langKeys.showmore)}</div>
                )
                }
                <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
            </div>
        );
    else if (interactiontype === "html")
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })}>
                <iframe
                    ref={ref}
                    srcDoc={interactiontext}
                    id={`frame-${interactionid}`}
                    width="100%"
                    height={height}
                    title="frame1"
                    onLoad={onLoad}
                    style={{ border: 'none' }}
                >
                </iframe>
                <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
            </div>
        );
    else if (interactiontype === "email") {
        try {
            const [subject, body, files] = interactiontext.split("&%MAIL%&")
            return (
                <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                    [classes.interactionTextAgent]: userType !== 'client',
                })} >
                    <div>RE-LARAIGO: {subject}</div>
                    <iframe
                        ref={ref}
                        srcDoc={body}
                        id={`frame-${interactionid}`}
                        width="100%"
                        title="frame2"
                        height={height}
                        onLoad={onLoad}
                        style={{ border: 'none' }}
                    >
                    </iframe>
                    {(files && files !== "{}") &&
                        Object.keys(JSON.parse(files)).map((file: any) => {
                            let hreffile = JSON.parse(files)[file]
                            let extension = file.split('.').pop()
                            return (
                                <a key={file} download rel="noreferrer" target="_blank" href={hreffile} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4, maxWidth: 200, border: "1px solid #e1e1e1", borderRadius: 5, marginBottom: 5, paddingRight: 5 }}>
                                    {extension === "pdf" ? (
                                        <PdfIcon width="30" height="30" />
                                    ) : (extension === "doc" || extension === "docx") ? (
                                        <DocIcon width="30" height="30" />
                                    ) : (extension === "xls" || extension === "xlsx" || extension === "csv") ? (
                                        <XlsIcon width="30" height="30" />
                                    ) : (extension === "ppt" || extension === "pptx") ? (
                                        <PptIcon width="30" height="30" />
                                    ) : (extension === "text" || extension === "txt") ? (
                                        <TxtIcon width="30" height="30" />
                                    ) : (extension === "zip" || extension === "rar") ? (
                                        <ZipIcon width="30" height="30" />
                                    ) : <FileIcon width="30" height="30" />
                                    }
                                    <div style={{ color: '#171717', textOverflow: 'ellipsis', overflowX: 'hidden', flex: 1, whiteSpace: 'nowrap' }}>{decodeURI(file)}</div>
                                    <DownloadIcon2 width="20" height="20" color="primary" />
                                </a>)
                        })
                    }
                    <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                    <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
                </div>
            );
        } catch (error) {
            return null
        }
    } else if (interactiontype === "image" || interactiontype === "comment-image")
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={classes.interactionImage}>
                <img
                    className={classes.imageCard}
                    src={interactiontext}
                    alt=""
                    crossOrigin={interactiontext.includes('cloud-object-storage') ? 'anonymous' : undefined}
                    onClick={() => {
                        dispatch(manageLightBox({ visible: true, images: listImage!!, index: indexImage!! }))
                    }}
                />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} background={true} />
            </div>
        );
    else if (interactiontype === "quickreply") {
        try {
            let text, json;

            if (interactiontext.substring(0, 1) === "{") {
                const jj = JSON.parse(interactiontext);
                return (
                    <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                        [classes.interactionTextAgent]: userType !== 'client',
                    })}>
                        {jj.stringsmooch}
                        <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                        <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
                    </div>
                );
            } else {
                text = interactiontext.split("&&&")[0];
                json = interactiontext.split("&&&")[1]
            }
            //debugger
            const listButtons: Dictionary[] = JSON.parse(`[${json}]`);
            return (
                <div className={clsx(classes.interactionText, {
                    [classes.interactionTextAgent]: userType !== 'client',
                })} style={{ display: 'inline-block' }}>
                    {text}
                    <div className={classes.containerQuickreply} style={{justifyContent:'space-evenly', display:"flex"}}>
                        {listButtons.map((item: Dictionary, index: number) => {
                            return <div key={index} className={classes.buttonQuickreply}>{item.text || item.title}
                            </div>
                        })}
                    </div>
                    <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                    <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
                </div>
            )
        } catch (error) {
            return null
        }
    } else if (interactiontype === "postback") {
        try {
            const [text, json] = interactiontext.split("&&&");
            const listButtons: Dictionary[] = JSON.parse(`[${json}]`);
            return (
                <div className={classes.containerPostback} style={{ backgroundColor: 'white' }}>
                    <div className={classes.headerPostback}>
                        {text}
                    </div>
                    <div >
                        {listButtons.map((item: Dictionary, index: number) => {
                            return <div key={index} className={classes.buttonPostback}>{item.text}
                            </div>
                        })}
                    </div>
                </div>
            )
        } catch (error) {
            return null
        }
    } else if (interactiontype === "LOG") {
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })} style={{ backgroundColor: '#84818A', color: 'white' }}>
                {showfulltext ? interactiontext : interactiontext.substring(0, 450) + "... "}
                {!showfulltext && (
                    <div style={{ color: "#53bdeb", display: "contents", cursor: "pointer" }} onClick={() => setshowfulltext(true)}>{t(langKeys.showmore)}</div>
                )
                }
                <PickerInteraction userType={userType!!} fill="#84818A" />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} background={true} time={onlyTime || ""} />
            </div>
        );
    } else if (interactiontype === "carousel") {
        try {
            const listItems: Dictionary[] = JSON.parse(`[${interactiontext}]`);
            return (<Carousel carousel={listItems} />)
        } catch (error) {
            return null
        }
    } else if (interactiontype === "audio" || (interactiontype === "video" && interactiontext.includes(".oga"))) {
        return (
            <div className={classes.interactionImage} style={{ borderRadius: 0, height: 50, backgroundColor: 'transparent' }}>
                <audio controls src={interactiontext} className={classes.imageCard} style={{}}></audio>
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} background={true} time={onlyTime || ""} />
            </div>
        )
    } else if (interactiontype === "video") {
        return (
            <div className={classes.interactionImage}>
                <video className={classes.imageCard} width="200" controls src={interactiontext} />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} background={true} />
            </div>
        )
    } else if (interactiontype === "file") {
        const filename = interactiontext.split("/").pop() || "";
        const extension = (filename || "").split(".").pop();

        return (
            <div style={{ width: 200, backgroundColor: 'white', padding: '12px 13px', borderRadius: 4, position: 'relative' }}>
                <a download rel="noreferrer" target="_blank" href={interactiontext} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                    {extension === "pdf" ? (
                        <PdfIcon width="30" height="30" />
                    ) : (extension === "doc" || extension === "docx") ? (
                        <DocIcon width="30" height="30" />
                    ) : (extension === "xls" || extension === "xlsx" || extension === "csv") ? (
                        <XlsIcon width="30" height="30" />
                    ) : (extension === "ppt" || extension === "pptx") ? (
                        <PptIcon width="30" height="30" />
                    ) : (extension === "text" || extension === "txt") ? (
                        <TxtIcon width="30" height="30" />
                    ) : (extension === "zip" || extension === "rar") ? (
                        <ZipIcon width="30" height="30" />
                    ) : <FileIcon width="30" height="30" />
                    }
                    <div style={{ color: '#171717', textOverflow: 'ellipsis', overflowX: 'hidden', flex: 1, whiteSpace: 'nowrap' }}>{filename}</div>
                    <DownloadIcon2 width="20" height="20" color="primary" />
                </a>
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} background={true} time={onlyTime || ""} />
            </div>
        )
    } else if (interactiontype === "interactivebutton") {
        try {
            const jsonIntt = JSON.parse(interactiontext);
            jsonIntt.headertype = jsonIntt.headertype || "text";
            return (
                <div style={{ display: 'flex', gap: 4, flexDirection: 'column' }}>
                    <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                        [classes.interactionTextAgent]: userType !== 'client',
                    })}>
                        {jsonIntt.headertype === "text" ? (
                            <div style={{ fontWeight: 500 }}>{jsonIntt.header}</div>
                        ) : jsonIntt.header}
                        {jsonIntt.body}
                        {jsonIntt.footer && (
                            <div style={{ color: 'rgb(0,0,0,0.45)', fontSize: 12 }}>{jsonIntt.footer}</div>
                        )}
                        <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
                    </div>
                    {jsonIntt.buttons.map((button: any, i: number) => (
                        <div key={i} style={{ background: '#FFF', color: '#00a5f4', borderRadius: 4, padding: '6px 8px', textAlign: 'center', textTransform: 'uppercase' }}>
                            {button.title}
                        </div>
                    ))}
                </div>
            )
        } catch (error) {
            return null
        }
    } else if (interactiontype === "reply-text") {
        const textres = interactiontext.split("###")[1];
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })}>
                {textres}
                <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
            </div>
        );
    } else if (interactiontype === "interactivelist") {
        try {
            return (
                <InteractiveList
                    interactiontext={interactiontext}
                    createdate={createdate}
                    classes={classes}
                    userType={userType}
                    onlyTime={onlyTime}
                />
            )
        } catch (error) {
            return null
        }
    } else if (interactiontype === "post-image") {
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={classes.interactionImage} style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <img
                    className={classes.imageCard}
                    src={interactiontext} alt=""
                    onClick={() => {
                        dispatch(manageLightBox({ visible: true, images: listImage!!, index: indexImage!! }))
                    }}
                />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} background={true} />
            </div>
        );
    } else if (interactiontype === "post-text") {

        const ishtml = interactiontext.includes("###HTML###");
        const text = ishtml ? interactiontext.split("###HTML###")[1] : interactiontext;

        if (ishtml) {
            return (
                <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                    [classes.interactionTextAgent]: userType !== 'client',
                })} style={{ marginLeft: 'auto', marginRight: 'auto' }} dangerouslySetInnerHTML={{ __html: text }}>

                </div>
            );
        } else {
            return (
                <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                    [classes.interactionTextAgent]: userType !== 'client',
                })} style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    {text}
                </div>
            );
        }
    } else if (interactiontype === "whatsappcatalog") {
        return (
            <CatalogProduct
                interactiontext={interactiontext}
                createdate={createdate}
                classes={classes}
                userType={userType}
                onlyTime={onlyTime}
            />
        )
    } else if (interactiontype === "shoppingcart") {
        return (
            <ShoppingCart
                interactiontext={interactiontext}
                createdate={createdate}
                classes={classes}
                userType={userType}
                onlyTime={onlyTime}
            />
        )
    } else if (interactiontype === "location") {

        const coordinates = interactiontext.split("=").pop()?.split(",") || ["", ""];

        return isLoaded ? (
            <div
                title={convertLocalDate(createdate).toLocaleString()}
                className={clsx(classes.interactionText, {
                    [classes.interactionTextAgent]: userType !== 'client',
                })}
            >
                <div style={{ width: "300px" }} className="interaction-gmap">
                    <GoogleMap
                        mapContainerStyle={{
                            width: '100%',
                            height: "200px"
                        }}
                        center={{ lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1]) }}
                        zoom={10}
                    >
                        <Marker
                            position={{ lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1]) }}
                        />
                    </GoogleMap>
                </div>
                <div style={{ display: "none" }} className="interaction-gmap-text">
                    {interactiontext}
                </div>
                <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
            </div>
        ) : null
    }
    return (
        <div className={clsx(classes.interactionText, {
            [classes.interactionTextAgent]: userType !== 'client',
        })}>
            {interactiontext}
            <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
            <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
        </div>
    );
}

const ItemGroupInteraction: React.FC<{ classes: any, groupInteraction: IGroupInteraction, clientName: string, imageClient: string | null }> = ({ classes, groupInteraction: { usertype, interactions } }) => {

    const ticketSelected = useSelector(state => state.inbox.ticketSelected);

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {interactions.map((item: IInteraction, index: number) => (
                        <div key={index} id={`interaction-${item.interactionid}`} className={clsx({
                            [classes.interactionAgent]: usertype !== "client",
                            [classes.interactionFromPost]: ticketSelected?.communicationchanneltype === "FBWA"
                        })}>
                            {!item.interactiontype.includes("post-") && ticketSelected?.communicationchanneltype === "FBWA" && usertype === "client" && (
                                <Avatar src={item.avatar + "" || undefined} />
                            )}
                            <ItemInteraction interaction={item} classes={classes} userType={usertype!!} />
                        </div>
                    ))}
                </div>
            </div>
            {usertype === "agent" ?
                <div style={{ marginTop: 'auto' }}><AgentIcon style={{ width: 40, height: 40 }} /></div> :
                (usertype === "BOT" && <div style={{ marginTop: 'auto' }}><BotIcon style={{ width: 40, height: 40 }} /></div>)
            }
        </div>
    )
};

export default ItemGroupInteraction;