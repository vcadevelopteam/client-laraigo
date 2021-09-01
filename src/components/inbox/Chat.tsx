import React from 'react'
import { makeStyles } from '@material-ui/core/styles';

export interface ChatProps {

}

const useStyles = makeStyles((theme) => ({
    containerPanel: {
        flex: '1',
        display: 'flex'
    },
    containerTickets: {
        flex: '0 0 250px'
    },
    containerChat: {
        flex: '1'
    },
    containerProfile: {
        flex: '0 0 300px',
        display: 'none'
    }
}));

const Chat: React.FC<ChatProps> = () => {
    const classes = useStyles();

    return (
        <div className={classes.containerPanel}>
            <div className={classes.containerTickets}>tickets</div>
            <div className={classes.containerChat}>chat</div>
            <div className={classes.containerProfile}>profile</div>
        </div>
    );
}

export default Chat;