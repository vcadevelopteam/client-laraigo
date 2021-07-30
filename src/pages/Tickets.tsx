import React, { FC, useEffect } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { IRequestBody, ITicket } from '@types';
import { getCollection, resetMain } from 'store/main/actions';

type IProps = {
    title: string,
    paragraph: string
}

const rbApplication: IRequestBody = {
    method: "CHATWEBAPPLICATION_SEL",
    parameters: {
        applicationid: 0
    }
};

const Tickets: FC<IProps> = ({ title, paragraph }) => {
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.data);

    useEffect(() => {
        dispatch(getCollection(rbApplication));
        return () => {
            dispatch(resetMain());
        };
    }, []);

    useEffect(() => {
        console.log(mainResult);
    }, [mainResult]);

    if (mainResult.loading) {
        return <h1>LOADING</h1>;
    } else if (mainResult.error) {
        return <h1>ERROR</h1>;
    }

    return (
        <aside>
            <h2>{title || "TICKETSs"}</h2>
            {(mainResult.data as ITicket[]).map(element => <p key={element.name}>{element.name}</p>)}
        </aside>
    );
}

export default Tickets;