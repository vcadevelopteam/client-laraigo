import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { newMessageFromClient, deleteTicket } from 'store/inbox/actions';
import { IDeleteTicketParams, INewMessageParams, IReplyTicketParams } from "@types";

interface ISocketProps {
    userType: string;
    userId: number;
    orgId: number;
}
let socket: any;
const useSocket = ({ userType, userId, orgId }: ISocketProps) => {

    // const [isConnected, setIsConnected] = useState(false);
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
            });

            socket?.on('deleteTicket', (data: IDeleteTicketParams) => {
                dispatch(deleteTicket(data))
            });
            
            // socket?.on('newMessageFromClientOnAgent', (data: INewMessageParams) => {
            //     dispatch(newMessageFromClient(data))
            // });

            socket?.on('newMessageFromBot', (data: INewMessageParams) => {
                dispatch(newMessageFromClient({ ...data, newConversation: false, usertype: 'agent' }))
            });

            // socket?.on('newMessageFromBotOnSupervisor', (data: INewMessageParams) => {
            //     console.log(data)
            //     dispatch(newMessageFromClient({ ...data, newConversation: false, usertype: 'agent' }))
            // });

            socket?.on('newMessageFromClient', (data: INewMessageParams) => {
                console.log("newMessageFromClient", data)
                dispatch(newMessageFromClient({ ...data, usertype: 'client' }))
            });

            socket?.on("disconnect", () => {
                console.log(socket.connected); // false
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const socketEmitEvent = (event: string, data: any) => {
        socket?.emit(event, data);
    }

    return [socketEmitEvent];
}

export default useSocket;