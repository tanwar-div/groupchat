import {
    addErrorMessageToHTML,
    addServerToUser, Circle, getDirectMessageChannelByUsername,
    getInviteLink,
    getServerInformationByID,
    loadUsersInfo,
    user
} from "./util.js";
import {subscribeToChannel} from "./websocket.js";
import {sendMessage} from "./serverpage.js";

function ServerCircle(serverID: number, serverName: string) {
    return `
        <li class="squircle">
            <button id="${serverID}" data-link>${serverName.substring(0, 2)}</button>
        </li>
    `
}

function insertServerCircleIntoSideBar(squircle: string) {
    document.getElementById("user-server-divider")!.insertAdjacentHTML("afterend", squircle);
}

function createServerCircle(serverID: number, serverName: string) {
    let squircle = ServerCircle(serverID, serverName);
    insertServerCircleIntoSideBar(squircle);
}

export async function loadSideServers() {
    let servers = user.serverList;
    for (const server of servers) {
        if (server.serverName !== "@me") {
            createServerCircle(server.serverID, server.serverName);
        }
    }
}

function handleContextMenu() {
    let contextMenu = document.getElementById("contextMenu")!;
    let curServerID: string;
    let serverInfo: {serverName: string};
    document.body.addEventListener("contextmenu", function (e) {
        if((<Element>e.target)!.matches("[data-link]")) {
            e.preventDefault();
            console.log(e);
            if ((<HTMLElement>e.target).id === "@me") {
                return false;
            }
            contextMenu.style.display = "block"
            contextMenu.style.left = String(e.pageX)+"px";
            contextMenu.style.top = String(e.pageY)+"px";
            curServerID = (<HTMLElement>e.target).id;
            getServerInformationByID(Number(curServerID)).then(r => {
                serverInfo = r;
            });
            return false;
        }
    });
    contextMenu.querySelector("#invite-people")!.addEventListener("click", function () {
        getInviteLink(curServerID).then(responseJSON => {
            contextMenu.style.display = "none";
            document.getElementById("insertservername")!.innerText = `Invite friends to ${serverInfo.serverName} server`
            getServerInformationByID(Number(curServerID)).then(server => {
                function createInviteFriendButtonBar(user: {username: string}) {
                    document.getElementById("invite-friends-list")!.insertAdjacentHTML("beforeend",
                        `
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                ${Circle("32px", "32px")}
                                <div style="padding-left: 40px">
                                    ${user.username}
                                </div>
                            </div>
                            <div>
                                <button class="invite-button btn btn-outline-success btn-sm text-white">Invite</button>
                            </div>
                        </div>
                        `
                    );
                    document.getElementsByClassName("invite-button")!
                        .item(document.getElementsByClassName("invite-button").length - 1)!
                        .addEventListener("click", function () {
                            inviteFriendToServer(user.username, ''+server.serverID);
                        })
                }

                document.getElementById("invite-friends-list")!.innerHTML = "";
                user.acceptedFriends.forEach(createInviteFriendButtonBar)
            })
                document.getElementById("invite-friends-list")
            let inviteCode = responseJSON.invites[responseJSON.invites.length - 1].inviteCode;
            document.getElementById("inviteCode")!.innerText = `http://localhost:8080/invite/${inviteCode}`
        });
    })
    document.body.addEventListener("click", function (){
        contextMenu.style.display = "none";
    })
}

handleContextMenu();

export async function createServer() {
    let serverName = (<HTMLInputElement>document.getElementById("serverName")).value;
    let response = await fetch("http://localhost:8080/server/createserver", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "serverName": serverName
        })

    });
    if (!response.ok) {
        addErrorMessageToHTML("label[for='serverName']", "server name length must be greater than 2");
        return;
    }
    const json: {serverID: number} = await response.json();
    createServerCircle(json.serverID, serverName);
    await addServerToUser(localStorage.getItem("token")!, json.serverID);
    await loadUsersInfo();
    console.log(user);
    getServerInformationByID(json.serverID).then(serverInfo => {
        console.log(serverInfo);
        subscribeToChannel(serverInfo.channels[0].channelID);
    })
}

function inviteFriendToServer(username: string, serverID: string) {
    getDirectMessageChannelByUsername(username).then(channel => {
        getInviteLink(serverID).then(response => {
            sendMessage(channel.channelID,`http://localhost:8080/invite/${response.invites[response.invites.length-1].inviteCode}`);
        })
    });
}


document.getElementById("createServerButton")!.onclick = function () {
    createServer();
}