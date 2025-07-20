package com.example.entity;


import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity

public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer userID;
    private String username;

    private String password;

    private String JWT;

    @JoinTable(name = "user_server",
            joinColumns = @JoinColumn(referencedColumnName = "userID"),
            inverseJoinColumns = @JoinColumn(referencedColumnName = "serverid")
    )
    @ManyToMany(cascade = CascadeType.PERSIST)
    private List<Server> servers;

    @ManyToMany(cascade = CascadeType.ALL)
    private List<User> acceptedFriends;

    @ManyToMany(cascade = CascadeType.PERSIST)
    private List<User> pendingFriends;

    public User() {
        servers = new ArrayList<>();
        acceptedFriends = new ArrayList<>();
        pendingFriends = new ArrayList<>();
    }

    public User(Integer userID, String username, String password) {
        this();
        this.userID = userID;
        this.username = username;
        this.password = password;
    }

    public Integer getUserID() {
        return userID;
    }

    public void setUserID(Integer id) {
        this.userID = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    @JsonIgnore
    public String getJWT() {
        return JWT;
    }

    public void setJWT(String JWT) {
        this.JWT = JWT;
    }

    @JsonIgnore
    public List<Server> getServers() {
        return servers;
    }

    public void setServers(List<Server> serverList) {
        this.servers = serverList;
    }

    @JsonIgnore
    public List<User> getAcceptedFriends() {
        return acceptedFriends;
    }

    public void setAcceptedFriends(List<User> acceptedFriends) {
        this.acceptedFriends = acceptedFriends;
    }
    @JsonIgnore
    public List<User> getPendingFriends() {
        return pendingFriends;
    }

    public void setPendingFriends(List<User> pendingFriends) {
        this.pendingFriends = pendingFriends;
    }

    public void addServer(Server server) {
        servers.add(server);
    }

    public void addAcceptedFriend(User user) {
        acceptedFriends.add(user);
    }

    public void addPendingFriend(User user) {
        pendingFriends.add(user);
    }

    public void removePendingFriend(User user) {
        pendingFriends.remove(user);
    }
}
