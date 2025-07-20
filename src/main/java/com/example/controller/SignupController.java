package com.example.controller;

import com.example.entity.User;
import com.example.service.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/signup")
public class SignupController {


    @Autowired
    private DatabaseService databaseService;

    @GetMapping
    public String returnSignUpPage(Model model) {
        User user = new User();
        model.addAttribute("user", user);
        return "signuppage";
    }

    @PostMapping
    public String saveUserInDatabase(@ModelAttribute("User") User user) {
        if(databaseService.doesUserExist(user.getUsername())){
            return "redirect:/signup";
        }
        databaseService.saveUser(user);
        return "redirect:/";
    }
}
