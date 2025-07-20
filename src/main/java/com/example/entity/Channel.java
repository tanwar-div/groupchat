package com.example.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Channel {

    @Id
    @GeneratedValue
    private Integer channelID;

    private String channelName;

    @ManyToOne(cascade = CascadeType.ALL)
    private Server server;

    @OneToMany(mappedBy = "channel", fetch = FetchType.EAGER)
    private List<Message> messages;

    public Channel(){
        channelName = "general";
    }

    public Integer getChannelID() {
        return channelID;
    }

    public void setChannelID(Integer channelID) {
        this.channelID = channelID;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    @JsonIgnore
    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }

    @JsonIgnore
    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> message) {
        this.messages = message;
    }

    @Override
    public String toString() {
        return "Channel{" +
                "channelID=" + channelID +
                ", channelName='" + channelName + '\'' +
                ", server=" + server +
                ", messages=" + messages +
                '}';
    }
}
