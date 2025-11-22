package com.example.demo.controller;


import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins="http://localhost:5174") //React dev server

public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    //Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if(userService.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    //Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest){
        return userService.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    if(userService.checkPassword(user, loginRequest.getPassword())){
                        return ResponseEntity.ok("Login successful");
                    } else {
                        return ResponseEntity.badRequest().body("Invalid password");
                    }
                })
                .orElse(ResponseEntity.badRequest().body("User not found"));
    }
}
