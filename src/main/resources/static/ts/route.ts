import {loadProfilePage} from "./profilepage.js";
import {loadProfileChannel, loadServerChannel, loadServerPage} from "./serverpage.js";
import {getCurrentChannelID, getCurrentServerID, getServerInformationByID} from "./util.js";

let lastServerID: string | null = null;


/**
 * This will update the page accordingly to the current href in the browsers' path. Ideally it is not to be used directly
 * but instead to be used within another function
 * @returns {Promise<void>}
 */
const router = async (): Promise<void> => {
    const re = /\/\d+|\/@me/g
    const href = window.location.pathname.match(re);
    console.log("href: " + href);
    if (href === null) {
        return;
    }
    console.log(href)
    if (href.length === 1) {
        if (href[0].substring(1) === "@me") {
            loadProfilePage();
        } else {
            const serverID = getCurrentServerID();
            const serverInfo = await getServerInformationByID(serverID)
            loadServerPage(serverInfo);
            loadServerChannel(serverInfo.channels[0].channelID);
        }
    } else if (href.length > 1) {
        const serverID = getCurrentServerID();
        const channelID = await getCurrentChannelID()!;
        if (serverID === "@me") {
            if ('' + lastServerID === serverID) {
                loadProfileChannel(channelID);
            } else {
                loadProfilePage();
                loadProfileChannel(channelID);
            }
        } else {
            if ('' + lastServerID === serverID) {
                loadServerChannel(channelID);
            } else {
                const serverInfo = await getServerInformationByID(serverID)
                loadServerPage(serverInfo);
                loadServerChannel(channelID);
            }
        }
    }
    lastServerID = href[0].substring(1);
}

/**
 * used to navigate to another page. will push the state of the page to the history api for forward and backward traversal
 * @param href {String} the page to navigate to
 */
export function navigateTo(href: string) {
    history.pushState(null, null!, `http://localhost:8080/server/${href}`);
    router();
}

document.addEventListener("click", e => {
    if ((<Element>e.target)!.matches("[data-link]")) {
        e.preventDefault();
        navigateTo((<Element>e.target).id);
    }
})

window.addEventListener("popstate", () => {
    router();
})

router();