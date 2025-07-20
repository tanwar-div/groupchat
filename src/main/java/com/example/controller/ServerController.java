package com.example.controller;

import com.example.dto.ChannelDTO;
import com.example.dto.MessageDTO;
import com.example.dto.ServerDTO;
import com.example.entity.Channel;
import com.example.entity.Message;
import com.example.entity.Server;
import com.example.entity.User;
import com.example.service.DatabaseService;
import com.example.service.JWTService;
import com.example.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RequestMapping("/server")
@Controller
public class ServerController {

    @Autowired
    private DatabaseService databaseService;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private MapService mapService;

    @PostMapping("/createserver")
    public ResponseEntity<?> createServer(@RequestBody Server server) throws Exception {
        if (server.getServerName().length() <= 2) {
            return ResponseEntity.badRequest().body("Server name length must be greater than 2");
        } else if (server.getServerName() == null) {
            return ResponseEntity.badRequest().body("The server must have a name");
        }
        databaseService.createServer(server);
        ServerDTO serverDTO = mapService.getServerByID(server.getServerID());
        return ResponseEntity.ok(serverDTO);
    }

    @PostMapping("/addServerToUser")
    public ResponseEntity<?> addServerToUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization, @RequestBody Integer serverID) {
        if (!databaseService.containsJWT(authorization)) {
            return new ResponseEntity<>("Invalid credentials", HttpStatus.FORBIDDEN);
        }
        Map<String, Object> JWT = jwtService.decodeJWT(authorization);
        User user = databaseService.getUser((String) JWT.get("sub"));
        try {
            databaseService.addServerToUser(serverID, user.getUsername());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FOUND).body(e.getMessage());
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/deleteserver")
    public ResponseEntity<String> deleteServer(@RequestBody Integer serverID) {
        databaseService.deleteServer(serverID);
        return ResponseEntity.ok("server " + serverID + " deleted successfully");
    }

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @GetMapping("/{channelID}/messages")
    @ResponseBody
    public List<MessageDTO> getMessages(@PathVariable(value = "channelID") Integer channelID) throws Exception {
        return mapService.findMessageByChannelID(channelID);
    }

    @GetMapping("/{serverID}/getServerInfo")
    @ResponseBody
    public ServerDTO getServerInfoByID(@PathVariable(value = "serverID") Integer serverID) throws Exception {
        return mapService.getServerByID(serverID);
    }

    @PostMapping(value = "/{channelID}/postmessages", consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> addMessageToDatabase(@RequestBody Message input, @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization, @PathVariable(value = "channelID") Integer channelID) throws Exception {
        JWTService jwtService = new JWTService();
        if (databaseService.containsJWT(authorization)) {
            String username = (String) jwtService.decodeJWT(authorization).get("sub");
            input.setUsername(username);
            input.setPostTime(LocalDateTime.now());
            input.setChannel(databaseService.getChannelByChannelID(channelID));
            databaseService.addMessage(input);
            MessageDTO messageDTO = mapService.getMessageByMessageID(input.getMessageID());
            simpMessagingTemplate.convertAndSend("/topic/" + channelID, messageDTO);
            return ResponseEntity.ok(messageDTO);
        }
        return new ResponseEntity<>("Invalid auth token", HttpStatus.FORBIDDEN);
    }

    @PostMapping("/{serverID}/createchannel")
    public ResponseEntity<String> createChannel(@RequestBody String channelName, @PathVariable(value = "serverID") Integer serverID) {
        if (channelName.isEmpty()) {
            return ResponseEntity.badRequest().body("channel name cannot be blank");
        }
        try {
            databaseService.createChannel(serverID, channelName);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok(channelName + " was created successfully");
    }

    @GetMapping("/directmessage/{username}")
    @ResponseBody
    public ResponseEntity<?> getDirectMessageChannelID(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization, @PathVariable(value = "username") String userTwo) {
        String userOne = jwtService.getUsernameFromJWT(authorization);
        try {
            return ResponseEntity.ok(mapService.getChannelByID(databaseService.getDirectMessageChannelByUsers(userOne,userTwo).getChannelID()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not find/create channel with userOne: " + userOne + " and userTwo: " + userTwo + " in it");
        }
    }

    @GetMapping("/{serverPath:\\d+|@me}/{channelPath:\\d+}")
    public String appPathOne() {
        return "applicationpage";
    }

    @GetMapping("/{profilePath:@me|\\d+}")
    public String appPathTwo() {
        return "applicationpage";
    }

}


