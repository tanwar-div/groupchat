import {jwt} from "./util.js";

function addServerToUser(serverID: number | string) {
    fetch("http://localhost:8080/server/addServerToUser",{
        method: "POST",
        headers: {
            "authorization": <string>jwt(),
            "content-type": "application/json"
        },
        body: <string>serverID
    }).then((response)=>{
        console.log(response);
    })
}



document.getElementById("accept-invite")!.addEventListener("click", function () {
    const serverID = document.querySelector("button[serverid]")!.getAttribute("serverid")!;
    addServerToUser(serverID);
    window.location.href = `http://localhost:8080/server/${serverID}`;
})