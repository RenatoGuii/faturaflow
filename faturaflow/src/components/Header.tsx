export const Header: React.FC = () => {
    return (
        <>
            <header>
                <div className="flex justify-between p-5">
                    <div className="w-36">
                        <img src="/imgs/logo-big.png" alt="logo-big"/>
                    </div>

                    <div className="flex items-center">
                        <div className="flex gap-5 pt-2">
                            <a 
                            className="hover:text-secondaryColor duration-300"
                            href="/login">
                                Entrar
                            </a>
                            <a 
                            className="hover:text-secondaryColor duration-300"
                            href="/register">
                                Registre-se
                            </a>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}