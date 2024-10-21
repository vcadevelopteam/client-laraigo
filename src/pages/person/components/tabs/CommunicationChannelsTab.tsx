import { getChannelListByPersonBody } from "common/helpers";
import { useSelector } from "hooks";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getChannelListByPerson, resetGetChannelListByPerson } from "store/person/actions";
import { ChannelItem } from "../index";
import { ChannelTabProps } from "pages/person/model";

const CommunicationChannelsTab: FC<ChannelTabProps> = ({ person }) => {
    const dispatch = useDispatch();
    const channelList = useSelector(state => state.person.personChannelList);

    useEffect(() => {
        if (person.personid && person.personid !== 0) {
            dispatch(getChannelListByPerson(getChannelListByPersonBody(person.personid)));
            return () => {
                dispatch(resetGetChannelListByPerson());
            };
        }
    }, [dispatch, person]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 12 }} />
            {channelList.data.map((e, i) => <ChannelItem person={person} channel={e} key={`channel_item_${i}`} />)}
        </div>
    );
}

export default CommunicationChannelsTab;