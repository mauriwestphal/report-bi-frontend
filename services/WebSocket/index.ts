import { Manager } from "socket.io-client";

export const connetToServer = () => {

    const manager = new Manager('localhost/socket.io/socket.io.js');

    const socket = manager.socket('/');

};