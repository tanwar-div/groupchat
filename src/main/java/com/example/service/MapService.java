package com.example.service;

import com.example.dto.ChannelDTO;
import com.example.dto.MessageDTO;
import com.example.dto.ServerDTO;
import com.example.dto.UserDTO;
import com.example.entity.Channel;
import com.example.entity.Message;
import com.example.entity.Server;
import com.example.entity.User;
import com.example.repository.ChannelRepository;
import com.example.repository.MessageRepository;
import com.example.repository.ServerRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;


@Service
public class MapService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServerRepository serverRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChannelRepository channelRepository;

    public UserDTO getUserByJwt(String JWT) throws Exception {
        if (userRepository.findUserByJWT(JWT).isPresent()) {
            return convertPersonIdentifierToDTO(userRepository.findUserByJWT(JWT).get());
        }
        throw new Exception("Could not find user with JWT: " + JWT);
    }

    public ServerDTO getServerByID(Integer id) throws Exception {
        if (serverRepository.findById(id).isPresent()) {
            return convertServerToDTO(serverRepository.findById(id).get());
        }
        throw new Exception("could not find server with id: " + id);
    }

    public List<MessageDTO> findMessageByChannelID(Integer channelID) throws Exception {
        if (messageRepository.findMessagesByChannel_ChannelID(channelID).isPresent()) {
            return messageRepository.findMessagesByChannel_ChannelID(channelID).get().stream().map(this::convertMessageToDTO).collect(Collectors.toList());
        }
        throw new Exception("could not find channel with ID: " + channelID);
    }

    public MessageDTO getMessageByMessageID(Integer messageID) {
        if (messageRepository.findById(messageID).isPresent()) {
            return convertMessageToDTO(messageRepository.findById(messageID).get());
        }
        throw new NoSuchElementException("Could not find Message with ID " + messageID + " in database");
    }

    public ChannelDTO getChannelByID(Integer channelID) throws Exception {
        if(channelRepository.findById(channelID).isPresent()){
            return convertChannelToDTO(channelRepository.findById(channelID).get());
        }
        throw new Exception("Could not find Channel with ID " + channelID + " in database");
    }

    private UserDTO convertPersonIdentifierToDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setUserID(user.getUserID());
        userDTO.setUsername(user.getUsername());
        userDTO.setServerList(user.getServers());
        userDTO.setAcceptedFriends(user.getAcceptedFriends());
        userDTO.setPendingFriends(user.getPendingFriends());
        return userDTO;
    }

    private ServerDTO convertServerToDTO(Server server) {
        ServerDTO serverDTO = new ServerDTO();
        serverDTO.setServerID(server.getServerID());
        serverDTO.setServerName(server.getServerName());
        serverDTO.setUsers(server.getUsers());
        serverDTO.setChannels(server.getChannels());
        serverDTO.setInvites(server.getInvites());
        return serverDTO;
    }

    private MessageDTO convertMessageToDTO(Message message) {
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setMessage(message.getMessage());
        messageDTO.setChannelID(message.getChannel().getChannelID());
        messageDTO.setUsername(message.getUsername());
        messageDTO.setMessageID(message.getMessageID());
        messageDTO.setPostTime(message.getPostTime());
        return messageDTO;
    }

    private ChannelDTO convertChannelToDTO(Channel channel){
        ChannelDTO channelDTO = new ChannelDTO();
        channelDTO.setChannelName(channel.getChannelName());
        channelDTO.setMessages(channel.getMessages());
        channelDTO.setChannelID(channel.getChannelID());
        channelDTO.setServerID(channel.getServer().getServerID());
        return channelDTO;
    }
}
