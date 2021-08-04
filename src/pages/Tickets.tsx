import React, { FC, useEffect } from 'react'; // we need this to make JSX compile
import { useSelector } from 'hooks';
import { useDispatch } from 'react-redux';
import { getCollection, resetMain } from 'store/main/actions';
import { TemplateIcons } from 'components';
import { getUserSel } from 'common/helpers';

import TableZyx from '../components/fields/table-simple';

const Tickets: FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector(state => state.data);

    const columns = React.useMemo(
        () => [

            {
                Header: 'Email',
                accessor: 'email',
                NoFilter: true
            },
            {
                Header: 'Globalid',
                accessor: 'globalid',
                NoFilter: true
            },
            {
                Header: 'Groups',
                accessor: 'groups',
                NoFilter: true
            },
            {
                Header: 'Rols',
                accessor: 'roledesc',
                NoFilter: true
            },
            {
                Header: 'Status',
                accessor: 'status',
                NoFilter: true
            },
            {
                Header: 'Type',
                accessor: 'type',
                NoFilter: true
            },
            {
                Header: 'User',
                accessor: 'usr',
                NoFilter: true
            },
            {
                Header: 'Action',
                accessor: 'userid',
                NoFilter: true,
                isComponent: true,
                Cell: (props: any) => {
                    const row = props.cell.row.original;

                    return (
                        <TemplateIcons
                            viewFunction={() => console.log(row)}
                            deleteFunction={() => console.log(row)}
                            editFunction={() => console.log(row)}
                        />
                    )
                }
            },
        ],
        []
    );

    useEffect(() => {
        dispatch(getCollection(getUserSel(0)));
        return () => {
            dispatch(resetMain());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    if (mainResult.loading) {
        return <h1>LOADING</h1>;
    } else if (mainResult.error) {
        return <h1>ERROR</h1>;
    }

    return (
        <>
            <TableZyx
                columns={columns}
                titlemodule='Users'
                data={mainResult.data}
                download={true}
                register={true}
            // fetchData={fetchData}
            // selectrow={selectrow}
            />
        </>
    );
}

export default Tickets;