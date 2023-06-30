import React, { useEffect, useRef, useState } from "react";
import { DialogZyx, SkeletonInteraction } from "components";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "hooks";
import { useDispatch } from "react-redux";
import { getInteractions } from "store/inbox/actions";
import { Dictionary, IGroupInteraction } from "@types";
import { useTranslation } from "react-i18next";
import { langKeys } from "lang/keys";
import ItemGroupInteraction from "./Interaction";
import Button from "@material-ui/core/Button";
import { Trans } from "react-i18next";
import { AgentIcon, BotIcon, DownloadIcon, SendIcon } from "icons";
import DomToImage from "dom-to-image";
import IOSSwitch from "components/fields/IOSSwitch";
import Tooltip from "@material-ui/core/Tooltip";
import clsx from "clsx";
import { validateIsUrl } from "common/helpers";
import {
    Avatar,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Popover,
    Typography,
} from "@material-ui/core";
import { InfoOutlined, Visibility } from "@material-ui/icons";
import { RasaService } from "network";

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
    iconButton: {
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        width: "24px",
        height: "24px",
      },
      visibilityIcon: {
        width: "100%",
        height: "100%",
      },
}));

const TestModelDialog: React.FC<{ openModal: boolean; setOpenModal: (param: any) => void }> = ({
    openModal,
    setOpenModal,
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const el = React.useRef<null | HTMLDivElement>(null);
    const [usertype, setUsertype] = useState("agent");
    const [formValue, setFormValue] = useState("");
    const dummy = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Dictionary[]>([
        { mensaje: "probando mensaje 1", id: 4 },
        { mensaje: "probando mensaje 2", id: 5 },
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        if (!formValue) return;
        e.preventDefault();

        // const axios_result = await RasaService.rasatest({ model_uuid: "3590f67e-b56d-4ac9-b56d-a0e4d1f014c4" });
        // if (axios_result.status === 200) {
        //     console.log("rasa data", axios_result.data);
        // }

        const newMessage = {
            mensaje: formValue,
            id: Math.random(), // Generar un ID único (en este caso, se utiliza Math.random())
        };

        setMessages([...messages, newMessage]);
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
                <div
                    className="mensajes"
                    style={{
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
                    }}
                >
                    {messages &&
                        messages.map((msg: Dictionary, index: number) => <ChatMessage key={index} message={msg} />)}
                    <div ref={dummy}></div>
                </div>
                <div style={{ flex: "0 0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <input
                            type="text"
                            value={formValue}
                            onChange={(e) => setFormValue(e.target.value)}
                            placeholder="Send your message..."
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            style={{
                                lineHeight: 1.5,
                                width: "100%",
                                fontSize: "1rem",
                                color: "#2E2C34",
                                outline: "none",
                                border: "none",
                                padding: "0 10px",
                                fontFamily: "dm-sans",
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

const ChatMessage: React.FC<{ message: Dictionary }> = ({ message }) => {
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

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "flex-end" }}>
                        <Avatar src={photoUrl || undefined} style={{ width: "35px", height: "35px" }} />
                        <div title="hola" className={classes.interactionText}>
                            <div style={{ position: "relative", borderBottom: "1px solid #d9d9d9" }}>
                                <span>{message.mensaje}</span>
                                <svg
                                    viewBox="0 0 11 20"
                                    width="11"
                                    height="20"
                                    style={{ position: "absolute", bottom: -1, left: -9, fill: "#efeff1" }}
                                >
                                    <svg id="message-tail-filled" viewBox="0 0 11 20">
                                        <g transform="translate(9 -14)" fill="inherit" fillRule="evenodd">
                                            <path
                                                d="M-6 16h6v17c-.193-2.84-.876-5.767-2.05-8.782-.904-2.325-2.446-4.485-4.625-6.48A1 1 0 01-6 16z"
                                                transform="matrix(1 0 0 -1 0 49)"
                                                id="corner-fill"
                                                fill="inherit"
                                            ></path>
                                        </g>
                                    </svg>
                                </svg>
                                <span className={classes.containerTime}>
                                    {"10:05"}
                                    <div className={classes.timeInteraction}>{"10:05"}</div>
                                </span>
                            </div>
                            <div style={{ marginLeft: "15px", color: "#7721ad" }}>
                                <span>
                                    <b>Intencion:</b> chip_mas_equipo
                                </span>
                                {/* <IconButton aria-describedby={id} onClick={handleClick}>
                                    <Visibility />
                                </IconButton> */}
                                <span aria-describedby={id} onClick={handleClick} className={classes.iconButton}>
                                    <Visibility className={classes.visibilityIcon} />
                                </span>
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
                                        <ListItem>
                                            <ListItemText primary={`chip_mas_equipo`} style={{ marginRight: "20px" }} />
                                            <ListItemSecondaryAction>
                                                <span style={{ color: "#B6B4BA" }}>0.83</span>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={`tipo_plan_post_pago`}
                                                style={{ marginRight: "20px" }}
                                            />
                                            <ListItemSecondaryAction>
                                                <span style={{ color: "#B6B4BA" }}>0.29</span>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary={`plan_max_play`} style={{ marginRight: "20px" }} />
                                            <ListItemSecondaryAction>
                                                <span style={{ color: "#B6B4BA" }}>0.28</span>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </List>
                                </Popover>
                                <br />
                                <span>
                                    <b>Entidad: </b>marca_equipo:Apple (99%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestModelDialog;
