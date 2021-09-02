import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Dictionary } from "@types";
import { AntTab } from 'components';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import { SearchIcon } from 'icons';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';

export interface ChatProps {
}

const useStyles = makeStyles((theme) => ({
    containerPanel: {
        flex: '1',
        display: 'flex'
    },
    containerTickets: {
        flex: '0 0 300px',
        backgroundColor: '#FFF'
    },
    containerChat: {
        flex: '1'
    },
    containerProfile: {
        flex: '0 0 300px',
        display: 'none'
    },
    container: {
        display: 'flex',
        gap: theme.spacing(2),
        // paddingTop: theme.spacing(2),
        width: '100%'
    },
    containerItemTicket: {
        display: 'flex',
        gap: theme.spacing(1),
        alignItems: 'center',
        padding: theme.spacing(2),
        borderBottom: '1px solid #EBEAED',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgb(235, 234, 237, 0.18)'
        }
    },
    name: {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
    }
}));

const dataTickets = [
    {
        "conversationid": 29356,
        "ticketnum": "0018184",
        "firstconversationdate": "2021-09-01T14:12:19.130644",
        "lastreplyuser": "2021-09-01T14:12:49.771757",
        "lastconversationdate": "2021-09-01T14:13:01.050635",
        "status": "ASIGNADO",
        "lastmessage": "dsa",
        "personcommunicationchannel": "17c192d8-7537-4c19-8108-2ff64e8ab344_CHAZ",
        "displayname": "Carlos",
        "personid": 16213,
        "communicationchannelid": 219,
        "communicationchannelsite": "60a5809c6399e1cc8fddad1f",
        "communicationchanneltype": "CHAZ",
        "imageurldef": "https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=4494757313907641&width=1024&ext=1632121997&hash=AeT8zLVkLYZu_fgscME",
        "countnewmessages": 1,
        "postexternalid": null,
        "commentexternalid": null,
        "replyexternalid": null,
        "channelicon": "fas fa-comments",
        "coloricon": "",
        "edit": false,
        "lastseendate": null
    },
    {
        "conversationid": 29312,
        "ticketnum": "0018150",
        "firstconversationdate": "2021-08-26T14:18:45.403498",
        "lastreplyuser": "2021-08-26T14:18:45.522308",
        "lastconversationdate": null,
        "status": "SUSPENDIDO",
        "lastmessage": "Comentario de suspensión: CIERRE DE JORNADA",
        "personcommunicationchannel": "3ca7a891cde179aefbff5a53_WEBM_OTROS6555",
        "displayname": "proba1",
        "personid": 16511,
        "communicationchannelid": 135,
        "communicationchannelsite": "5e583f2a3b26b6000eb1e019",
        "communicationchanneltype": "WEBM",
        "imageurldef": "",
        "countnewmessages": 0,
        "postexternalid": null,
        "commentexternalid": null,
        "replyexternalid": null,
        "channelicon": "fa fa-globe",
        "coloricon": "",
        "edit": false,
        "lastseendate": null
    },
    {
        "conversationid": 29303,
        "ticketnum": "0018142",
        "firstconversationdate": "2021-08-25T21:18:47.818391",
        "lastreplyuser": "2021-08-25T21:18:47.904366",
        "lastconversationdate": null,
        "status": "SUSPENDIDO",
        "lastmessage": "Comentario de suspensión: CIERRE DE JORNADA",
        "personcommunicationchannel": "0d770ab0510086d5ac677063_WEBM_OTROS74512",
        "displayname": "gera222",
        "personid": 16509,
        "communicationchannelid": 135,
        "communicationchannelsite": "5e583f2a3b26b6000eb1e019",
        "communicationchanneltype": "WEBM",
        "imageurldef": "",
        "countnewmessages": 0,
        "postexternalid": null,
        "commentexternalid": null,
        "replyexternalid": null,
        "channelicon": "fa fa-globe",
        "coloricon": "",
        "edit": false,
        "lastseendate": null
    },
    {
        "conversationid": 29137,
        "ticketnum": "0018062",
        "firstconversationdate": "2021-08-20T01:54:36.833041",
        "lastreplyuser": "2021-08-20T01:56:42.918011",
        "lastconversationdate": "2021-08-20T01:56:42.884512",
        "status": "SUSPENDIDO",
        "lastmessage": "Cliente abandonó la conversación",
        "personcommunicationchannel": "c02a072772dc96873f55727f_WEBM_DNI73319291",
        "displayname": "Hernando",
        "personid": 15163,
        "communicationchannelid": 135,
        "communicationchannelsite": "5e583f2a3b26b6000eb1e019",
        "communicationchanneltype": "WEBM",
        "imageurldef": "",
        "countnewmessages": 5,
        "postexternalid": null,
        "commentexternalid": null,
        "replyexternalid": null,
        "channelicon": "fa fa-globe",
        "coloricon": "",
        "edit": false,
        "lastseendate": null
    }
]

const ItemTicket: React.FC<{ classes: any, item: Dictionary }> = ({ classes, item: { displayname, imageurldef } }) => (
    <div className={classes.containerItemTicket}>
        <Avatar
            src={imageurldef}
        />
        <div style={{ flex: 1 }}>
            <div className={classes.name}>{displayname}</div>
            <div>fecha</div>
        </div>
        <div>5</div>
    </div>
)

const Chat: React.FC<ChatProps> = () => {
    const classes = useStyles();
    const [showSearch, setShowSearch] = useState(false)
    const [pageSelected, setPageSelected] = useState(1)


    return (
        <div className={classes.containerPanel}>
            <div className={classes.containerTickets}>
                <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid #EBEAED' }}>
                    {!showSearch ?
                        <>
                            <Tabs
                                value={pageSelected}
                                indicatorColor="primary"
                                variant="fullWidth"
                                textColor="primary"
                                style={{flex: 1}}
                                onChange={(_, value) => setPageSelected(value)}
                            >
                                <AntTab label="Asigned" />
                                <AntTab label="Pending" />
                                <AntTab label="Paused" />
                            </Tabs>
                            <IconButton style={{ width: '50px' }} size="small" onClick={() => setShowSearch(true)} edge="end">
                                <SearchIcon />
                            </IconButton>
                        </>
                        :
                        <TextField
                            color="primary"
                            fullWidth
                            autoFocus
                            style={{ margin: '8px 10px' }}
                            onBlur={() => setShowSearch(false)}
                            onChange={(e) => {
                                // setvalue(e.target.value);
                                // onChange && onChange(e.target.value);
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            // onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                </div>
                {dataTickets.map(item => (
                    <ItemTicket
                        key={item.conversationid}
                        classes={classes}
                        item={item}
                    />
                ))}
            </div>
            <div className={classes.containerChat}>chat</div>
            <div className={classes.containerProfile}>profile</div>
        </div>
    );
}

export default Chat;