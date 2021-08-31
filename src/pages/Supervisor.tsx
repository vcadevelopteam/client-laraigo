/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC } from 'react'; // we need this to make JSX compile
import { makeStyles } from '@material-ui/core/styles';

// interface RowSelected {
//     row: Dictionary | null,
//     edit: boolean
// }
// interface DetailPropertyProps {
//     data: RowSelected;
//     setViewSelected: (view: string) => void;
//     multiData: MultiData[];
//     fetchData: () => void
// }
// const arrayBread = [
//     { id: "view-1", name: "Supervisor" },
//     { id: "view-2", name: "Property detail" }
// ];

const useStyles = makeStyles((theme) => ({
    containerDetail: {
        marginTop: theme.spacing(2),
        maxWidth: '80%',
        padding: theme.spacing(2),
        background: '#fff',
    },
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial'
    },
}));


const Supervisor: FC = () => {
    // const classes = useStyles();

    return (
        <div>
            SUPERVISOR
        </div>
    )

}

export default Supervisor;