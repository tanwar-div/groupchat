package com.example.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer messageID;

    private String message;

    private String username;

    @ManyToOne
    private Channel channel;

    @JsonFormat(pattern = "yyyy-mm-dd HH:mm:ss")
    private LocalDateTime postTime;

    public Message() {

    }

    public Message(String message, String username) {
        this.message = message;
        this.username = username;
    }

    public LocalDateTime getPostTime() {
        return postTime;
    }

    public void setPostTime(LocalDateTime postTime) {
        this.postTime = postTime;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getMessageID() {
        return messageID;
    }

    public void setMessageID(Integer id) {
        this.messageID = id;
    }

    public Channel getChannel() {
        return channel;
    }

    public void setChannel(Channel server) {
        this.channel = server;
    }


    @Override
    public String toString() {
        return "Message{" +
                "id=" + messageID +
                ", message='" + message + '\'' +
                ", username='" + username + '\'' +
                ", server=" + channel +
                ", postTime=" + postTime +
                '}';
    }
}
