package com.example.controller;

import com.example.dto.ServerDTO;
import com.example.entity.Invite;
import com.example.entity.Server;
import com.example.service.DatabaseService;
import com.example.service.JWTService;
import com.example.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
@Controller
@RequestMapping("/invite")
public class InviteController {

    @Autowired
    private DatabaseService databaseService;
    @Autowired
    private MapService mapService;
    @GetMapping("/getInviteLink/{serverID}")
    public ResponseEntity<?> createInviteLink(@RequestHeader(HttpHeaders.AUTHORIZATION) String jwt, @PathVariable(value = "serverID") Integer serverID) throws Exception {
        if(databaseService.findServerByServerID(serverID).isPresent()) {
            JWTService jwtService = new JWTService();
            String inviter = jwtService.getUsernameFromJWT(jwt);
            databaseService.generateInvite(serverID,inviter);
            ServerDTO serverDTO = mapService.getServerByID(serverID);
            return new ResponseEntity<>(serverDTO, HttpStatus.OK);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{inviteCode}")
    public String acceptInvitePage(Model model, @PathVariable(value = "inviteCode") String inviteCode) throws Exception {
        Invite invite = databaseService.getInviteByInviteCode(inviteCode);
        Server server = invite.getServer();
        String inviter = invite.getInviter();
        model.addAttribute("username", inviter);
        model.addAttribute("servername", server.getServerName());
        model.addAttribute("serverid", server.getServerID().toString());
        return "invite";
    }
}
