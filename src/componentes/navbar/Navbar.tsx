import { type ReactNode, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../Utils/ToastAlerta";

function Navbar() {
    const navigate = useNavigate();
    const { usuario, handleLogout } = useContext(AuthContext);

    function logout() {
        handleLogout();
        ToastAlerta('O Usuário foi desconectado com sucesso!', 'info')
        navigate('/');
    }

    let component: ReactNode;


    //if (usuario.token !== "") {
        // eslint-disable-next-line prefer-const
        component = (
            <div className='w-full flex justify-center py-4 bg-purple-900 text-white'>
                <div className="container flex justify-between text-lg mx-8">
                    <Link to='/home' className="text-2xl font-bold">Farmácia Wadssa</Link>
                    
                    <p>Bem-vinda, {usuario.nome}</p>

                    <div className='flex gap-4'>
                        <Link to='/postagens' className='hover:underline'>Produtos</Link>
                        <Link to='/temas' className='hover:underline'>Categorias</Link>
                        <Link to='/cadastrartema' className='hover:underline'>Cadastrar Categorias</Link>
                        <Link to='/perfil' className='hover:underline'>Perfil</Link>
                        <button onClick={logout} className='hover:underline bg-transparent border-none cursor-pointer'>
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        );
   // }

    return (
        <>
            {component}
        </>
    );
}

export default Navbar;