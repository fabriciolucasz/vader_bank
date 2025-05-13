package com.malvader.vader_bank.service;

import com.malvader.vader_bank.model.Usuario;
import com.malvader.vader_bank.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.Map;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public ResponseEntity<?> autenticar(LoginDTO login) {
        try {
            System.out.println("Tentativa de login com CPF: " + login.getCpf());
            Optional<Usuario> optionalUsuario = usuarioRepository.findByCpf(login.getCpf());

            if (optionalUsuario.isEmpty()) {
                System.out.println("Usuário não encontrado");
                return ResponseEntity.status(401).body("Usuário não encontrado");
            }

            Usuario usuario = optionalUsuario.get();
            if (!usuario.getSenhaHash().equals(login.getSenha())) {
                System.out.println("Senha incorreta");
                return ResponseEntity.status(401).body("Senha incorreta");
            }

            System.out.println("Usuário autenticado com sucesso");
            return ResponseEntity.ok(Map.of(
                "message", "Usuário autenticado com sucesso",
                "nome", usuario.getNome()
            ));
        } catch (Exception e) {
            System.out.println("Erro interno: " + e.getMessage());
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }

    public ResponseEntity<?> gerarOtp(String cpf) {
        try {
            Optional<Usuario> optionalUsuario = usuarioRepository.findByCpf(cpf);

            if (optionalUsuario.isEmpty()) {
                return ResponseEntity.status(404).body("Usuário não encontrado");
            }

            Usuario usuario = optionalUsuario.get();
            String otp = String.format("%06d", new Random().nextInt(999999)); // Gera um OTP de 6 dígitos
            usuario.setOtpAtivo(otp);
            usuario.setOtpExpiracao(LocalDateTime.now().plusMinutes(10)); // Define validade de 10 minutos
            usuarioRepository.save(usuario); // Atualiza o usuário no banco de dados

            System.out.println("OTP gerado: " + otp);
            return ResponseEntity.ok(Map.of(
                "message", "OTP gerado com sucesso",
                "otp", otp // Retorna o OTP gerado no corpo da resposta
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }

    public ResponseEntity<?> validarOtp(LoginDTO login) {
        try {
            Optional<Usuario> optionalUsuario = usuarioRepository.findByCpf(login.getCpf());

            if (optionalUsuario.isEmpty()) {
                return ResponseEntity.status(404).body("Usuário não encontrado");
            }

            Usuario usuario = optionalUsuario.get();
            if (usuario.getOtpAtivo() == null || usuario.getOtpExpiracao().isBefore(LocalDateTime.now())) {
                System.out.println("OTP expirado ou inválido");
                return ResponseEntity.status(401).body("OTP expirado ou inválido");
            }

            if (!usuario.getOtpAtivo().equals(login.getOtp())) {
                System.out.println("OTP incorreto");
                return ResponseEntity.status(401).body("OTP incorreto");
            }

            System.out.println("Login autorizado");
            return ResponseEntity.ok(Map.of(
                "message", "Login autorizado",
                "nome", usuario.getNome()
            ));
        } catch (Exception e) {
            System.out.println("Erro interno: " + e.getMessage());
            return ResponseEntity.status(500).body("Erro interno no servidor: " + e.getMessage());
        }
    }
}