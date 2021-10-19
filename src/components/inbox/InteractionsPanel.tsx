import React, { useEffect, useRef } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import { ITicket } from "@types";
import { useSelector } from 'hooks';
import { goToBottom } from 'store/inbox/actions';
import { useDispatch } from 'react-redux';
import ItemGroupInteraction from 'components/inbox/Interaction';
import { SkeletonInteraction } from 'components';

const InteractionPanel: React.FC<{ classes: any, ticket: ITicket }> = React.memo(({ classes, ticket: { displayname, imageurldef } }) => {
    const dispatch = useDispatch();
    const groupInteractionList = useSelector(state => state.inbox.interactionList);
    const loadingInteractions = useSelector(state => state.inbox.interactionList.loading);
    const isOnBottom = useSelector(state => state.inbox.isOnBottom);

    const el = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (!loadingInteractions && (isOnBottom || isOnBottom === null)) {
            if (el?.current) {
                el.current.scrollIntoView()
            }
        }
    };

    useEffect(scrollToBottom, [loadingInteractions, isOnBottom]);

    const handleScroll = (e: any) => {        
        // console.log(e.target.scrollHeight - e.target.scrollTop, e.target.clientHeight)
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
            } else {
                if (isOnBottom) {
                    dispatch(goToBottom(false))
                }
            }
        }
    }

    return (
        <div className={`scroll-style-go ${classes.containerInteractions}`} onScroll={handleScroll}>
            {groupInteractionList.loading ? <SkeletonInteraction /> :
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
