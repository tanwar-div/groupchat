package com.example.dto;

import com.example.entity.Channel;
import com.example.entity.Invite;
import com.example.entity.User;

import java.util.List;

public class ServerDTO {

    private Integer serverID;

    private String serverName;

    private List<Channel> channels;

    private List<User> users;

    private List<Invite> invites;

    public Integer getServerID() {
        return serverID;
    }

    public void setServerID(Integer serverID) {
        this.serverID = serverID;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public List<Channel> getChannels() {
        return channels;
    }

    public void setChannels(List<Channel> channels) {
        this.channels = channels;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<Invite> getInvites() {
        return invites;
    }

    public void setInvites(List<Invite> invites) {
        this.invites = invites;
    }
}
