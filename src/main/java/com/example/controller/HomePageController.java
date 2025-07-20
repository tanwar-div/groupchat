package com.example.controller;

import com.example.service.DatabaseService;
import com.example.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomePageController {
    @Autowired
    private DatabaseService databaseService;
    @Autowired
    private JWTService jwtService;

    @GetMapping("/")
    public String homePage() {
        return "index";
    }




}
