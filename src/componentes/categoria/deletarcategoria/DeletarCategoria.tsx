import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type Categoria from "../../../models/Categoria";
import { buscar, deletar } from "../../../service/Service";
import { ClipLoader } from "react-spinners";

function DeletarCategoria() {
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;
    const { id } = useParams<{ id: string }>();

    async function buscarPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setCategoria, {
                headers: { Authorization: token }
            });
        } catch (error: unknown) {
            if (error instanceof Error && error.toString().includes('401')) {
                handleLogout();
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado');
            navigate('/login');
        }
    }, [navigate, token]);

    useEffect(() => {
        if (id !== undefined) {
            buscarPorId(id);
        }
    }, [id]);

    function retornar() {
        navigate("/categorias");
    }

    async function deletarCategoria() {
        setIsLoading(true);
        try {
            await deletar(`/categorias/${id}`, {
                headers: { Authorization: token }
            });
            alert('Categoria apagado com sucesso!');
        } catch (error: unknown) {
            if (error instanceof Error && error.toString().includes('401')) {
                handleLogout();
            } else {
                alert('Erro ao apagar o Categoria.');
            }
        }
        setIsLoading(false);
        retornar();
    }

    return (
        <div className="container w-1/3 mx-auto">
            <h1 className="text-4xl text-center my-4">Deletar Categoria</h1>
            <p className="text-center font-semibold mb-4">
                Você tem certeza de que deseja apagar o Categoria a seguir?
            </p>
            
            <div className="border flex flex-col rounded-2xl overflow-hidden justify-between shadow-xl">
                <header className="py-2 px-6 bg-purple-800 text-white font-bold text-2xl">
                    Tema
                </header>
                <div className="p-8 bg-slate-100">
                    <p className="text-slate-500 uppercase text-xs font-bold mb-2">Descrição:</p>
                    <p className="text-3xl text-slate-800">{categoria.descricao}</p>
                </div>
                
                <div className="flex">
                    <button
                        className="text-white bg-red-500 hover:bg-red-700 w-full py-3 font-bold transition-all"
                        onClick={retornar}
                    >
                        Não
                    </button>
                    <button
                        className="w-full text-white bg-purple-500 hover:bg-purple-900 flex items-center justify-center font-bold transition-all border-l border-purple-700"
                        onClick={deletarCategoria}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ClipLoader color="#ffffff" size={24} />
                        ) : (
                            <span>Sim</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeletarCategoria;