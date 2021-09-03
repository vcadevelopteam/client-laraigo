import React, { useState } from 'react'
import { ITicket, IInteraction, IGroupInteraction, Dictionary } from "@types";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CheckIcon } from 'icons';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';

const dataInteractions: IInteraction[] = [
    {
        "interactionid": 311015,
        "interactiontype": "carousel",
        "interactiontext": "{\"title\":\"jaguar titulo\",\"description\":\"jaguar descripcion\",\"mediaUrl\":\"https://dev-testing-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20Org%20Per%C3%9A/450_1000_preview_rev_1.png\",\"mediaType\":\"image/jpeg\",\"actions\":[{\"type\":\"postback\",\"text\":\"holas\",\"payload\":\"holas-jaguar titulo#$CF$#66f2ad8d-9366-7e52-9fdb-a73b596efc4f_678945c1-1852-a8e0-7b79-4f68017431ed\"},{\"type\":\"postback\",\"text\":\"holas2\",\"payload\":\"holas2-jaguar titulo#$CF$#49fc92d1-ef0b-e11d-5216-07bef7f5f577_81adc7d5-1939-8c13-bbbc-100f038283a6\"}]},{\"title\":\"cliente\",\"description\":\"cliente descrpcion\",\"mediaUrl\":\"https://dev-testing-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20Org%20Per%C3%9A/unnamed_preview_rev_1.png\",\"mediaType\":\"image/jpeg\",\"actions\":[{\"type\":\"postback\",\"text\":\"cliente\",\"payload\":\"cliente-cliente#$CF$#98562a56-5824-a59f-fe81-c525dfc9945a_a2a29851-5edc-44d6-0429-99013eb777c4\"}]}",
        "createdate": "2021-09-03T22:33:55.988475",
        "userid": 42,
        "personid": 13514,
        "usertype": "BOT",
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310953,
        "interactiontype": "text",
        "interactiontext": "ff",
        "createdate": "2021-09-03T17:10:47.094843",
        "userid": null,
        "personid": 16213,
        "usertype": null,
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310954,
        "interactiontype": "text",
        "interactiontext": "HOLAAAAAAAAA\n1. CREAR CITA\n2. REAGENDAR CITA\n3. UBICACION\n4. CERRAR TICKET\n5. HANDOFF\n6. UBICACION + CLOSEST\n7. INTERACCIONES",
        "createdate": "2021-09-03T17:10:47.156334",
        "userid": 42,
        "personid": 16213,
        "usertype": "BOT",
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310955,
        "interactiontype": "text",
        "interactiontext": "7",
        "createdate": "2021-09-03T17:10:49.481952",
        "userid": null,
        "personid": 16213,
        "usertype": null,
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310956,
        "interactiontype": "image",
        "interactiontext": "https://dev-testing-storage-01.s3.us-east.cloud-object-storage.appdomain.cloud/VCA%20Org%20Per%C3%9A/450_1000_preview_rev_1.png",
        "createdate": "2021-09-03T17:10:49.513703",
        "userid": 42,
        "personid": 16213,
        "usertype": "BOT",
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310957,
        "interactiontype": "quickreply",
        "interactiontext": "pregunta de respuesta rapida&&&{\"text\":\"botón 1\",\"type\":\"reply\",\"payload\":\"botón 1\"},{\"text\":\"botón 2\",\"type\":\"reply\",\"payload\":\"botón 2\"}",
        "createdate": "2021-09-03T17:10:49.51676",
        "userid": 42,
        "personid": 16213,
        "usertype": "BOT",
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310958,
        "interactiontype": "postback",
        "interactiontext": "Texto + botones\n&&&{\"text\":\"hola\",\"type\":\"link\",\"uri\":\"tel:sssssssss\"},{\"text\":\"hola2\",\"type\":\"link\",\"uri\":\"sssssss\"}",
        "createdate": "2021-09-03T17:10:49.519466",
        "userid": 42,
        "personid": 16213,
        "usertype": "BOT",
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310959,
        "interactiontype": "LOG",
        "interactiontext": "Carlos Farro reasignó este ticket a Carlos Farro",
        "createdate": "2021-09-03T17:11:08.242876",
        "userid": 64,
        "personid": 16213,
        "usertype": "SUPERVISOR",
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310960,
        "interactiontype": "text",
        "interactiontext": "hola q tal",
        "createdate": "2021-09-03T17:11:17.122576",
        "userid": 209,
        "personid": 16213,
        "usertype": "ASESOR",
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    },
    {
        "interactionid": 310961,
        "interactiontype": "text",
        "interactiontext": "resp del assor",
        "createdate": "2021-09-03T17:11:22.487301",
        "userid": 209,
        "personid": 16213,
        "usertype": "ASESOR",
        "avatar": "",
        "likewall": null,
        "hiddenwall": null
    }
]

const convertLocalDate = (date: string | null, validateWithToday: boolean): Date => {
    if (!date) return new Date()
    const nn = new Date(date)
    const dateCleaned = new Date(nn.getTime() + (nn.getTimezoneOffset() * 60 * 1000 * -1));
    return validateWithToday ? (dateCleaned > new Date() ? new Date() : dateCleaned) : dateCleaned;
}

const toTime24HR = (time: string): string => {
    const [h, m] = time.split(':');
    const hint = parseInt(h)
    return `${(hint > 12 ? 24 - hint : hint).toString().padStart(2, "0")}:${m}:${hint > 11 ? "PM" : "AM"}`
}

const getGroupInteractions = (interactions: IInteraction[]): IGroupInteraction[] => {
    return interactions.reduce((acc: any, item: IInteraction, index: number) => {
        const currentUser = item.userid ? "agent" : "client";
        if (acc.last === "") {
            return { data: [{ ...item, usertype: currentUser, interactions: [item] }], last: currentUser }
        } else if (item.userid && acc.last === "agent") {
            acc.data[acc.data.length - 1].interactions.push(item)
        } else if (item.userid && acc.last === "client") {
            acc.data.push({ ...item, usertype: currentUser, interactions: [item] });
        } else if (!item.userid && acc.last === "agent") {
            acc.data.push({ ...item, usertype: currentUser, interactions: [item] });
        } else if (!item.userid && acc.last === "client") {
            acc.data[acc.data.length - 1].interactions.push(item)
        }
        return { data: acc.data, last: currentUser }
    }, { data: [], last: "" }).data;
}

const ButtonsManageTicket: React.FC<{ classes: any }> = ({ classes }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);
    return (
        <>
            <div className={classes.containerButtonsChat}>
                <div className={classes.buttonCloseticket}>
                    <CheckIcon /> <span style={{ marginLeft: 8 }} >Close ticket</span>
                </div>
                <div className={classes.buttonIcon} onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVertIcon style={{ color: '#000' }} />
                </div>
                <div className={classes.buttonIcon}>
                    <VideocamIcon style={{ color: '#000' }} />
                </div>
                <div className={classes.buttonIcon}>
                    <CallIcon style={{ color: '#000' }} />
                </div>
            </div>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                keepMounted
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                }}>Reasignar</MenuItem>
                <MenuItem onClick={(e) => {
                    setAnchorEl(null)
                }}>Clasificar</MenuItem>
            </Menu>
        </>
    )
}

const ItemInteraction: React.FC<{ classes: any, interaction: IInteraction }> = ({ interaction: { interactiontype, interactiontext }, classes }) => {
    
    const [cardSelected, setCardSelected] = useState(0);

    if (interactiontype === "text")
        return <div className={classes.interactionText} style={{ backgroundColor: 'white' }}>{interactiontext}</div>;
    else if (interactiontype === "image")
        return (
            <div className={classes.interactionImage}>
                <img style={{ width: '100%' }} src={interactiontext} alt="" />
            </div>);
    else if (interactiontype === "quickreply") {
        const [text, json] = interactiontext.split("&&&");
        const listButtons: Dictionary[] = JSON.parse(`[${json}]`);
        return (
            <div className={classes.interactionText} style={{ backgroundColor: 'white' }}>
                {text}
                <div className={classes.containerQuickreply}>
                    {listButtons.map((item: Dictionary, index: number) => {
                        return <div key={index} className={classes.buttonQuickreply}>{item.text}
                        </div>
                    })}
                </div>
            </div>
        )
    } else if (interactiontype === "postback") {
        const [text, json] = interactiontext.split("&&&");
        const listButtons: Dictionary[] = JSON.parse(`[${json}]`);
        return (
            <div className={classes.containerPostback} style={{ backgroundColor: 'white' }}>
                <div className={classes.headerPostback}>
                    {text}
                </div>
                <div >
                    {listButtons.map((item: Dictionary, index: number) => {
                        return <div key={index} className={classes.buttonPostback}>{item.text}
                        </div>
                    })}
                </div>
            </div>
        )
    } else if (interactiontype === "LOG") {
        return <div className={classes.interactionText} style={{ backgroundColor: '#84818A', color: 'white' }}>{interactiontext}</div>;
    } else if (interactiontype === "carousel") {
        const listItems: Dictionary[] = JSON.parse(`[${interactiontext}]`);
        console.log(listItems);
        
        return (
            <div style={{width: 200}}>
                {listItems.map((item: Dictionary, index: number) => (
                    <div>
                        <div>
                            <img src={item.mediaUrl} style={{width: '100%'}} alt="logocarousel"/>
                        </div>
                        {(item.actions as Dictionary[]).map((action: Dictionary, index: number) => {
                            return <div key={index} className={classes.buttonPostback}>{action.text}
                            </div>
                        })}
                    </div>
                ))}
            </div>
        )
    }

    return <div className={classes.interactionText} style={{ backgroundColor: 'white' }}>{interactiontype} {interactiontext}</div>;
}

const ItemGroupInteraction: React.FC<{ classes: any, groupInteraction: IGroupInteraction, clientName: string, imageClient: string | null }> = ({ classes, groupInteraction: { usertype, createdate, interactions }, clientName, imageClient }) => {
    const time = toTime24HR(convertLocalDate(createdate, false).toLocaleTimeString());
    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ paddingTop: 8 }}>
                <Avatar src={usertype === "agent" ? "" : (imageClient || "")} />
            </div>
            <div style={{ flex: 1 }}>
                <div className={classes.name}>{clientName}</div>
                <div className={classes.timeInteraction}>{time}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {interactions.map((item: IInteraction, index: number) => (
                        <ItemInteraction interaction={item} classes={classes} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const ChatPanel: React.FC<{ classes: any, ticket: ITicket }> = ({ classes, ticket, ticket: { displayname, imageurldef, ticketnum } }) => {

    return (
        <div className={classes.containerChat}>
            <div className={classes.headChat}>
                <div style={{ fontWeight: 500, fontSize: 20 }}>Ticket #{ticketnum}</div>
                <ButtonsManageTicket classes={classes} />
            </div>
            <div className={classes.containerInteractions}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {getGroupInteractions(dataInteractions).map((groupInteraction, index) => (
                        <ItemGroupInteraction
                            imageClient={imageurldef}
                            clientName={displayname}
                            classes={classes}
                            groupInteraction={groupInteraction}
                            key={index} />
                    ))}
                </div>
            </div>
            <div className={classes.containerResponse}>
                Respuesta
            </div>
        </div>
    )
}

export default ChatPanel;