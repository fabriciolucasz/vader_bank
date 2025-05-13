package com.malvader.vader_bank.service;

public class LoginDTO {
    private String cpf;
    private String senha;
    private String otp;

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
