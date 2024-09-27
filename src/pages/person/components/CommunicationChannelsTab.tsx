import { IObjectState, IPerson, IPersonDomains } from "@types";
import { getChannelListByPersonBody } from "common/helpers";
import { useSelector } from "hooks";
import { FC, useEffect } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getChannelListByPerson, resetGetChannelListByPerson } from "store/person/actions";
import { ChannelItem } from "./ChannelItem";

interface ChannelTabProps {
    person: IPerson;
    getValues: UseFormGetValues<IPerson>;
    setValue: UseFormSetValue<IPerson>;
    domains: IObjectState<IPersonDomains>;
}

export const CommunicationChannelsTab: FC<ChannelTabProps> = ({ person }) => {
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
            {channelList.data.map((e, i) => <ChannelItem channel={e} key={`channel_item_${i}`} />)}
        </div>
    );
}