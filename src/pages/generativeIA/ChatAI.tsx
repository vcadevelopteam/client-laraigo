import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { resetAllMain } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { Button, IconButton, Paper, TextField, Typography, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import { SendIcon } from 'icons';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
    },   
    button: {
        padding: 12,
        fontWeight: 500,
        fontSize: '14px',
        textTransform: 'initial',
        marginTop: 5
    },
    chatList: {
        width: '30%',
        borderRight: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2),
    },
    chatMain: {
        flex: 1,
        padding: theme.spacing(2),
    },
    chatHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    chatActions: {
        display: 'flex',
        gap: theme.spacing(1),
    },
    chatMessages: {
        height: '70vh',
        overflowY: 'auto',
    },
    chatInput: {
        display: 'flex',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
    chatInputContainer: {
        position: 'fixed',
        bottom: 0,        
        width: '60%',
        padding: theme.spacing(2),
    },   
}));

interface ChatAIProps {
    setViewSelected: (view: string) => void;
}

const ChatAI: React.FC<ChatAIProps> = ({
    setViewSelected,
    
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const classes = useStyles();

    const [waitSave, setWaitSave] = useState(false);

    const [newChatName, setNewChatName] = useState("");
    const [isCreateChatModalOpen, setCreateChatModalOpen] = useState(false);
    const [chatList, setChatList] = useState([
      { id: 1, title: "Chat 1", date: "Today" },
      { id: 2, title: "Chat 2", date: "Yesterday" },
    ]);
       
    const chatMessages = [
        { id: 1, sender: "User", text: "Hola, prueba", timestamp: "12:00 PM" },
        { id: 2, sender: "ChatGPT", text: "Respuesta", timestamp: "12:01 PM" },
    ];

    useEffect(() => {
        return () => {
            dispatch(resetAllMain());
        };
    }, []);

    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);

    const handleNewChat = () => {
        setCreateChatModalOpen(true);
    };
    
    const handleCloseCreateChatModal = () => {
        setCreateChatModalOpen(false);
        setNewChatName("");
    };
    
    const handleCreateChat = () => {
        const newChat = {
            id: chatList.length + 1,
            title: newChatName || `Chat ${chatList.length + 1}`,
            date: "Today",
        };
        setChatList([newChat, ...chatList]);
        handleCloseCreateChatModal();
    };

    return (
        <div className={classes.container}>
            {/* Chat List */}
            <Paper className={classes.chatList}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Button
                        variant="contained"
                        type="button"
                        startIcon={<CloseIcon />}
                        style={{ backgroundColor: '#ffff', color: 'red', border: '1px solid red' }}
                        onClick={() => setViewSelected('assistantdetail')}
                    >
                        {t(langKeys.close)}
                    </Button>
                    <Button
                        variant="contained"
                        type="button"
                        startIcon={<AddIcon color="secondary" />}
                        style={{ backgroundColor: '#7721AD', color: '#fff' }}
                        onClick={handleNewChat}
                    >
                        Nuevo Chat
                    </Button>
                </div>
        
                {chatList.map(chat => (
                    <div key={chat.id}>
                        <Typography variant="h6" style={{ marginTop: '16px' }}>
                            {chat.date}
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Typography variant="subtitle1">{chat.title}</Typography>
                            </div>
                            <div>
                                <IconButton>
                                    <EditIcon color="primary"/>
                                </IconButton>
                                <IconButton>
                                    <DeleteIcon color="primary"/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                ))}
            </Paper>

            {/* Main Chat Area */}
            <div className={classes.chatMain}>                

                {/* Chat Messages */}
                <div className={classes.chatMessages}>
                    {chatMessages.map(message => (
                        <div key={message.id} style={{ display: 'flex', justifyContent: 'center', backgroundColor: message.sender === 'ChatGPT' ? '': 'white' }}>
                            <div style={{ padding: 10, width: 700 }}>
                                <Typography variant="caption" color="textSecondary">
                                    {message.timestamp}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {message.sender}: {message.text}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <div className={classes.chatInputContainer}>
                    <TextField
                        fullWidth
                        label="Type a message..."
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        variant="contained"
                                        type="button"
                                        startIcon={<SendIcon color="secondary" />}
                                        style={{ backgroundColor: '#7721AD', color: '#fff' }}

                                    >
                                        {t(langKeys.send)}
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatAI;