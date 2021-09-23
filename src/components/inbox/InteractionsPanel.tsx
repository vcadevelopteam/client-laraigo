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
import { convertLocalDate, toTime12HR } from 'common/helpers';
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

const TimerInteraction: React.FC<{ time: string, background?: boolean }> = ({ time, background }) => (
    <span style={{
        visibility: 'hidden',
        fontSize: 12,
        display: 'inline-flex',
        float: 'right',
        marginLeft: 4,
        paddingRight: 6,
        lineHeight: 1
    }}>
        {time}
        {!background ?
            <div style={{
                position: 'absolute',
                bottom: 0,
                height: 16,
                right: 0,
                visibility: 'visible',
                color: '#757377',
                padding: 'inherit'

            }}>
                {time}
            </div> :
            <div style={{
                position: 'absolute',
                bottom: 4,
                height: 15,
                right: 0,
                visibility: 'visible',
                backgroundColor: '#00000059',
                color: '#fff',
                padding: '2px 4px 2px 3px',
                borderRadius: 4,
                marginRight: 4
            }}>
                {time}
            </div>
        }
    </span>
)

const PickerInteraction: React.FC<{ userType: string, fill?: string }> = ({ userType, fill = '#FFF' }) => {
    if (userType === 'client')
        return (
            <svg viewBox="0 0 11 20" width="11" height="20" style={{ position: 'absolute', bottom: -1, left: -9, fill }}>
                <svg id="message-tail-filled" viewBox="0 0 11 20"><g transform="translate(9 -14)" fill="inherit" fill-rule="evenodd"><path d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z" transform="matrix(1 0 0 -1 0 49)" id="corner-fill" fill="inherit"></path></g></svg>

            </svg>
        )
    else
        return (
            <svg viewBox="0 0 11 20" width="11" height="20" style={{ position: 'absolute', bottom: 0, right: -9, transform: 'translateY(1px) scaleX(-1)', fill }}>
                <svg id="message-tail-filled" viewBox="0 0 11 20"><g transform="translate(9 -14)" fill="inherit" fill-rule="evenodd"><path d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z" transform="matrix(1 0 0 -1 0 49)" id="corner-fill" fill="inherit"></path></g></svg>
            </svg>
        )
}

const ItemInteraction: React.FC<{ classes: any, interaction: IInteraction, userType: string }> = ({ interaction: { interactiontype, interactiontext, listImage, indexImage, createdate, onlyTime }, classes, userType }) => {
    const dispatch = useDispatch();

    if (interactiontype === "text")
        return (
            <div className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })}>
                {interactiontext}
                <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
                <TimerInteraction time={onlyTime || ""} />
            </div>
        );
    else if (interactiontype === "image")
        return (
            <div className={classes.interactionImage}>
                <img
                    className={classes.imageCard}
                    src={interactiontext} alt=""
                    onClick={() => {
                        dispatch(manageLightBox({ visible: true, images: listImage!!, index: indexImage!! }))
                    }}
                />
                <TimerInteraction time={onlyTime || ""} background={true} />
            </div>
        );
    else if (interactiontype === "quickreply") {
        const [text, json] = interactiontext.split("&&&");
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
                <TimerInteraction time={onlyTime || ""} />
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
            <div className={clsx(classes.interactionText, {
                [classes.interactionTextAgent]: userType !== 'client',
            })} style={{ backgroundColor: '#84818A', color: 'white' }}>
                {interactiontext}
                <PickerInteraction userType={userType!!} fill="#84818A" />
                <TimerInteraction background={true} time={onlyTime || ""} />
            </div>
        );
    } else if (interactiontype === "carousel") {
        const listItems: Dictionary[] = JSON.parse(`[${interactiontext}]`);
        return (<Carousel carousel={listItems} />)
    } else if (interactiontype === "audio" || (interactiontype === "video" && interactiontext.includes(".oga"))) {
        return (
            <div className={classes.interactionImage} style={{ borderRadius: 0, height: 50, backgroundColor: 'transparent' }}>
                <audio controls src={interactiontext} className={classes.imageCard} style={{}}></audio>
                <TimerInteraction background={true} time={onlyTime || ""} />
            </div>
        )
    } else if (interactiontype === "video") {
        return (
            <div className={classes.interactionImage}>
                <video className={classes.imageCard} width="200" controls src={interactiontext} />
                <TimerInteraction time={onlyTime || ""} background={true} />
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
                <TimerInteraction background={true} time={onlyTime || ""} />
            </div>
        )
    }
    return (
        <div className={clsx(classes.interactionText, {
            [classes.interactionTextAgent]: userType !== 'client',
        })}>
            {interactiontext}
            <PickerInteraction userType={userType!!} fill={userType === "client" ? "#FFF" : "#eeffde"} />
            <TimerInteraction time={onlyTime || ""} />
        </div>
    );
}

const ItemGroupInteraction: React.FC<{ classes: any, groupInteraction: IGroupInteraction, clientName: string, imageClient: string | null }> = ({ classes, groupInteraction: { usertype, interactions }, clientName, imageClient }) => {

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {interactions.map((item: IInteraction, index: number) => (
                        <div key={index} className={clsx({ [classes.interactionAgent]: usertype !== "client" })}>
                            <ItemInteraction interaction={item} classes={classes} userType={usertype!!} />
                        </div>
                    ))}
                </div>
            </div>
            {usertype === "agent" ?
                <div style={{marginTop: 'auto'}}><AgentIcon style={{ width: 40, height: 40 }} /></div> :
                (usertype === "BOT" && <div style={{marginTop: 'auto'}}><BotIcon style={{ width: 40, height: 40 }} /></div>)
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', }}>
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