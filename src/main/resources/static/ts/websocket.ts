import {addMessage} from "./serverpage.js";
import {getServerInformationByID, jwt, user} from "./util.js";

// @ts-ignore
let stompClient = null
let subscribedChannels: number[] = [];

function connect() {
    console.log(user);
    // @ts-ignore
    let socket = new SockJS('/gs-guide-websocket');
    // @ts-ignore
    stompClient = Stomp.over(socket);
    // @ts-ignore
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        if (user.serverList.length > 0) {
            for (const serverInfo of user.serverList) {
                getServerInformationByID(serverInfo.serverID).then(serverInfo => {
                    for (const channel of serverInfo.channels) {
                        subscribeToChannel(channel.channelID);
                    }
                });
            }
        }
    });
}

function disconnect() {
    // @ts-ignore
    if (stompClient !== null) {
        // @ts-ignore
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

export function subscribeToChannel(channelID: number) {
    if (subscribedChannels.includes(channelID)){
        return;
    }
    // @ts-ignore
    stompClient.subscribe(`/topic/${channelID}`, function (messageJSON) {
        console.log(messageJSON);
        addMessage(JSON.parse(messageJSON.body));
    }, {authorization: jwt()});
    subscribedChannels.push(channelID);
}

connect();


window.onbeforeunload = function () {
    disconnect();
}