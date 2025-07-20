package com.example.controller;

import com.example.entity.User;
import com.example.service.DatabaseService;
import com.example.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/login")
public class LoginController {
    @Autowired
    private DatabaseService databaseService;
    @GetMapping()
    public String logInPage(Model model) {
        User user = new User();
        model.addAttribute("user",user);
        return "loginpage";
    }

    @PostMapping()
    public ResponseEntity<?> logInUsrPass(@ModelAttribute("User") User user) {
        System.out.println(user.getUsername());
        System.out.println(user.getPassword());
        if(databaseService.isValidUser(user)) {
            JWTService jwtService = new JWTService();
            String JWT = jwtService.createJWT(user);
            databaseService.addJWTForUser(user,JWT);
            //if correct then we need to return the profile chat page
            return ResponseEntity.ok(JWT);
        }
        //if incorrect need to return back to login page with error messages displayed
        return ResponseEntity.badRequest().build();
    }
}
