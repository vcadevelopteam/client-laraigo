import React, { useState, useEffect, useRef } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { ITicket, IInteraction, IGroupInteraction, Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CheckIcon, BotIcon, AgentIcon, DownloadIcon2, FileIcon } from 'icons';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { showInfoPanel } from 'store/inbox/actions';
import clsx from 'clsx';
import { ReplyPanel, ListItemSkeleton } from 'components'
import { convertLocalDate, toTime24HR } from 'common/helpers';

const ButtonsManageTicket: React.FC<{ classes: any }> = ({ classes }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);
    return (
        <>
            <div className={classes.containerButtonsChat}>
                <div className={classes.buttonCloseticket}>
                    <CheckIcon /> <span style={{ marginLeft: 8 }} >Close ticket</span>
                </div>
                <div className={classes.buttonIcon} onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVertIcon style={{ color: '#000' }} />
                </div>
                <div className={classes.buttonIcon}>
                    <VideocamIcon style={{ color: '#000' }} />
                </div>
                <div className={classes.buttonIcon}>
                    <CallIcon style={{ color: '#000' }} />
                </div>
            </div>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                }}>Reasignar</MenuItem>
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                }}>Clasificar</MenuItem>
            </Menu>
        </>
    )
}

const useStyles = makeStyles((theme) => ({
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
    }
}));

const Carousel: React.FC<{ carousel: Dictionary[] }> = ({ carousel }) => {
    const classes = useStyles();
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

const ItemInteraction: React.FC<{ classes: any, interaction: IInteraction }> = ({ interaction: { interactiontype, interactiontext }, classes }) => {
    if (interactiontype === "text")
        return <div className={classes.interactionText} style={{ backgroundColor: 'white' }}>{interactiontext}</div>;
    else if (interactiontype === "image")
        return (
            <div className={classes.interactionImage}>
                <img style={{ width: '100%' }} src={interactiontext} alt="" />
            </div>);
    else if (interactiontype === "quickreply") {
        const [text, json] = interactiontext.split("&&&");
        const listButtons: Dictionary[] = JSON.parse(`[${json}]`);
        return (
            <div className={classes.interactionText} style={{ backgroundColor: 'white' }}>
                {text}
                <div className={classes.containerQuickreply}>
                    {listButtons.map((item: Dictionary, index: number) => {
                        return <div key={index} className={classes.buttonQuickreply}>{item.text}
                        </div>
                    })}
                </div>
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
        return <div className={classes.interactionText} style={{ backgroundColor: '#84818A', color: 'white' }}>{interactiontext}</div>;
    } else if (interactiontype === "carousel") {
        const listItems: Dictionary[] = JSON.parse(`[${interactiontext}]`);
        return <Carousel carousel={listItems} />
    } else if (interactiontype === "audio" || (interactiontype === "video" && interactiontext.includes(".oga"))) {
        return <audio controls src={interactiontext} ></audio>
    } else if (interactiontype === "video") {
        return <video width="200" controls src={interactiontext} />
    } else if (interactiontype === "file") {
        return (
            <div style={{ width: 200, backgroundColor: 'white', padding: '16px 13px', borderRadius: 4 }}>
                <a download rel="noreferrer" target="_blank" href={interactiontext} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                    <FileIcon width="20" height="20" />
                    <div style={{ color: '#171717', textOverflow: 'ellipsis', overflowX: 'hidden', flex: 1 }}>{interactiontext.split("/").pop()}</div>
                    <DownloadIcon2 width="20" height="20" color="primary" />

                </a>
            </div>
        )
    }
    return <div className={classes.interactionText} style={{ backgroundColor: 'white' }}>{interactiontype} {interactiontext}</div>;
}

const ItemGroupInteraction: React.FC<{ classes: any, groupInteraction: IGroupInteraction, clientName: string, imageClient: string | null }> = ({ classes, groupInteraction: { usertype, createdate, interactions }, clientName, imageClient }) => {
    const time = toTime24HR(convertLocalDate(createdate, false).toLocaleTimeString());
    return (
        <div style={{ display: 'flex', gap: 8 }}>
            {usertype === "client" && <Avatar src={imageClient || ""} />}
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }} className={clsx({ [classes.groupInteractionAgent]: usertype !== "client" })}>
                    <div className={clsx(classes.name, { [classes.groupInteractionAgent]: usertype !== "client" })}>{usertype === "BOT" ? "BOT" : (usertype === "agent" ? "Agent" : clientName)}</div>
                    <div className={clsx(classes.timeInteraction, { [classes.groupInteractionAgent]: usertype !== "client" })}>{time}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {interactions.map((item: IInteraction, index: number) => (
                        <div key={index} className={clsx({ [classes.interactionAgent]: usertype !== "client" })}>
                            <ItemInteraction interaction={item} classes={classes} />
                        </div>
                    ))}
                    {/* <div ref={el} /> */}
                </div>
            </div>

            {usertype === "agent" ?
                <div><AgentIcon /></div> :
                (usertype === "BOT" && <div><BotIcon style={{ width: 40, height: 40 }} /></div>)
            }
        </div>
    );
}
const ChatPanel: React.FC<{ classes: any, ticket: ITicket }> = React.memo(({ classes, ticket, ticket: { displayname, imageurldef, ticketnum, conversationid } }) => {
    const dispatch = useDispatch();
    const groupInteractionList = useSelector(state => state.inbox.interactionList);

    const showInfoPanelTrigger = () => dispatch(showInfoPanel())

    const el = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        console.log('goto bottom');
        setTimeout(() => {
            if (el?.current) {
                el.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 300);
    };
    useEffect(scrollToBottom, [groupInteractionList]);

    return (
        <div className={classes.containerChat}>
            <div className={classes.headChat}>
                <div>
                    <span
                        className={classes.titleTicketChat}
                        onClick={showInfoPanelTrigger}
                    >Ticket #{ticketnum}</span>
                </div>
                <ButtonsManageTicket classes={classes} />
            </div>
            <div className={classes.containerInteractions}>
                {groupInteractionList.loading ? <ListItemSkeleton /> :
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {groupInteractionList.data.map((groupInteraction, index) => (
                            <ItemGroupInteraction
                                imageClient={imageurldef}
                                clientName={displayname}
                                classes={classes}
                                groupInteraction={groupInteraction}
                                key={groupInteraction.interactionid} />
                        ))}
                    </div>
                }
                <div ref={el} />
            </div>
            <ReplyPanel classes={classes} />
        </div>
    )
})

export default ChatPanel;