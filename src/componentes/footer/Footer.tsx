import { LinkedinLogoIcon, FacebookLogoIcon, InstagramLogoIcon } from "@phosphor-icons/react"
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, type ReactNode } from "react";

function Footer() {

    const data = new Date().getFullYear();
    const { usuario } = useContext(AuthContext)
    
    let component: ReactNode

    if (usuario.token !== "") {
        component = (
            <div className="flex justify-center bg-purple-900 text-white">
                <div className="container flex flex-col items-center py-4">
                    <p className='text-xl font-bold'>
                        Farmácia Wadssa | Wadssa Wacemberg | Copyright: {data}
                    </p>
                    <p className='text-lg'>Acesse nossas redes sociais</p>
                    <div className='flex gap-2'>
                        <a href="https://www.linkedin.com/in/seu_usuario" target="_blank" rel="noopener noreferrer">
                            <LinkedinLogoIcon size={48} weight='bold' />
                        </a>

                        <a href="https://www.instagram.com/seu_usuario" target="_blank" rel="noopener noreferrer">
                            <InstagramLogoIcon size={48} weight='bold' />
                        </a>

                        <a href="https://www.facebook.com/seu_usuario" target="_blank" rel="noopener noreferrer">
                            <FacebookLogoIcon size={48} weight='bold' />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {component}
        </>
    )
}

export default Footer;