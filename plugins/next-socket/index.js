import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { log, logWarn } from 'plugins/helper/log';
import { io, Socket } from 'socket.io-client';
import { isEmpty } from 'lodash';

export const SocketContext = createContext({
    /**
     * @type {Socket}
     */
    socket: undefined,
    /**
     * @type {("connected"|"disconnected"|"connect_error")}
     */
    status: 'disconnected',
    url: '',
    host: '',
    path: undefined,
    rooms: [],
    namespace: undefined,
    auth: {},
    /**
     * @param {{room:String,data:Object}} params
     */
    emit: ({ room, data }) => {},
    /**
     * @param {{room:String,data:Object}} params
     */
    joinRoom: ({ room, data }) => {},
    /**
     * @param {{room:String,data:Object}} params
     */
    leaveRoom: ({ room, data }) => {},
    /**
     * @param {String} name
     */
    setNamespace: (name) => {},
    /**
     * @param {Object} auth
     */
    setAuth: (auth) => {},
});

/**
 * @param  {Object} props -
 * @param  {String} props.host -
 * @param  {String} props.path -
 * @param  {String} props.defaultNamespace -
 */
export const SocketProvider = (props) => {
    const { host, path, defaultNamespace, children } = props;
    /**
     * @type {[Socket, void]}
     */
    const [socket, setSocket] = useState();
    const [url, setUrl] = useState(host);
    const [status, setStatus] = useState('disconnected');
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState({});
    const [namespace, setNamespace] = useState(defaultNamespace || '');
    const [auth, setAuth] = useState({});

    const emit = (...args) => {
        if (socket) socket.emit(...args);
    };

    /**
     * @param  {Object} params
     * @param  {String} params.room
     * @param  {Object} params.data
     */
    const joinRoom = ({ room, data }) => {
        socket.emit('room:join', { room, data });
    };

    const leaveRoom = (params) => {
        socket.emit('room:leave', params);
    };

    const onRoomChange = (params) => {
        if (params.room) setRoom(params.room);
    };

    const onConnect = () => {
        console.log(`[next-socket > namespace > ${namespace}] connected:`, { ...auth, socketId: socket.id });
        setStatus('connected');

        // socket.on("room:join", onRoomChange);
        // socket.on("room:leave", onRoomChange);
    };

    const onDisconnect = () => {
        setStatus('disconnected');

        // socket.off("room:join", onRoomChange);
        // socket.off("room:leave", onRoomChange);
    };

    const onConnectError = (error) => {
        logWarn(`[next-socket > namespace > ${namespace}] error:`, error);
        setStatus('connect_error');

        // socket.off("room:join", onRoomChange);
        // socket.off("room:leave", onRoomChange);
    };

    useEffect(() => {
        // console.log(`next-socket > socket:`, socket);
        if (isEmpty(auth)) return;
        if (socket) {
            socket.on('connect', onConnect);
            socket.on('disconnect', onDisconnect);
            socket.on('connect_error', onConnectError);
            socket.auth = auth;
            socket.connect();
            // console.log(`[next-socket > namespace > ${namespace}] reconnecting > auth:`, auth);

            return () => {
                socket.off('connect', onConnect);
                socket.off('disconnect', onDisconnect);
                socket.off('connect_error', onConnectError);
                // socket.disconnect();
                // setSocket(null);
            };
        }
    }, [socket, JSON.stringify(auth)]);

    useEffect(() => {
        // console.log(`next-socket > namespace:`, namespace);
        if (!namespace) return;

        const _url = namespace ? `${host}/${namespace}` : host;
        setUrl(_url);
    }, [namespace]);

    useEffect(() => {
        // console.log(`next-socket > namespace:`, namespace);
        if (!url) return;

        const _socket = io(url, {
            path,
            transports: ['websocket'],
            autoConnect: false,
            forceNew: true,
        });
        setSocket(_socket);

        return () => setSocket(null);
    }, [url]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                status,
                host,
                path,
                namespace,
                setNamespace,
                emit,
                room,
                rooms,
                joinRoom,
                leaveRoom,
                auth,
                setAuth,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

/**
 * @param  {Object} props -
 */
export const useSocket = (props = {}) => {
    const context = useContext(SocketContext);

    return context;
};

/**
 * @param  {React.Component} Element - Next.js Page Component
 * @param  {Object} options - Socket.IO connection options
 * @param  {String} options.host - Socket.IO host
 * @param  {String} options.path - Socket.IO path (default: /socket.io)
 * @param  {String} options.namespace - Socket.IO namespace
 */
export const withSocket = (Element, options) => (props) => {
    return (
        <SocketProvider {...options}>
            <Element {...props} />
        </SocketProvider>
    );
};
