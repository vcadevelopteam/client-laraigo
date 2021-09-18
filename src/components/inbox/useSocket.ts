import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { newMessageFromClient } from 'store/inbox/actions';
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

    useEffect(() => {
        if (!socket) {
            socket = io('https://socket.laraigo.com', {
                autoConnect: false
            });
            const loginData = { data: { userid: userId, orgid: orgId, usertype: userType } };
            socket.auth = loginData;
            socket.connect();

            socket?.on("connect", () => {
                console.log("connect", socket.id);
                setIsConnected(true)
                // socket.emit('newMessageFromAgent', socket.id);
            });

            socket?.on('newMessageFromClientOnAgent', (data: INewMessageParams) => {
                dispatch(newMessageFromClient(data))
            });

            socket?.on('newMessageFromBotOnAgent', (data: INewMessageParams) => {
                dispatch(newMessageFromClient({ ...data, newConversation: false, usertype: 'agent' }))
            });

            socket?.on('newMessageFromBotOnSupervisor', (data: INewMessageParams) => {
                console.log("newMessageFromBotOnSupervisor", data)
                dispatch(newMessageFromClient({ ...data, newConversation: false, usertype: 'agent' }))
            });


            socket?.on('newMessageFromClientOnSupervisor', (data: INewMessageParams) => {
                dispatch(newMessageFromClient({ ...data, usertype: 'client' }))
            });

            socket?.on("disconnect", () => {
                console.log(socket.connected); // false
            });
        }
    }, []);

    const sendMessage = (data: IReplyTicketParams) => {
        socket?.emit('newMessageFromAgent', data);
    }

    return [sendMessage];
}

export default useSocket;