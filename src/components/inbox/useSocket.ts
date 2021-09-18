import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { replyMessage, addTicket, modifyTicket } from 'store/inbox/actions';
import { ITicket, IInteraction, INewMessageParams, IReplyTicketParams } from "@types";

interface ISocketProps {
    userType: string;
    userId: number;
    orgId: number;
}
let socket: any;
const useSocket = ({ userType, userId, orgId }: ISocketProps) => {
    // const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const dispatch = useDispatch();

    const ticketList = useSelector(state => state.inbox.ticketList);
    const agentSelected = useSelector(state => state.inbox.agentSelected);
    const ticketSelected = useSelector(state => state.inbox.ticketSelected);

    useEffect(() => {
        if (!socket) {
            socket = io('https://socket.laraigo.com', {
                autoConnect: false
            });
            const ff = { data: { userid: userId, orgid: orgId, usertype: userType } };
            socket.auth = ff;
            socket.connect();

            socket?.on("connect", () => {
                console.log("connect", socket.id);
                setIsConnected(true)

                // socket.emit('newMessageFromAgent', socket.id);
            });

            // if (userType === 'AGENT') {
            socket?.on('newMessageFromClientOnAgent', (data: INewMessageParams) => {
                console.log("newMessageFromClientAgent ", data)
            });

            socket?.on('newMessageFromBotOnAgent', (data: INewMessageParams) => {
                console.log("newMessageFromBotOnAgent ", data)
            });

            socket?.on('newMessageFromBotOnSupervisor', (data: INewMessageParams) => {
                console.log("newMessageFromBotOnSupervisor ", data)
            });

            // socket?.on('newMessageFromAgent', (data: INewMessageParams) => {
            //     console.log("newMessageFromBotOnSupervisor ", data)
            // });
            // }

            // if (userType === 'SUPERVISOR') {
            socket?.on('newMessageFromClientOnSupervisor', (data: INewMessageParams) => {
                console.log("newMessageFromClientOnSupervisor: ", data)
                // validar si el asesor está seleccionado
                if (agentSelected?.userid === data.userid) {
                    //validar si es un ticket nuevo, para agregarlo
                    if (data.newConversation) {
                        dispatch(addTicket(data))
                    } else {
                        const currentTicket = ticketList.data.find((ticket) => ticket.conversationid === data.conversationid)
                        if (currentTicket)
                            dispatch(modifyTicket({ ...currentTicket, ...data, countnewmessages: currentTicket.countnewmessages + 1 }))
                        //modificar la vista previa del ticket
                    }
                    //validar si el tickket está seleccionado
                    if (ticketSelected?.conversationid === data.conversationid) {
                        const newInteraction: IInteraction = {
                            interactionid: 0,
                            interactiontype: "text",
                            interactiontext: data.lastmessage,
                            createdate: new Date().toISOString(),
                            userid: 999999,
                            usertype: "client",
                        }
                        dispatch(replyMessage(newInteraction));
                    }
                }
            });
            // }
            socket?.on("disconnect", () => {
                console.log(socket.connected); // false
            });
        }
        // setSocket(newsocket);

    }, [agentSelected, ticketSelected]);

    const sendMessage = (data: IReplyTicketParams) => {
        console.log("DD")
        socket?.emit('newMessageFromAgent', data);
    }

    // useEffect(() => {
    //     // socket?.on("connect", () => {
    //     //     console.log("connect", socket.id);
    //     //     setIsConnected(true)

    //     //     // socket.emit('newMessageFromAgent', socket.id);
    //     // });

    //     // // if (userType === 'AGENT') {
    //     // socket?.on('newMessageFromClientOnAgent', (data: INewMessageParams) => {
    //     //     console.log("newMessageFromClientAgent ", data)
    //     // });

    //     // socket?.on('newMessageFromBotOnAgent', (data: INewMessageParams) => {
    //     //     console.log("newMessageFromBotOnAgent ", data)
    //     // });

    //     // socket?.on('newMessageFromBotOnSupervisor', (data: INewMessageParams) => {
    //     //     console.log("newMessageFromBotOnSupervisor ", data)
    //     // });

    //     // // socket?.on('newMessageFromAgent', (data: INewMessageParams) => {
    //     // //     console.log("newMessageFromBotOnSupervisor ", data)
    //     // // });
    //     // // }

    //     // // if (userType === 'SUPERVISOR') {
    //     // socket?.on('newMessageFromClientOnSupervisor', (data: INewMessageParams) => {
    //     //     console.log("newMessageFromClientOnSupervisor: ", data)
    //     //     // validar si el asesor está seleccionado
    //     //     if (agentSelected?.userid === data.userid) {
    //     //         //validar si es un ticket nuevo, para agregarlo
    //     //         if (data.newConversation) {
    //     //             dispatch(addTicket(data))
    //     //         } else {
    //     //             const currentTicket = ticketList.data.find((ticket) => ticket.conversationid === data.conversationid)
    //     //             if (currentTicket)
    //     //                 dispatch(modifyTicket({ ...currentTicket, ...data, countnewmessages: currentTicket.countnewmessages + 1 }))
    //     //             //modificar la vista previa del ticket
    //     //         }
    //     //         //validar si el tickket está seleccionado
    //     //         if (ticketSelected?.conversationid === data.conversationid) {
    //     //             const newInteraction: IInteraction = {
    //     //                 interactionid: 0,
    //     //                 interactiontype: "text",
    //     //                 interactiontext: data.lastmessage,
    //     //                 createdate: new Date().toISOString(),
    //     //                 userid: 999999,
    //     //                 usertype: "client",
    //     //             }
    //     //             dispatch(replyMessage(newInteraction));
    //     //         }
    //     //     }
    //     // });
    //     // // }
    //     // socket?.on("disconnect", () => {
    //     //     console.log(socket.connected); // false
    //     // });

    // }, [agentSelected, socket, ticketSelected])

    return [sendMessage];
}

export default useSocket;