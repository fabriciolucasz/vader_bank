'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    CloseButton,
    FormControl,
    FormLabel,
    Input,
    Button,
    FormErrorMessage,
    FormHelperText,
    VStack,
} from "@chakra-ui/react";
import Header from "@/components/Header";

export default function Login() {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpValidated, setIsOtpValidated] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [errors, setErrors] = useState({ cpf: false, senha: false, otp: false });
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();

    const formatCpf = (value: string) => {
        return value
            .replace(/\D/g, '')
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedCpf = formatCpf(e.target.value);
        setCpf(formattedCpf);
        setErrors((prev) => ({ ...prev, cpf: false }));
    };

    const handleLogin = async () => {
        const hasErrors = validateForm();
        if (hasErrors) return;

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { cpf, senha });

            if (response.status === 200) {
                setShowOtpField(true);
                setAlertMessage('Usuário autenticado com sucesso! Agora você pode gerar o OTP.');
            }
        } catch (error) {
            setAlertMessage('Erro ao autenticar usuário. Verifique suas credenciais.');
        }
    };

    const gerarOtp = async () => {
        if (!showOtpField) {
            setAlertMessage('Você precisa estar autenticado para gerar o OTP.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/api/auth/otp?cpf=${cpf}`);
            if (response.status === 200) {
                const { otp } = response.data;
                setAlertMessage(`OTP gerado com sucesso: ${otp}. O OTP é válido por 10 minutos.`);
            }
        } catch (error) {
            setAlertMessage('Erro ao gerar OTP. Tente novamente.');
        }
    };

    const enviarOtp = async () => {
        if (!otp) {
            setErrors((prev) => ({ ...prev, otp: true }));
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/validate-otp', { cpf, otp });
            const { nome } = response.data;

            if (response.status === 200) {
                setIsOtpValidated(true);
                Cookies.set("authenticated", "true", { expires: 1 });
                Cookies.set("nome", nome, { expires: 1 });
                Cookies.set("cpf", cpf, { expires: 1 });
                router.push('/');
            }
        } catch (error) {
            setAlertMessage('Erro ao validar OTP. Verifique o código e tente novamente.');
        }
    };

    const validateForm = () => {
        const newErrors = {
            cpf: !cpf,
            senha: !senha,
            otp: false,
        };
        setErrors(newErrors);
        return Object.values(newErrors).some((error) => error);
    };

    return (
        <div>
            <Header />
            <div className="container mx-auto p-4">
                {alertMessage && (
                    <Alert status="info" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                        <AlertIcon boxSize="40px" mr={0} />
                        <AlertTitle mt={4} mb={1} fontSize="lg">
                            Aviso
                        </AlertTitle>
                        <AlertDescription maxWidth="sm">
                            {alertMessage}
                        </AlertDescription>
                        <CloseButton position="absolute" right="8px" top="8px" onClick={() => setAlertMessage('')} />
                    </Alert>
                )}
                <VStack spacing={4} align="stretch">
                    <h1>Login Banco Malvader</h1>
                    <FormControl isInvalid={errors.cpf}>
                        <FormLabel>CPF</FormLabel>
                        <Input
                            placeholder="Digite seu CPF"
                            value={cpf}
                            onChange={handleCpfChange}
                        />
                        {!errors.cpf ? (
                            <FormHelperText>Digite seu CPF no formato 000.000.000-00.</FormHelperText>
                        ) : (
                            <FormErrorMessage>O CPF é obrigatório.</FormErrorMessage>
                        )}
                    </FormControl>

                    <FormControl isInvalid={errors.senha}>
                        <FormLabel>Senha</FormLabel>
                        <Input
                            type="password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(e) => {
                                setSenha(e.target.value);
                                setErrors((prev) => ({ ...prev, senha: false }));
                            }}
                        />
                        {!errors.senha ? (
                            <FormHelperText>Digite sua senha para acessar sua conta.</FormHelperText>
                        ) : (
                            <FormErrorMessage>A senha é obrigatória.</FormErrorMessage>
                        )}
                    </FormControl>

                    {showOtpField && (
                        <>
                            <FormControl isInvalid={errors.otp}>
                                <FormLabel>OTP</FormLabel>
                                <Input
                                    placeholder="Digite o OTP"
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value);
                                        setErrors((prev) => ({ ...prev, otp: false }));
                                    }}
                                />
                                {!errors.otp ? (
                                    <FormHelperText>Digite o código OTP enviado para você.</FormHelperText>
                                ) : (
                                    <FormErrorMessage>O OTP é obrigatório.</FormErrorMessage>
                                )}
                            </FormControl>
                            <Button colorScheme="blue" onClick={gerarOtp}>
                                Gerar OTP
                            </Button>
                            <Button colorScheme="green" onClick={enviarOtp}>
                                Enviar OTP
                            </Button>
                        </>
                    )}

                    {!showOtpField && (
                        <Button colorScheme="green" onClick={handleLogin}>
                            Enviar
                        </Button>
                    )}
                </VStack>
            </div>
        </div>
    );
}