import React, { useState, useEffect, useRef } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { ITicket, IInteraction, IGroupInteraction, Dictionary } from "@types";
import { makeStyles } from '@material-ui/core/styles';
import { BotIcon, AgentIcon, DownloadIcon2, FileIcon } from 'icons';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useSelector } from 'hooks';
import clsx from 'clsx';
import { ListItemSkeleton } from 'components'
import { convertLocalDate, toTime24HR } from 'common/helpers';
import { manageLightBox } from 'store/popus/actions';
import { goToBottom } from 'store/inbox/actions';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch } from 'react-redux';

const useStylesCarousel = makeStyles((theme) => ({
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
    const classes = useStylesCarousel();
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


const ItemInteraction: React.FC<{ classes: any, interaction: IInteraction }> = ({ interaction: { interactiontype, interactiontext, listImage, indexImage, createdate }, classes }) => {
    const dispatch = useDispatch();

    if (interactiontype === "text")
        return (
            <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top">
                <div className={classes.interactionText} style={{ backgroundColor: 'white' }}>
                    {interactiontext}
                </div>
            </Tooltip>
        );
    else if (interactiontype === "image")
        return (
            <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top">
                <div className={classes.interactionImage}>
                    <img
                        style={{ width: '100%', cursor: 'pointer' }}
                        src={interactiontext} alt=""
                        onClick={() => {
                            dispatch(manageLightBox({ visible: true, images: listImage!!, index: indexImage!! }))
                        }}
                    />
                </div>
            </Tooltip>
        );
    else if (interactiontype === "quickreply") {
        const [text, json] = interactiontext.split("&&&");
        const listButtons: Dictionary[] = JSON.parse(`[${json}]`);
        return (
            <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top">
                <div className={classes.interactionText} style={{ backgroundColor: 'white' }}>
                    {text}
                    <div className={classes.containerQuickreply}>
                        {listButtons.map((item: Dictionary, index: number) => {
                            return <div key={index} className={classes.buttonQuickreply}>{item.text}
                            </div>
                        })}
                    </div>
                </div>
            </Tooltip>
        )
    } else if (interactiontype === "postback") {
        const [text, json] = interactiontext.split("&&&");
        const listButtons: Dictionary[] = JSON.parse(`[${json}]`);
        return (
            <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top">
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
            </Tooltip>
        )
    } else if (interactiontype === "LOG") {
        return (
            <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top">
                <div className={classes.interactionText} style={{ backgroundColor: '#84818A', color: 'white' }}>
                    {interactiontext}
                </div>
            </Tooltip>
        );
    } else if (interactiontype === "carousel") {
        const listItems: Dictionary[] = JSON.parse(`[${interactiontext}]`);
        return (
            <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top">
                <Carousel carousel={listItems} />
            </Tooltip>
        )
    } else if (interactiontype === "audio" || (interactiontype === "video" && interactiontext.includes(".oga"))) {
        return <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top"><audio controls src={interactiontext} ></audio></Tooltip>
    } else if (interactiontype === "video") {
        return <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top"><video width="200" controls src={interactiontext} /></Tooltip>
    } else if (interactiontype === "file") {
        return (
            <Tooltip title={convertLocalDate(createdate).toLocaleString()} arrow placement="top">
                <div style={{ width: 200, backgroundColor: 'white', padding: '16px 13px', borderRadius: 4 }}>
                    <a download rel="noreferrer" target="_blank" href={interactiontext} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                        <FileIcon width="20" height="20" />
                        <div style={{ color: '#171717', textOverflow: 'ellipsis', overflowX: 'hidden', flex: 1, whiteSpace: 'nowrap' }}>{interactiontext.split("/").pop()}</div>
                        <DownloadIcon2 width="20" height="20" color="primary" />

                    </a>
                </div>
            </Tooltip>
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
                </div>
            </div>
            {usertype === "agent" ?
                <div><AgentIcon style={{ width: 40, height: 40 }} /></div> :
                (usertype === "BOT" && <div><BotIcon style={{ width: 40, height: 40 }} /></div>)
            }
        </div>
    );
}

const InteractionPanel: React.FC<{ classes: any, ticket: ITicket }> = React.memo(({ classes, ticket: { displayname, imageurldef } }) => {
    const dispatch = useDispatch();
    const groupInteractionList = useSelector(state => state.inbox.interactionList);
    const loadingInteractions = useSelector(state => state.inbox.interactionList.loading);
    const isOnBottom = useSelector(state => state.inbox.isOnBottom);

    const el = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (!loadingInteractions && (isOnBottom || isOnBottom === null)) {
            if (el?.current) {
                el.current.scrollIntoView({ behavior: 'smooth' })
            }
        }
    };

    useEffect(scrollToBottom, [loadingInteractions, isOnBottom]);

    const handleScroll = (e: any) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (isOnBottom === null) {
            if (bottom)
                dispatch(goToBottom(true));
        } else {
            if (bottom) {
                if (isOnBottom === false && isOnBottom !== null) {
                    dispatch(goToBottom(true));
                }
            } else {
                if (isOnBottom) {
                    dispatch(goToBottom(false))
                }
            }
        }
    }

    return (
        <div className={classes.containerInteractions} onScroll={handleScroll}>
            {groupInteractionList.loading ? <ListItemSkeleton /> :
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {groupInteractionList.data.map((groupInteraction) => (
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
    )
})

export default InteractionPanel;