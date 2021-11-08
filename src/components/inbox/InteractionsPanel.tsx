import React, { useEffect, useRef } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { useSelector } from 'hooks';
import { goToBottom, showGoToBottom } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import ItemGroupInteraction from 'components/inbox/Interaction';
import { SkeletonInteraction } from 'components';

const InteractionPanel: React.FC<{ classes: any }> = React.memo(({ classes }) => {

    const dispatch = useDispatch();
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);
    const groupInteractionList = useSelector(state => state.inbox.interactionList);
    const loadingInteractions = useSelector(state => state.inbox.interactionList.loading);
    const isOnBottom = useSelector(state => state.inbox.isOnBottom);

    const el = useRef<null | HTMLDivElement>(null);
    const refContInteractions = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (!loadingInteractions && (isOnBottom || isOnBottom === null)) {
            if (el?.current) {
                el.current.scrollIntoView()
            }
        }
    };

    useEffect(scrollToBottom, [loadingInteractions, isOnBottom]);

    const handleScroll = (e: any) => {
        const diff = Math.abs(Math.ceil(e.target.scrollHeight - e.target.scrollTop) - Math.round(e.target.clientHeight));
        const bottom = diff >= 0 && diff <= 1;

        if (isOnBottom === null) {
            if (bottom)
                dispatch(goToBottom(true));
        } else {
            if (bottom) {
                if (isOnBottom === false && isOnBottom !== null) {
                    dispatch(goToBottom(true));
                }
            } else if (isOnBottom) {
                dispatch(showGoToBottom(true));
                dispatch(goToBottom(false))
            }
        }
    }

    return (
        <div className={`scroll-style-go ${classes.containerInteractions}`} onScroll={handleScroll} ref={refContInteractions}>
            {groupInteractionList.loading ? <SkeletonInteraction /> :
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {groupInteractionList.data.map((groupInteraction) => (
                        <ItemGroupInteraction
                            imageClient={ticketSelected!!.imageurldef}
                            clientName={ticketSelected!!.displayname}
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
