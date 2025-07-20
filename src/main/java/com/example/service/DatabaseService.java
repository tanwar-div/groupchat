package com.example.service;

import com.example.entity.*;
import com.example.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DatabaseService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ServerRepository serverRepository;
    @Autowired
    private InviteRepository inviteRepository;
    @Autowired
    private ChannelRepository channelRepository;

    public boolean isValidUser(String userName, String password) {
        return userRepository.existsByUsernameAndPassword(userName, password);
    }

    public boolean isValidUser(User user) {
        return isValidUser(user.getUsername(), user.getPassword());
    }

    public boolean doesUserExist(String username) {
        return userRepository.existsByUsername(username);
    }


    public void saveUser(User user) {
        userRepository.save(user);
    }

    public User getUser(String userName) {
        return userRepository.getUserByUsername(userName);
    }

    public User getUserByJWT(String JWT) throws Exception {
        if (userRepository.findUserByJWT(JWT).isPresent()) {
            return userRepository.findUserByJWT(JWT).get();
        }
        throw new Exception("could not find user with JWT: " + JWT);
    }

    public void addJWTForUser(User user, String JWT) {
        User oldPI = userRepository.getUserByUsername(user.getUsername());
        oldPI.setJWT(JWT);
        userRepository.save(oldPI);
    }

    public List<Message> getMessagesByChannelID(int channelID) throws Exception {
        if (messageRepository.findMessagesByChannel_ChannelID(channelID).isPresent()) {
            return messageRepository.findMessagesByChannel_ChannelID(channelID).get();
        }
        throw new Exception("Could not find channel with ID: " + channelID);
    }

    public boolean containsJWT(String JWT) {
        return userRepository.existsByJWT(JWT);
    }

    public boolean isValidJWT(String JWT) {
        return containsJWT(JWT);
    }

    public void saveServer(Server server) {
        serverRepository.save(server);
    }

    public void deleteServer(Integer serverID) {
        serverRepository.deleteById(serverID);
    }

    public void deleteServer(Server server) {
        deleteServer(server.getServerID());
    }

    public Optional<Server> findServerByServerID(Integer serverID) {
        return serverRepository.findById(serverID);
    }

    public Optional<Server> getServerByInviteCode(String inviteCode) {
        return serverRepository.findServerByInvites_InviteCode(inviteCode);
    }

    public void addServerToUser(Integer serverID, String userName) throws Exception {
        Server server = findServerByServerID(serverID).get();
        User user = getUser(userName);
        if (user.getServers().contains(server)) {
            throw new Exception(userName + " is already a member of " + server.getServerName());
        }
        user.addServer(server);
        userRepository.save(user);
    }

    public void addMessage(Message message) {
        messageRepository.save(message);
    }

    public Invite getInviteByInviteCode(String inviteCode) throws Exception {
        if (inviteRepository.findInviteByInviteCode(inviteCode).isPresent()) {
            return inviteRepository.findInviteByInviteCode(inviteCode).get();
        }
        throw new Exception("Could not find invite with the invite code: " + inviteCode);
    }

    public Channel getChannelByChannelID(Integer channelID) throws Exception {
        if (channelRepository.findById(channelID).isPresent()) {
            return channelRepository.findById(channelID).get();
        }
        throw new Exception("could not find channel by channelID: " + channelID);
    }

    public Server createServer(Server server) {
        if (server.getChannels().isEmpty()) {
            ArrayList<Channel> tempChannels = new ArrayList<>();
            Channel tempChannel = new Channel();
            tempChannel.setServer(server);
            tempChannels.add(tempChannel);
            server.setChannels(tempChannels);
            serverRepository.save(server);
            return server;
        }
        serverRepository.save(server);
        return server;
    }

    public void generateInvite(Integer serverID, String inviter) throws Exception {
        if (findServerByServerID(serverID).isPresent()) {
            Server server = findServerByServerID(serverID).get();
            Invite invite = new Invite(inviter);
            invite.setServer(server);
            ArrayList<Invite> invites = new ArrayList<>();
            invites.add(invite);
            server.setInvites(invites);
            serverRepository.save(server);
            return;
        }
        throw new Exception("Server with ID (" + serverID + ") not found");
    }

    public void createChannel(Integer serverID, String channelName) throws Exception {
        if (serverRepository.findById(serverID).isPresent()) {
            Server tempServer = serverRepository.findById(serverID).get();
            Channel tempChannel = new Channel();
            tempChannel.setChannelName(channelName);
            tempChannel.setServer(tempServer);
            channelRepository.save(tempChannel);
            return;
        }
        throw new Exception("Server with ID (" + serverID + ") not found");
    }

    public List<Channel> getUsersChannelsByJWT(String jwt) {
        if (channelRepository.findChannelsByJWT(jwt).isPresent()) {
            return channelRepository.findChannelsByJWT(jwt).get();
        }
        return new ArrayList<>();
    }

    public Channel getDirectMessageChannelByUsers(String userOne, String userTwo) {
        if (channelRepository.findDirectMessageChannelByUsers(userOne, userTwo).isPresent()) {
            return channelRepository.findDirectMessageChannelByUsers(userOne, userTwo).get();
        }
        User userOneObject = userRepository.getUserByUsername(userOne);
        User userTwoObject = userRepository.getUserByUsername(userTwo);
        Server atMeServer = new Server();
        Channel channel = new Channel();
        channel.setServer(atMeServer);
        atMeServer.setServerName("@me");
        atMeServer.addUserToServer(userOneObject);
        atMeServer.addUserToServer(userTwoObject);
        atMeServer.getChannels().add(channel);
        userOneObject.addServer(atMeServer);
        userTwoObject.addServer(atMeServer);
        serverRepository.save(atMeServer);
        return getDirectMessageChannelByUsers(userOne, userTwo);
    }
}
