package com.malvader.vader_bank;

import com.malvader.vader_bank.model.Usuario;
import com.malvader.vader_bank.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DatabaseInitializer {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.findByCpf("000.000.000-00").isEmpty()) {
                Usuario usuario = new Usuario();
                usuario.setNome("Leonardo DaVinci");
                usuario.setEmail("noreply@admin.com");
                usuario.setCpf("000.000.000-00");
                usuario.setSenhaHash("admin");
                usuario.setOtpAtivo("123");
                usuario.setOtpExpiracao(LocalDateTime.now().plusYears(10));
                usuarioRepository.save(usuario);
                System.out.println("Usuário padrão criado com sucesso!");
            } else {
                System.out.println("Usuário padrão já existe.");
            }
        };
    }
}