import React, { useState } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { IInteraction, IGroupInteraction, Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { BotIcon, AgentIcon, DownloadIcon2, FileIcon, InteractiveListIcon, SeenIcon } from 'icons';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import clsx from 'clsx';
import { useSelector } from 'hooks';
import { manageLightBox } from 'store/popus/actions';
import { useDispatch } from 'react-redux';
import { convertLocalDate } from 'common/helpers';
import Dialog from '@material-ui/core/Dialog';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Avatar from '@material-ui/core/Avatar';

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

const InteractiveList: React.FC<{ onlyTime?: string, interactiontext: string, createdate: string, classes: any, userType: string }> = ({ interactiontext, createdate, classes, userType, onlyTime }) => {
    const [open, setOpen] = React.useState(false);

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
                <InteractiveListIcon /> OPTIONS
            </div>
            <TimerInteraction interactiontype="interactivelist" createdate={createdate} userType={userType} time={onlyTime || ""} />
            <Dialog
                onClose={handleClose}
                aria-labelledby="simple-dialog-title"
                open={open}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Options</DialogTitle>
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

const ItemInteraction: React.FC<{ classes: any, interaction: IInteraction, userType: string }> = ({ interaction: { interactiontype, interactiontext, listImage, indexImage, createdate, onlyTime }, classes, userType }) => {
    const dispatch = useDispatch();

    if (interactiontype === "text")
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })}>
                {interactiontext}
                <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
            </div>
        );
    else if (interactiontype === "image")
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={classes.interactionImage}>
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
    else if (interactiontype === "quickreply") {

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
        
        const listButtons: Dictionary[] = JSON.parse(`[${json}]`);
        return (
            <div className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })} style={{ display: 'inline-block' }}>
                {text}
                <div className={classes.containerQuickreply}>
                    {listButtons.map((item: Dictionary, index: number) => {
                        return <div key={index} className={classes.buttonQuickreply}>{item.text}
                        </div>
                    })}
                </div>
                <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} time={onlyTime || ""} />
            </div>
        )
    } else if (interactiontype === "postback") {
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
    } else if (interactiontype === "LOG") {
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })} style={{ backgroundColor: '#84818A', color: 'white' }}>
                {interactiontext}
                <PickerInteraction userType={userType!!} fill="#84818A" />
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} background={true} time={onlyTime || ""} />
            </div>
        );
    } else if (interactiontype === "carousel") {
        const listItems: Dictionary[] = JSON.parse(`[${interactiontext}]`);
        return (<Carousel carousel={listItems} />)
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
        return (
            <div style={{ width: 200, backgroundColor: 'white', padding: '16px 13px', borderRadius: 4, position: 'relative' }}>
                <a download rel="noreferrer" target="_blank" href={interactiontext} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                    <FileIcon width="20" height="20" />
                    <div style={{ color: '#171717', textOverflow: 'ellipsis', overflowX: 'hidden', flex: 1, whiteSpace: 'nowrap' }}>{interactiontext.split("/").pop()}</div>
                    <DownloadIcon2 width="20" height="20" color="primary" />

                </a>
                <TimerInteraction interactiontype={interactiontype} createdate={createdate} userType={userType} background={true} time={onlyTime || ""} />
            </div>
        )
    } else if (interactiontype === "interactivebutton") {
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
    } else if (interactiontype === "reply-text") {
        const textres = interactiontext.split("###")[1];
        // const typeref = interactiontext.split("###")[0].split("&&&")[0];
        // const textref = interactiontext.split("###")[0].split("&&&")[1];
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
        return (
            <InteractiveList
                interactiontext={interactiontext}
                createdate={createdate}
                classes={classes}
                userType={userType}
                onlyTime={onlyTime}
            />
        )
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
        return (
            <div title={convertLocalDate(createdate).toLocaleString()} className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })} style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                {interactiontext}
            </div>
        );
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
                        <div key={index} className={clsx({
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