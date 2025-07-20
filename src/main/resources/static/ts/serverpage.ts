import {
    addMinutes,
    getCurrentChannelID,
    handleCopyInviteLinkButton, jwt,
    loadNameTag, Message, MessageWithProfilePicture
} from "./util.js"
import {loadSideServers} from "./serversidebar.js";
import {navigateTo} from "./route.js";


loadNameTag();
loadSideServers();
handleCopyInviteLinkButton()


export async function sendMessage(channelID: number, message: string) {
    const response = await fetch(`http://localhost:8080/server/${channelID}/postmessages`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': <string>jwt()
        },
        body: JSON.stringify({
                'message': message
            }
        )
    });
    console.log(response.status);
    if (response.status === 403) {
        window.location.href = "http://localhost:8080";
    }
}


export async function loadMessages(channelID: number) {
    fetch(`http://localhost:8080/server/${channelID}/messages`, {
        method: "GET"
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Could not get server messages")
        }
        return response.json();
    }).then(async (messages) => {
        for (const message of messages) {
            await addMessage(message);
        }
    });
}


export async function addMessage(jsonData: { message: string, username: string, postTime: string, channelID: number }) {
    let previousMessageHTML: Element | null = null
    let previousTimestamp: string | null = null
    let previousUsername: string | null = null
    if (document.getElementById("main-content-mid")!.hasChildNodes()) {
        previousMessageHTML = document.getElementById("main-content-mid")!.lastElementChild;
        previousTimestamp = previousMessageHTML!.attributes.getNamedItem("data-timestamp")!.nodeValue;
        previousUsername = previousMessageHTML!.attributes.getNamedItem("data-username")!.nodeValue;
    }
    const hasSevenMinutesPassed = () => {
        const previousDatePlusSeven = addMinutes(new Date(<string>previousTimestamp),7);
        const currentDate = new Date(jsonData.postTime);
        return currentDate >= previousDatePlusSeven;

    }
    if (await getCurrentChannelID() === jsonData.channelID) {
        if (previousMessageHTML === null) {
            document.getElementById("main-content-mid")!.innerHTML += MessageWithProfilePicture(jsonData.message, jsonData.username, jsonData.postTime);
        } else if (jsonData.username === previousUsername && !hasSevenMinutesPassed()) {
            document.getElementById("main-content-mid")!.innerHTML += Message(jsonData.message, jsonData.username, jsonData.postTime);
        } else {
            document.getElementById("main-content-mid")!.innerHTML += MessageWithProfilePicture(jsonData.message, jsonData.username, jsonData.postTime);
        }
    }
}


function MessageBar() {
    return `
        <input type="text" class="form-control message-bar" id="typedinput" placeholder="Type message">
    `
}

function UserForServerMemberSidebar(username: string) {
    return `
        <div style="height: 44px" class="d-flex justify-content-start align-items-center">
            <div class="profile-image"></div>
            <div class="ps-2">${username}</div>
        </div>
    `
}


function ServerOptionsMenu(serverInfo: {serverName: string}) {
    return `
        <div class="dropdown" style="width: 100%">
            <button id="serverNameButton" class="btn w-100 dropdown-toggle p-0" type="button" data-bs-toggle="dropdown" style="height: 48px">
                ${serverInfo.serverName}
            </button>
            <ul class="dropdown-menu">
                <li class="dropdown-item">1</li>
                <li class="dropdown-item">2</li>
                <li class="dropdown-item">3</li>
            </ul>
        </div>
    `
}

function ChannelTopBar() {
    return `
        <div class="h-100 container-fluid d-flex justify-content-between align-items-center">
            <div class="flex-container">
                <svg width="24" height="24" viewBox="0 0 24 24" class="icon" x="0" y="0" aria-hidden="true" role="img">
                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5.88657 21C5.57547 21 5.3399 20.7189 5.39427 20.4126L6.00001 17H2.59511C2.28449 17 2.04905 16.7198 2.10259 16.4138L2.27759 15.4138C2.31946 15.1746 2.52722 15 2.77011 15H6.35001L7.41001 9H4.00511C3.69449 9 3.45905 8.71977 3.51259 8.41381L3.68759 7.41381C3.72946 7.17456 3.93722 7 4.18011 7H7.76001L8.39677 3.41262C8.43914 3.17391 8.64664 3 8.88907 3H9.87344C10.1845 3 10.4201 3.28107 10.3657 3.58738L9.76001 7H15.76L16.3968 3.41262C16.4391 3.17391 16.6466 3 16.8891 3H17.8734C18.1845 3 18.4201 3.28107 18.3657 3.58738L17.76 7H21.1649C21.4755 7 21.711 7.28023 21.6574 7.58619L21.4824 8.58619C21.4406 8.82544 21.2328 9 20.9899 9H17.41L16.35 15H19.7549C20.0655 15 20.301 15.2802 20.2474 15.5862L20.0724 16.5862C20.0306 16.8254 19.8228 17 19.5799 17H16L15.3632 20.5874C15.3209 20.8261 15.1134 21 14.8709 21H13.8866C13.5755 21 13.3399 20.7189 13.3943 20.4126L14 17H8.00001L7.36325 20.5874C7.32088 20.8261 7.11337 21 6.87094 21H5.88657ZM9.41045 9L8.35045 15H14.3504L15.4104 9H9.41045Z"></path>
                </svg>
                <h5 class="mb-0 p-2" id="group-name">Chat</h5>
            </div>
            <div class="flex-container" style="gap: 1rem">
                <button id="members-button">
                    <svg x="0" y="0" class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z"></path>
                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z"></path>
                        <path fill="currentColor" d="M20.0001 20.006H22.0001V19.006C22.0001 16.4433 20.2697 14.4415 17.5213 13.5352C19.0621 14.9127 20.0001 16.8059 20.0001 19.006V20.006Z"></path>
                        <path fill="currentColor" d="M14.8834 11.9077C16.6657 11.5044 18.0001 9.9077 18.0001 8.00598C18.0001 5.96916 16.4693 4.28218 14.4971 4.0367C15.4322 5.09511 16.0001 6.48524 16.0001 8.00598C16.0001 9.44888 15.4889 10.7742 14.6378 11.8102C14.7203 11.8418 14.8022 11.8743 14.8834 11.9077Z"></path>
                    </svg>
                </button>
                <div class="search-bar">
                    <input class="search" type="text" placeholder="Search">
                    <svg class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"></path>
                    </svg>
                </div>
            </div>
        </div>
    `
}


function loadServerMembers(serverInfo: {users: any}) {
    const serverMembers = serverInfo.users;
    console.log(serverMembers)
    const membersGroup = document.getElementById("members-group")
    membersGroup!.innerHTML = ``;
    for (const serverMember of serverMembers) {
        membersGroup!.innerHTML += UserForServerMemberSidebar(serverMember.username);
    }
}

function ServerChannelsLayout() {
    return `
        <div>
            <div class="d-flex justify-content-between">
                <button class="dropdown p-0" data-bs-toggle="collapse" data-bs-target="#channels">
                    <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z" class=""></path></svg>
                    <span style="background: none; color: rgb(148, 155, 164); font-size: 12px" class="fw-bold">TEXT CHANNELS</span>
                </button>
                <button id="createChannelPopupButton" data-bs-target="#createChannelModal" data-bs-toggle="modal">
                    <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13 6a1 1 0 1 0-2 0v5H6a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5V6Z" class=""></path></svg>
                </button>
            </div>
            <div id="channels"></div>
        </div>
    `
}

function ServerChannel(channelInfo: {channelID: number, channelName: string}) {
    return `
        <button class="d-flex justify-content-between p-1 rounded w-100 channel" id="${channelInfo.channelID}">
            <div>
                <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z" clip-rule="evenodd" class=""></path></svg>
                ${channelInfo.channelName}
            </div>
            <div>
                <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z" fill="currentColor" class=""></path><path d="M16.83 12.93c.26-.27.26-.75-.08-.92A9.5 9.5 0 0 0 12.47 11h-.94A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h7.64c.12 0 .17-.31.06-.36C12.82 21.14 12 20.22 12 19a3 3 0 0 1 3-3h.5a.5.5 0 0 0 .5-.5V15c0-.8.31-1.53.83-2.07ZM12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="currentColor"></path></svg>
                <svg class="icon" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.56 1.1c-.46.05-.7.53-.64.98.18 1.16-.19 2.2-.98 2.53-.8.33-1.79-.15-2.49-1.1-.27-.36-.78-.52-1.14-.24-.77.59-1.45 1.27-2.04 2.04-.28.36-.12.87.24 1.14.96.7 1.43 1.7 1.1 2.49-.33.8-1.37 1.16-2.53.98-.45-.07-.93.18-.99.64a11.1 11.1 0 0 0 0 2.88c.06.46.54.7.99.64 1.16-.18 2.2.19 2.53.98.33.8-.14 1.79-1.1 2.49-.36.27-.52.78-.24 1.14.59.77 1.27 1.45 2.04 2.04.36.28.87.12 1.14-.24.7-.95 1.7-1.43 2.49-1.1.8.33 1.16 1.37.98 2.53-.07.45.18.93.64.99a11.1 11.1 0 0 0 2.88 0c.46-.06.7-.54.64-.99-.18-1.16.19-2.2.98-2.53.8-.33 1.79.14 2.49 1.1.27.36.78.52 1.14.24.77-.59 1.45-1.27 2.04-2.04.28-.36.12-.87-.24-1.14-.96-.7-1.43-1.7-1.1-2.49.33-.8 1.37-1.16 2.53-.98.45.07.93-.18.99-.64a11.1 11.1 0 0 0 0-2.88c-.06-.46-.54-.7-.99-.64-1.16.18-2.2-.19-2.53-.98-.33-.8.14-1.79 1.1-2.49.36-.27.52-.78.24-1.14a11.07 11.07 0 0 0-2.04-2.04c-.36-.28-.87-.12-1.14.24-.7.96-1.7 1.43-2.49 1.1-.8-.33-1.16-1.37-.98-2.53.07-.45-.18-.93-.64-.99a11.1 11.1 0 0 0-2.88 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd"></path></svg>
            </div>
        </button>
    `;
}

function loadServerChannels(serverInfo: {serverID: number, channels: any}) {
    document.getElementById("content-sidebar-mid")!.innerHTML = ServerChannelsLayout();
    document.getElementById("createChannelButton")!.onclick = function () {
        const channelName = (<HTMLInputElement>document.getElementById("newChannelName")).value;
        if (channelName.length <= 0) {
            console.log("Channel name cannot be blank")
        } else {
            fetch(`http://localhost:8080/server/${serverInfo.serverID}/createchannel`, {
                method: "POST",
                body: channelName
            }).then(r => {
                console.log(r.text());
            })
        }
    }
    console.log(serverInfo);
    const channels = serverInfo.channels;
    for (let channel of channels) {
        document.getElementById("channels")!.insertAdjacentHTML("beforeend", ServerChannel(channel));
        document.getElementById("channels")!.lastElementChild!.addEventListener("click", function () {
            navigateTo(`${serverInfo.serverID}/${channel.channelID}`);
        })
    }
}

export async function loadServerPage(serverInfo: {serverID: number, serverName: string,channels: any, users: any}) {
    document.getElementById("content-sidebar-mid")!.innerHTML = ``;
    loadServerChannels(serverInfo);
    document.getElementById("content-sidebar-top")!.innerHTML = ServerOptionsMenu(serverInfo);
    loadServerMembers(serverInfo);
}


export function loadServerChannel(channelID: number) {
    document.getElementById("main-content-mid")!.innerHTML = ``;
    document.getElementById("main-content-top")!.innerHTML = ChannelTopBar();
    document.getElementById("main-content-bot")!.innerHTML = MessageBar();
    document.getElementById("members-button")!.onclick = function () {
        let channelMembersBar: HTMLElement = document.getElementById("server-members")!;
        if (channelMembersBar.style.display === "none") {
            channelMembersBar.style.display = "";
        } else {
            channelMembersBar.style.display = "none";
        }
    }
    document.getElementById("typedinput")!.addEventListener("keydown", e => {
        if (e.key === 'Enter') {
            if ((<HTMLInputElement>document.getElementById("typedinput")).value !== "" && document.activeElement === document.getElementById("typedinput")) {
                const input = (<HTMLInputElement>document.getElementById("typedinput")).value;
                sendMessage(channelID, input);
                (<HTMLInputElement>document.getElementById("typedinput")).value = '';
            }
        }
    })
    loadMessages(channelID);
}

export function loadProfileChannel(channelID: number) {
    document.getElementById("main-content-mid")!.innerHTML = ``;
    document.getElementById("main-content-top")!.innerHTML = ChannelTopBar();
    document.getElementById("main-content-bot")!.innerHTML = MessageBar();
    document.getElementById("typedinput")!.addEventListener("keydown", e => {
        if (e.key === 'Enter') {
            if ((<HTMLInputElement>document.getElementById("typedinput")).value !== "" && document.activeElement === document.getElementById("typedinput")) {
                const input = (<HTMLInputElement>document.getElementById("typedinput")).value;
                sendMessage(channelID, input);
                (<HTMLInputElement>document.getElementById("typedinput")).value = '';
            }
        }
    })
    loadMessages(channelID);
}