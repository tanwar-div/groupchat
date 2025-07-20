import {Circle, jwt, SearchBar, user} from "./util.js";
import {navigateTo} from "./route.js";
import {subscribeToChannel} from "./websocket.js";

/**
 * Contains HTML for the top of the profile sidebar
 * @returns {string} The HTML for top profile sidebar
 * @constructor
 */
function TopProfileSideBar(): string {
    return `
        <div class="search-bar-2 rounded px-1 mx-2">
            <input name="find-or-start-a-conversion" class="search" placeholder="Find or start a conversation">
        </div>
    `
}

/**
 * Contains HTML for the mid-section of the profile sidebar
 * @returns {string} the HTML
 * @constructor
 */
function MidProfileSideBar(): string {
    return `
        <button style="width: 224px; height: 44px" id="friendsButton" class="rounded">
            <svg class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                    <path fill="currentColor" fill-rule="nonzero"
                          d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z"
                          transform="translate(2 4)"></path>
                    <path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path>
                </g>
            </svg>
            <span>Friends</span>
        </button>
        <button style="width: 224px; height: 44px" id="nitroButton" class="rounded">
            <svg class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M2.98966977,9.35789159 C2.98966977,9.77582472 2.63442946,10.1240466 2.20807287,10.1240466 L1.78171628,10.1240466 C1.35535969,10.1240466 0.999948837,9.77582472 0.999948837,9.35789159 C0.999948837,8.93995846 1.35535969,8.59173658 1.78171628,8.59173658 L2.20807287,8.59173658 C2.63442946,8.59173658 2.98966977,8.93995846 2.98966977,9.35789159 Z M22.2467643,9.14892503 C24.0942527,12.9800344 22.3888264,17.5772989 18.3384388,19.3882867 C14.4302837,21.1297305 9.74036124,19.457998 7.9638186,15.6268886 C7.60857829,14.8607335 7.3954,14.0248673 7.32428372,13.189001 L5.76091938,13.189001 C5.33456279,13.189001 4.97932248,12.840612 4.97932248,12.4226788 C4.97932248,12.0047457 5.33456279,11.6565238 5.76091938,11.6565238 L8.03493488,11.6565238 C8.46129147,11.6565238 8.81653178,11.3083019 8.81653178,10.8903688 C8.81653178,10.4724357 8.46129147,10.1240466 8.03493488,10.1240466 L4.41090388,10.1240466 C3.98454729,10.1240466 3.62913643,9.77582472 3.62913643,9.35789159 C3.62913643,8.93995846 3.98454729,8.59173658 4.41090388,8.59173658 L9.45606667,8.59173658 C9.88242326,8.59173658 10.2376636,8.24334752 10.2376636,7.82541439 C10.2376636,7.40748126 9.88242326,7.05925937 9.45606667,7.05925937 L7.3954,7.05925937 C6.75586512,7.05925937 6.18727597,6.57161499 6.18727597,5.87517123 C6.18727597,5.24827153 6.68474884,4.69091591 7.3954,4.69091591 L15.4250589,4.69091591 C18.267493,4.8303384 20.9676946,6.43235968 22.2467643,9.14892503 Z M13.2662961,8.38056332 C11.0193969,9.3919615 10.0341721,11.9973566 11.065955,14.1998642 C12.097738,16.4023718 14.755645,17.3681317 17.0025442,16.3567335 C19.249614,15.3453354 20.2346682,12.7399402 19.2028853,10.5374326 C18.1711023,8.33492503 15.5131953,7.36916515 13.2662961,8.38056332 Z M16.8462589,9.84548582 L18.2673907,12.2138293 C18.338507,12.3530846 18.338507,12.4227958 18.2673907,12.5620512 L16.8462589,14.9303946 C16.7751426,15.0696499 16.6330806,15.0696499 16.5619643,15.0696499 L13.7906465,15.0696499 C13.6485845,15.0696499 13.5774682,14.9999387 13.5065225,14.9303946 L12.0852202,12.5620512 C12.0142744,12.4227958 12.0142744,12.3530846 12.0852202,12.2138293 L13.5065225,9.84548582 C13.5774682,9.7062305 13.7197008,9.7062305 13.7906465,9.7062305 L16.5619643,9.7062305 C16.7041969,9.63651925 16.7751426,9.7062305 16.8462589,9.84548582 Z"></path>
            </svg>
            <span>Nitro</span>
        </button>
        <button style="width: 224px; height: 44px" id="messageRequestsButton" class="rounded">
            <svg class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12.0002 10.823L20.9652 5.26C20.6772 5.1 20.3522 5 20.0002 5H4.00016C3.64816 5 3.32216 5.1 3.03516 5.26L12.0002 10.823Z"
                      fill="currentColor"></path>
                <path d="M12.527 12.8489C12.366 12.9489 12.183 12.9999 12 12.9999C11.817 12.9999 11.634 12.9489 11.473 12.8499L2.003 6.97292C2.003 6.98192 2 6.99092 2 6.99892V15.9989C2 17.1009 2.897 17.9989 4 17.9989H20C21.103 17.9989 22 17.1009 22 15.9989V6.99892C22 6.98992 21.997 6.98092 21.997 6.97192L12.527 12.8489Z"
                      fill="currentColor"></path>
            </svg>
            <span>Message Requests</span>
        </button>
        
        <div>
            <span style="font-size: 12px">DIRECT MESSAGES</span>
            <svg x="0" y="0" class="privateChannelRecipientsInviteButtonIcon-1ObKXK icon-2xnN2Y" aria-hidden="true"
                 role="img" width="16" height="16" viewBox="0 0 18 18">
                <polygon fill-rule="nonzero" fill="currentColor"
                         points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon>
            </svg>
        </div>
`
}

/**
 * Contains HTML for the top main content for the profile page
 * @returns {string} the HTML
 * @constructor
 */
function MainContentTopProfile(): string {
    return `
        <div class="container-fluid h-100 d-flex justify-content-between align-items-center">
                <div class="container-fluid d-flex align-items-center">
                    <svg x="0" y="0" class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                        <g fill="none" fill-rule="evenodd">
                            <path fill="currentColor" fill-rule="nonzero"
                                  d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z"
                                  transform="translate(2 4)"></path>
                            <path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path>
                        </g>
                    </svg>
                    <span class="mx-4">Friends</span>
                    <div class="divider-vertical"></div>
                    <button class="btn btn-secondary btn-sm mx-4">Online</button>
                    <button class="btn btn-secondary btn-sm" id="view-all-friends">All</button>
                    <button class="btn btn-secondary btn-sm mx-4" id="pending-friend">Pending</button>
                    <button class="btn btn-secondary btn-sm">Blocked</button>
                    <button class="btn btn-success btn-sm mx-4" id="add-friend">Add Friend</button>
                </div>
                <div class="container justify-content-end d-flex w-25">
                    <svg x="0" y="0" class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                              d="M20.998 0V3H23.998V5H20.998V8H18.998V5H15.998V3H18.998V0H20.998ZM2.99805 20V24L8.33205 20H14.998C16.102 20 16.998 19.103 16.998 18V9C16.998 7.896 16.102 7 14.998 7H1.99805C0.894047 7 -0.00195312 7.896 -0.00195312 9V18C-0.00195312 19.103 0.894047 20 1.99805 20H2.99805Z"></path>
                    </svg>
                    <span class="divider-vertical mx-3"></span>
                    <svg x="0" y="0" class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"
                         fill="none">
                        <path d="M19 3H4.99C3.88 3 3.01 3.89 3.01 5L3 19C3 20.1 3.88 21 4.99 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 15H15C15 16.66 13.65 18 12 18C10.35 18 9 16.66 9 15H4.99V5H19V15Z"
                              fill="currentColor"></path>
                    </svg>
                    <svg x="0" y="0" class="icon mx-3" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M12 2C6.486 2 2 6.487 2 12C2 17.515 6.486 22 12 22C17.514 22 22 17.515 22 12C22 6.487 17.514 2 12 2ZM12 18.25C11.31 18.25 10.75 17.691 10.75 17C10.75 16.31 11.31 15.75 12 15.75C12.69 15.75 13.25 16.31 13.25 17C13.25 17.691 12.69 18.25 12 18.25ZM13 13.875V15H11V12H12C13.104 12 14 11.103 14 10C14 8.896 13.104 8 12 8C10.896 8 10 8.896 10 10H8C8 7.795 9.795 6 12 6C14.205 6 16 7.795 16 10C16 11.861 14.723 13.429 13 13.875Z"></path>
                    </svg>
                </div>
        </div>
    `
}


function loadProfileMainContent(): void {
    loadProfileMainContentTop();
    const mainContentMid = document.getElementById("main-content-mid");
    const serverMembers = document.getElementById("server-members");
    const mainContentBot = document.getElementById("main-content-bot");
    if (mainContentMid && serverMembers && mainContentBot) {
        mainContentMid.innerHTML = "";
        serverMembers.style.display = "none";
        mainContentBot.innerHTML = "";
        return
    }
    throw Error("could not load profile main content");
}

/**
 * loads all the html and functionality to make the profile page work
 */
export function loadProfilePage() {
    loadProfileSideBar();
    loadProfileMainContent();
}

function loadProfileSideBar() {
    const contentSidebarTop = document.getElementById("content-sidebar-top");
    const contentSidebarMid = document.getElementById("content-sidebar-mid");
    if (contentSidebarTop && contentSidebarMid) {
        contentSidebarTop.innerHTML = TopProfileSideBar();
        contentSidebarMid.innerHTML = MidProfileSideBar();
        return
    }
    throw Error("could not load profile side bar")
}


/**
 * loads all the buttons (including buttons functionality) when you click on the friends sidebar when your in the profile page
 */
function loadProfileMainContentTop() {
    const mainContentTop = document.getElementById("main-content-top");
    if (mainContentTop) {
        mainContentTop.innerHTML = MainContentTopProfile();
    } else {
        throw Error("could not find document.getElementById(\"main-content-top\")")
    }

    /**
     * contains html for when you click on add friend button
     * @returns {string} the html
     * @constructor
     */
    function ProfileMainContentAddFriend(): string {
        return `
        <div class="container-fluid mt-3">
            <div class="fw-bold">ADD FRIEND</div>
            <div class="py-2" style="color: rgb(181, 186, 193); font-size: 14px">You can add friends with their Discord username</div>
            <div class="search-bar-2 rounded px-1 justify-content-between">
                <input id="sendFriendRequestUsername" class="search w-75" placeholder="You can add friends with their Discord username.">
                <button class="btn btn-primary btn-sm m-2" id="sendFriendRequest">Send Friend Request</button>
            </div>
        </div>
    `
    }

    document.getElementById("add-friend")!.onclick = function () {
        document.getElementById("main-content-mid")!.innerHTML = ProfileMainContentAddFriend();
        document.getElementById("sendFriendRequest")!.onclick = function () {
            let username = (<HTMLInputElement>document.getElementById("sendFriendRequestUsername"))!.value;
            fetch("http://localhost:8080/user/sendFriendRequest", {
                method: "PUT",
                headers: {
                    "Authorization": <string>jwt(),
                    "Content-Type": "application/json"
                },
                body: username
            }).then(async (response) => {
                if (response.ok) {
                    const successMessage = `<div class="text-success">${await response.text()}</div>`;
                    document.querySelector("div.justify-content-between.search-bar-2")!.insertAdjacentHTML("afterend", successMessage);
                } else {
                    const errorMessage = `<div class="text-danger">${await response.text()}</div>`;
                    document.querySelector("div.justify-content-between.search-bar-2")!.insertAdjacentHTML("afterend", errorMessage);
                }
            })
        }
    }


    /**
     * contains html for pending friend requests
     * @param username the username of the friend request
     * @returns {string} the html
     * @constructor
     */
    function ProfileMainContentPendingFriend(username: string): string {
        return `
        <div class="row align-items-center justify-content-between">
            <div class="col d-flex align-items-center">
                ${Circle("40px", "40px")}
                <div class="ps-5">
                    <div>${username}</div>
                    <div>Incoming friend request</div>
                </div>
            </div>
            <div class="col d-flex justify-content-end">
                <button class="accept-friend-request">
                    <img width="32" alt="Eo circle green checkmark" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/32px-Eo_circle_green_checkmark.svg.png">
                </button>
                <button class="decline-friend-request">
                        <img width="32" alt="Cross red circle" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/32px-Cross_red_circle.svg.png">
                </button>
            </div>
            <div class="divider mt-2 mb-2"></div>
        </div>
    `;
    }

    /**
     * The html for the container containing the pending friend requests
     * @param friendRequestsLength {number} the number of friends
     * @returns {string} the html
     * @constructor
     */
    function PendingFriendsContainer(friendRequestsLength: number): string {
        return `
            <div id="pendingfriendscontainer" class="container-fluid mt-3">
                <div class="row">
                    <div>PENDING - ${friendRequestsLength}</div>
                    <div class="divider mt-2 mb-2"></div>
                </div>
            </div>
        `;
    }

    /**
     * Adds all the pending friends html and accept friend / decline friend button functions
     * @returns {Promise<void>}
     */
    document.getElementById("pending-friend")!.onclick = async function (): Promise<void> {
        let friendRequests = user.pendingFriends;
        document.getElementById("main-content-mid")!.innerHTML = PendingFriendsContainer(friendRequests.length);
        for (const friendRequest of friendRequests) {
            document.getElementById("pendingfriendscontainer")!.innerHTML += ProfileMainContentPendingFriend(friendRequest.username);
            let acceptFriendRequestButton = <HTMLButtonElement>document.getElementsByClassName("accept-friend-request").item(document.getElementsByClassName("accept-friend-request").length - 1);
            acceptFriendRequestButton.onclick = async function () {
                await fetch("http://localhost:8080/user/acceptFriendRequest", {
                    method: "POST",
                    headers: {
                        "Authorization": <string>jwt()
                    },
                    body: friendRequest.username
                });
            }
            let declineFriendRequestButton = <HTMLButtonElement>document.getElementsByClassName("decline-friend-request").item(document.getElementsByClassName("decline-friend-request").length - 1)
            declineFriendRequestButton.onclick = async function () {
                await fetch("http://localhost:8080/user/declineFriendRequest", {
                    method: "POST",
                    headers: {
                        "Authorization": <string>jwt()
                    },
                    body: friendRequest.username
                });
            }
        }
    }

    /**
     * contains the html to create a bar than contains a profile picture, username and two buttons on the end
     * @param username the username
     * @returns the html
     */
    function ProfileMainContentAllFriend(username: string) {
        return `
            <div class="row align-items-center justify-content-between">
                <div class="col d-flex align-items-center">
                    ${Circle("40px", "40px")}
                    <div class="ps-5">
                        <div>${username}</div>
                        <div>Offline/Online</div>
                    </div>
                </div>
                <div class="col d-flex justify-content-end">
                    <button class="message-button">
                        <svg class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M4.79805 3C3.80445 3 2.99805 3.8055 2.99805 4.8V15.6C2.99805 16.5936 3.80445 17.4 4.79805 17.4H7.49805V21L11.098 17.4H19.198C20.1925 17.4 20.998 16.5936 20.998 15.6V4.8C20.998 3.8055 20.1925 3 19.198 3H4.79805Z"></path></svg>
                    </button>
                    <button class="more-button">
                        <svg class="icon" aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0z"></path><path fill="currentColor" d="M12 16c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2zm0-6c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2-2-.8954305-2-2 .8954305-2 2-2z"></path></g></svg>
                    </button>
                </div>
                <div class="divider mt-2 mb-2"></div>
            </div>
                `;
    }

    function AllFriendsContainer(friendsLength: number) {
        return `
            <div class="pt-3">
                ${SearchBar()}
            </div>
            <div id="allfriendscontainer" class="container-fluid mt-3">
                <div class="row">
                    <div class="py-2 fw-bold" style="color: rgb(181, 186, 193); font-size: 14px">ALL FRIENDS - ${friendsLength}</div>
                    <div class="divider mt-2 mb-2"></div>
                </div>
            </div>
        `;
    }

    document.getElementById("view-all-friends")!.onclick = function () {
        let mainContentPage = document.getElementById("main-content-mid");
        const acceptedFriends = user.acceptedFriends;
        mainContentPage!.innerHTML = ProfileMainContentAllFriend(acceptedFriends);
        mainContentPage!.innerHTML = AllFriendsContainer(acceptedFriends.length);
        const allFriendsContainer = document.getElementById("allfriendscontainer")!;
        for (const acceptedFriend of acceptedFriends) {
            allFriendsContainer.insertAdjacentHTML("beforeend", ProfileMainContentAllFriend(acceptedFriend.username));
            (<HTMLButtonElement>allFriendsContainer.getElementsByClassName("message-button").item(allFriendsContainer.getElementsByClassName("message-button").length - 1))!.onclick = function () {
                fetch(`http://localhost:8080/server/directmessage/${acceptedFriend.username}`, {
                    method: "GET",
                    headers: {
                        "authorization": <string>jwt()
                    }
                })
                    .then(response => response.json())
                    .then(channel => {
                        subscribeToChannel(channel.channelID);
                        navigateTo(`@me/${channel.channelID}`)
                    });
            }
            const moreButton = <HTMLButtonElement>(allFriendsContainer.getElementsByClassName("more-button").item(allFriendsContainer.getElementsByClassName("more-button").length - 1))
            moreButton!.onclick = function () {
                return;
            }
        }
    }


}