import React, { FC } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTickets, resetGetTickets } from 'store/ticket/actions';

type IProps = {
    title: string,
    paragraph: string
}

const TicketList: FC<IProps> = ({ title, paragraph }) => {
    const dispatch = useDispatch();
    const ticketList = useSelector(state => state.ticket.ticketList);

    useEffect(() => {
        dispatch(getTickets(1, 20));
        return () => {
            dispatch(resetGetTickets());
        };
    }, []);

    useEffect(() => {
        console.log(ticketList);
    }, [ticketList]);

    if (ticketList.loading) {
        return <h1>LOADING</h1>;
    } else if (ticketList.error) {
        return <h1>ERROR</h1>;
    }

    return (
        <aside>
            <h2>{title || "TICKETSs"}</h2>
            {ticketList.data.map(element => <p key={element.name}>{element.name}</p>)}
        </aside>
    );
}

export default TicketList;
