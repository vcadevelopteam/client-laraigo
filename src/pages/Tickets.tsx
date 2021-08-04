import React, { FC, useEffect } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { IRequestBody } from '@types';
import { getCollection, resetMain } from 'store/main/actions';

import TableZyx from '../components/fields/table-simple';

type IProps = {
    title: string,
    paragraph: string
}

const rbApplication: IRequestBody = {
    method: "UFN_USER_SEL",
    parameters: {
        id: 0,
        all: true
    }
};

const Tickets: FC<IProps> = ({ title, paragraph }) => {
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.data);

    const columns = React.useMemo(
        () => [
            {
                Header: 'email',
                accessor: 'email',
                NoFilter: true
            },
            {
                Header: 'globalid',
                accessor: 'globalid',
                NoFilter: true
            },
            {
                Header: 'groups',
                accessor: 'groups',
                NoFilter: true
            },
            {
                Header: 'pwd',
                accessor: 'pwd',
                NoFilter: true
            },
            {
                Header: 'roledesc',
                accessor: 'roledesc',
                NoFilter: true
            },
            {
                Header: 'status',
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: 'type',
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: 'userid',
                accessor: 'userid',
                NoFilter: true
            },
            {
                Header: 'usr',
                accessor: 'usr',
                NoFilter: true
            },

        ],
        []
    );

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
        <>
            {/* <h2>{title || "TICKETSs"}</h2> */}
            <TableZyx
                columns={columns}
                titlemodule='Users'
                data={mainResult.data}
                download={true}
                // fetchData={fetchData}
                register={true}
                // selectrow={selectrow}
            />
        </>
    );
}

export default Tickets;