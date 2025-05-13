import Link from "next/link";
import { Button, Menu, MenuButton, MenuList, MenuItem, MenuGroup, MenuDivider } from "@chakra-ui/react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";

export default function HeaderUser() {
    const nomeCompleto = Cookies.get("nome") || "";
    const nome = nomeCompleto.split(" ")[0];
    const temNome = !!nomeCompleto;

    return (
        <div className="flex items-center">
            {temNome ? (
                <Menu>
                    <MenuButton
                        as={Button}
                        bg="white"
                        color="black"
                        _hover={{ bg: "gray.100" }}
                        rounded="full"
                        variant="outline"
                    >
                        <span className="font-normal">Bem vindo, <strong>{nome}</strong></span>
                    </MenuButton>
                    <MenuList bg="white" color="black" borderColor="gray.200">
                        <MenuGroup title="Configurações" fontSize="sm">
                            <MenuItem icon={<FaUser />} _hover={{ bg: "gray.100" }} fontSize="sm">
                                Meu perfil
                            </MenuItem>
                        </MenuGroup>
                        <MenuDivider />
                        <MenuGroup title="Util" fontSize="sm">
                            <MenuItem
                                icon={<FaSignOutAlt />}
                                _hover={{ bg: "gray.100" }}
                                fontSize="sm"
                                onClick={() => {
                                    Cookies.remove("nome");
                                    window.location.reload();
                                }}
                            >
                                Sair
                            </MenuItem>
                        </MenuGroup>
                    </MenuList>
                </Menu>
            ) : (
                <div>
                    <Link href="/auth/login">
                        <Button
                            bg="white"
                            color="black"
                            _hover={{ bg: "gray.100" }}
                            rounded="full"
                            variant="outline"
                        >
                            <span className="font-normal">Quero ser <strong>MAL</strong></span>
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}