package com.malvader.vader_bank.controller;

import com.malvader.vader_bank.service.LoginDTO;
import com.malvader.vader_bank.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO login) {
        try {
            return usuarioService.autenticar(login);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }

    @PostMapping("/otp")
    public ResponseEntity<?> gerarOtp(@RequestParam String cpf) {
        try {
            return usuarioService.gerarOtp(cpf);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<?> validarOtp(@RequestBody LoginDTO login) {
        try {
            return usuarioService.validarOtp(login);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }
}