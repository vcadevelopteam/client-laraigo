import React, {  useRef, useState } from "react";
import { DialogZyx } from "components";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from 'hooks';
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import { SendIcon } from "icons";
import clsx from "clsx";
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Popover,
} from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import { WatsonService } from "network";

const useStyles = makeStyles((theme) => ({
    interactionText: {
        whiteSpace: "break-spaces",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "14px",
        lineHeight: 2,
        color: "#2E2C34",
        wordBreak: "break-word",
        width: "fit-content",
        borderRadius: 12,
        borderBottomLeftRadius: 0,
        padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px ${theme.spacing(0.7)}px ${theme.spacing(1)}px`,
        position: "relative",
        maxWidth: 480,
        backgroundColor: "#FFF",
        border: "1px solid #EBEAED",
    },
    interactionAgent: {
        marginLeft: "auto",
    },
    containerTime: {
        visibility: "hidden",
        fontSize: 12,
        float: "right",
        marginLeft: 4,
        paddingRight: 6,
        lineHeight: 1,
        width: 50,
        color: "#4fc3f7",
    },
    timeInteraction: {
        position: "absolute",
        bottom: 1.5,
        height: 16,
        right: 0,
        visibility: "visible",
        color: "#757377",
        padding: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 4,
    },
    iconSend: {
        background: "#5542F6",
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        cursor: "pointer",
    },
    iconSendDisabled: {
        backgroundColor: "#EBEAED",
        cursor: "not-allowed",
    },
    listItemTextPrimary: {
        textAlign: "left",
    },
    listItemTextSecondary: {
        textAlign: "right",
    },
    visibilityIcon: {
        width: "100%",
        height: "100%",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
        gap: "8px",
    },
    messageContainer: {
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        height: "60vh",
        overflow: "auto",
        overflowY: "auto",
        paddingBottom: "80px",
        paddingTop: "20px",
        paddingLeft: "20px",
        marginBottom: "10px",
        backgroundColor: "rgb(242, 240, 247)",
        backgroundImage:
            "url('https://staticfileszyxme.s3.us-east.cloud-object-storage.appdomain.cloud/wallpaper-laraigo.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "210px",
    },
    inputText: {
        lineHeight: 1.5,
        width: "100%",
        fontSize: "1rem",
        color: "#2E2C34",
        outline: "none",
        border: "none",
        padding: "0 10px",
        fontFamily: "dm-sans",
    },
}));

interface IIntent {
    id: number;
    name: string;
    confidence: number;
}

interface IEntity {
    entity: string;
    confidence?: number;
    confidence_entity?: number;
    extractor?: string;
    value?: string;
    start?: number;
    end: number;
    text: string;
}

interface IMessageTest {
    message: string;
    id: number;
    loading?: boolean;
    error?: boolean;
    intent?: IIntent;
    intent_ranking?: IIntent[];
    entities?: IEntity[];
}

const TestModelWatsonXDialog: React.FC<{ openModal: boolean; setOpenModal: (param: any) => void }> = ({
    openModal,
    setOpenModal,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const selectedRow = useSelector(state => state.watson.selectedRow);
    const [formValue, setFormValue] = useState("");
    const dummy = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<IMessageTest[]>([
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        if (!formValue) return;
        e.preventDefault();
        const ID = Math.random();

        const newMessage: IMessageTest = {
            message: formValue,
            loading: true,
            id: ID,
        };

        setMessages([...messages, newMessage]);
        try {
            WatsonService.rasatest({ watsonid: selectedRow?.watsonid||0, text: formValue }).then(
                (axios_result) => {
                    if (axios_result.status === 200) {
                        newMessage.loading = false;
                        newMessage.intent = axios_result.data.data?.intents?.[0]?.intent||"";
                        newMessage.intent_ranking = axios_result.data.data?.intents||"";
                        newMessage.entities = axios_result.data.data.entities;
                        setMessages((messages) => messages.map((m) => (m.id === newMessage.id ? newMessage : m)));
                    }
                }
            );
        } catch (error) {
            newMessage.error = true;
            setMessages((messages) => messages.map((m) => (m.id === newMessage.id ? newMessage : m)));
        }

        setFormValue("");
        if (dummy.current) {
            dummy.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <DialogZyx
            open={openModal}
            title={"Prueba tu modelo"}
            buttonText1={t(langKeys.cancel)}
            handleClickButton1={() => setOpenModal(false)}
        >
            <div style={{ display: "flex", flexDirection: "column", minHeight: "400px" }}>
                <div className={classes.messageContainer}>
                    {messages?.map((msg: IMessageTest, index: number) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    <div ref={dummy}></div>
                </div>

                <div style={{ flex: "0 0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <input
                            type="text"
                            value={formValue}
                            onChange={(e) => setFormValue(e.target.value)}
                            className={classes.inputText}
                            placeholder="Send your message..."
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <div style={{ display: "inline-block" }}>
                            <div
                                className={clsx(classes.iconSend, { [classes.iconSendDisabled]: !formValue })}
                                onClick={handleSubmit}
                            >
                                <SendIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogZyx>
    );
};

const ChatMessage: React.FC<{ message: IMessageTest }> = ({ message }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const photoUrl = "https://www.shareicon.net/data/128x128/2016/09/15/829453_user_512x512.png";
    const classes = useStyles();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <div className={classes.flexRow}>
            <div style={{ flex: 1 }}>
                <div className={classes.flexColumn}>
                    <div className={classes.flexRow} style={{ alignItems: "flex-end" }}>
                        <Avatar src={photoUrl || undefined} style={{ width: "35px", height: "35px" }} />
                        <div className={classes.interactionText} style={{ display: "flex" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ position: "relative", borderBottom: "1px solid #d9d9d9" }}>
                                    <span>{message.message}</span>
                                </div>
                                {!message.loading && !message.error && (
                                    <div style={{ color: "#7721ad", fontSize: "14px" }}>
                                        <div>
                                            <b>Intencion:</b> {message.intent || "no encontrada"}
                                        </div>
                                        <div>
                                            <b>Entidad: </b>
                                            {message.entities?.length
                                                ? `${message.entities?.[0]?.entity}:${message.entities?.[0]?.value} ( ${
                                                     (Number(message.entities[0].confidence) * 100).toFixed(2)} %)`
                                                : "no encontrada"}
                                        </div>
                                    </div>
                                )}
                                {!message.loading && message.error && <div>Error...</div>}
                                {message.loading && <div>Cargando...</div>}
                            </div>
                            {!message.loading && !message.error && message.intent && (
                                <div>
                                    <IconButton onClick={handleClick}>
                                        <Visibility />
                                    </IconButton>
                                    <Popover
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: "bottom",
                                            horizontal: "center",
                                        }}
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "center",
                                        }}
                                    >
                                        <List>
                                            {message.intent_ranking &&
                                                message.intent_ranking.map((i) => (
                                                    <ListItem key={i.id}>
                                                        <ListItemText
                                                            primary={i.name}
                                                            style={{ marginRight: "20px" }}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <span style={{ color: "#B6B4BA" }}>
                                                                {Math.floor(i.confidence * 100) / 100}
                                                            </span>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                ))}
                                        </List>
                                    </Popover>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestModelWatsonXDialog;
