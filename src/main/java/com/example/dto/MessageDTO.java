package com.example.dto;


import java.time.LocalDateTime;

public class MessageDTO {


    private Integer messageID;

    private String message;

    private String username;

    private Integer channelID;

    private LocalDateTime postTime;
    public MessageDTO() {

    }

    public MessageDTO(String message, String username) {
        this.message = message;
        this.username = username;
    }

    public Integer getMessageID() {
        return messageID;
    }

    public void setMessageID(Integer messageID) {
        this.messageID = messageID;
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

    public Integer getChannelID() {
        return channelID;
    }

    public void setChannelID(Integer channelID) {
        this.channelID = channelID;
    }

    public LocalDateTime getPostTime() {
        return postTime;
    }

    public void setPostTime(LocalDateTime postTime) {
        this.postTime = postTime;
    }

    @Override
    public String toString() {
        return "MessageDTO{" +
                "id=" + messageID +
                ", message='" + message + '\'' +
                ", username='" + username + '\'' +
                ", serverID=" + channelID +
                ", postTime=" + postTime +
                '}';
    }
}
