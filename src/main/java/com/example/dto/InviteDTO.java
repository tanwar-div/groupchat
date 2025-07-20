package com.example.dto;

import com.example.entity.Server;

public class InviteDTO {
    private Long inviteID;
    private String inviteCode;
    private String inviter;
    private Server server;

    public Long getInviteID() {
        return inviteID;
    }

    public void setInviteID(Long inviteID) {
        this.inviteID = inviteID;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public String getInviter() {
        return inviter;
    }

    public void setInviter(String inviter) {
        this.inviter = inviter;
    }

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }
}
