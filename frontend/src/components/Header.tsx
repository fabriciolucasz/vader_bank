import Link from "next/link";
import Image from "next/image";
import HeaderUser from "@/components/HeaderUser";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <>
            <header className="bg-gray-800 text-white p-2">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/logo.svg"
                                alt="Malvader Bank Logo"
                                width={50}
                                height={50}
                            />
                        </Link>
                    </div>
                    {pathname !== "/auth/login" && <HeaderUser />}
                </div>
            </header>
        </>
    );
}