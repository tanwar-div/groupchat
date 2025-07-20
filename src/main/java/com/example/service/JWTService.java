package com.example.service;

import com.example.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.GsonJsonParser;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JWTService {

    @Autowired
    private DatabaseService databaseService;

    @Value("${jwt.secret}")
    private String secret = "password";
    String id = UUID.randomUUID().toString().replace("-","");

    public String createJWT(User user){
        Date currentDate = new Date();
        return Jwts.builder()
                .setId(id)
                .setHeaderParam("typ","JWT")
                .claim("scope","user")
                .setSubject(user.getUsername())
                .setIssuedAt(currentDate)
                .setExpiration(new Date(currentDate.getTime() + 60 * 10 * 1000))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public Map<String,Object> decodeJWT(String JWT){
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String[] chunks = JWT.split("\\.");
        String header = new String(decoder.decode(chunks[0]));
        String payload = new String(decoder.decode(chunks[1]));
        GsonJsonParser gsonJsonParser = new GsonJsonParser();
        return gsonJsonParser.parseMap(payload);
    }
    public boolean isValidJWT(String JWT){
        return databaseService.containsJWT(JWT);
    }

    public String getUsernameFromJWT(String JWT){
        Map<String,Object> jwtJSON = decodeJWT(JWT);
        return jwtJSON.get("sub").toString();
    }

}
