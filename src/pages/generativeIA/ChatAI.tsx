import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { resetAllMain } from 'store/main/actions';
import { langKeys } from "lang/keys";
import { Button, IconButton, Paper, TextField, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import CloseIcon from '@material-ui/icons/Close';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Avatar from '@material-ui/core/Avatar';
import { Dictionary } from "@types";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',     
        width: '100%',
    },  
    chatList: {
        borderRight: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2),       
    },
    chatMain: {
        flex: 1,           
        paddingLeft: theme.spacing(2),      
    },     
    chatMessages: {
        height: '81vh', 
        overflowY: 'auto',
    },
    chatInput: {
        display: 'flex',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
    chatInputContainer: {
        bottom: 0,
        width: '100%',
        padding: theme.spacing(2),
    },
    buttonscontainer: {
        display: 'flex',      
        gap: '1rem',
        marginBottom: '2rem'
    },
    redbutton: {
        backgroundColor: '#ffff',
        color: 'red',
        border: '1px solid red'
    },
}));

interface ChatAIProps {
    setViewSelected: (view: string) => void;
    row: Dictionary | null;
}

interface ChatMessage {
    id: number;
    sender: string;
    text: string;
    timestamp: string;
}

interface Chat {
    id: number;
    title: string;
    date: string;
    messages: ChatMessage[];
}

const ChatAI: React.FC<ChatAIProps> = ({ setViewSelected , row}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [selectedChatForEdit, setSelectedChatForEdit] = useState<number | null>(null);
    const [, setChatCounter] = useState(1);
    const [selectedChat, setSelectedChat] = useState<number | null>(null);

    const [chatList, setChatList] = useState<Chat[]>([
        { id: 0, title: "Chat #0", date: "Today", messages: [] },
    ]);

    const handleCreateChat = () => {
        setChatCounter(prevCounter => {
            const newChat: Chat = {
                id: prevCounter,
                title: `Chat #${prevCounter}`,
                date: "Today",
                messages: [],
            };
    
            setChatList([newChat, ...chatList]);
            return prevCounter + 1;
        });
    };

    const handleSendMessage = (text: string) => {
        if (selectedChat !== null) {
            const timestamp = new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
    
            const updatedChatList = chatList.map(chat =>
                chat.id === selectedChat
                    ? { ...chat, messages: [...chat.messages, { id: chat.messages.length + 1, sender: "User", text, timestamp }] }
                    : chat
            );
            setChatList(updatedChatList);
        }
    };

    const handleDeleteChat = (chatId: number) => {
        const updatedChatList = chatList.filter(chat => chat.id !== chatId);
        setChatList(updatedChatList);
    };

    const handleEditChatTitleChange = (chatId: number, newTitle: string) => {
        const updatedChatList = chatList.map(chat =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
        );
        setChatList(updatedChatList);
    };

    const handleEditChat = (chatId: number) => {
        setSelectedChatForEdit(chatId);
    };

    const handleSaveChatEdit = () => {
        setSelectedChatForEdit(null);
    };

    const handleChatClick = (chatId: number) => {
        setSelectedChat(chatId);
    };

    const isChatEmpty = () => {
        const selectedChatMessages = chatList.find(chat => chat.id === selectedChat)?.messages || [];
        return selectedChatMessages.length === 0;
    };

    return (
        <div className={classes.container}>
            <Paper className={classes.chatList}>
                <div>{row?.name}</div>
                <div className={classes.buttonscontainer}>
                    <Button
                        variant="contained"
                        type="button"
                        startIcon={<CloseIcon />}
                        className={classes.redbutton}
                        onClick={() => setViewSelected('assistantdetail')}
                    >
                        {t(langKeys.close)}
                    </Button>
                    <Button
                        variant="contained"
                        type="button"
                        startIcon={<AddIcon color="secondary" />}
                        style={{ backgroundColor: '#7721AD', color: '#fff' }}
                        onClick={() => handleCreateChat()} 
                    >
                        {t(langKeys.newchat)}
                    </Button>
                </div>
                {chatList.map((chat, index) => (
                    <div key={chat.id} onClick={() => handleChatClick(chat.id)} style={{ cursor: 'pointer' }}>
                        {index === 0 && (
                            <Typography style={{ marginBottom: '0.5rem' }}>
                                {chat.date}
                            </Typography>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ChatBubbleIcon style={{ color: '#757377', marginRight: '0.5rem' }} />
                                {selectedChatForEdit === chat.id ? (
                                    <TextField
                                        value={chat.title}
                                        onChange={(e) => handleEditChatTitleChange(chat.id, e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSaveChatEdit();
                                            }
                                        }}
                                    />
                                ) : (
                                    <Typography style={{ fontSize: '1.1rem' }}>{chat.title}</Typography>
                                )}
                            </div>
                            <div>
                                <IconButton onClick={() => handleEditChat(chat.id)}>
                                    <EditIcon style={{ color: '#757377'}}/>
                                </IconButton>
                                <IconButton onClick={() => handleDeleteChat(chat.id)}>
                                    <DeleteIcon style={{ color: '#757377' }}/>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                ))}
            </Paper>

            <div className={classes.chatMain}>
                <div className={classes.chatMessages}>
                    {selectedChat !== null && (
                        <>
                            {isChatEmpty() ? (
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Typography variant="body1">
                                        {t(langKeys.howCanIHelpYouToday)}
                                    </Typography>
                                </div>
                            ) : (
                                <>
                                    {chatList.find(chat => chat.id === selectedChat)?.messages.map(message => (
                                        <div key={message.id} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: 10, backgroundColor: message.sender === 'ChatGPT' ? '' : 'white' }}>
                                            <div style={{ marginRight: 10 }}>
                                                <Avatar src="https://cdn.auth0.com/avatars/gm.png" alt="User Avatar" />
                                            </div>
                                            <div>
                                                <Typography variant="caption" color="textSecondary">
                                                    {message.timestamp}
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    {message.sender}: {message.text}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className={classes.chatInputContainer}>
                    <TextField
                        fullWidth
                        label= {t(langKeys.typeamessage)}
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        variant="contained"
                                        type="button"
                                        startIcon={<SendIcon color="secondary" />}
                                        style={{ backgroundColor: '#7721AD', color: '#fff' }}
                                        onClick={() => {
                                            const messageInput = document.getElementById("message-input") as HTMLInputElement;
                                            if (messageInput) {
                                                handleSendMessage(messageInput.value);
                                                messageInput.value = "";
                                            }
                                        }}
                                    >
                                        {t(langKeys.send)}
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                        id="message-input"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                const messageInput = document.getElementById("message-input") as HTMLInputElement;
                                if (messageInput) {
                                    handleSendMessage(messageInput.value);
                                    messageInput.value = "";
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatAI;