package com.example.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Server {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer serverID;

    private String serverName;

    @OneToMany(mappedBy = "server",cascade = CascadeType.ALL)
    private List<Channel> channels;

    @ManyToMany(mappedBy = "servers")
    private List<User> users;

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL)
    private List<Invite> invites;

    public Server() {
        users = new ArrayList<>();
        channels = new ArrayList<>();
    }

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
    @JsonIgnore
    public List<Channel> getChannels() {
        return channels;
    }

    public void setChannels(List<Channel> channels) {
        this.channels = channels;
    }
    @JsonIgnore
    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
    @JsonIgnore
    public List<Invite> getInvites() {
        return invites;
    }

    public void setInvites(List<Invite> invites) {
        this.invites = invites;
    }

    public void addUserToServer(User u){
        getUsers().add(u);
    }
}
