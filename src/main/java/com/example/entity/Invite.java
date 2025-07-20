package com.example.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long inviteID;

    @Column(unique = true)
    private String inviteCode;

    private String inviter;

    @ManyToOne
    private Server server;

    public Invite(){

    }

    public Invite(String inviter) {
        this.inviteCode = generateInviteCode();
        this.inviter = inviter;
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

    public static String generateInviteCode() {
        return UUID.randomUUID().toString().replaceAll("_", "").replaceAll("-","").substring(0, 9);
    }
}
