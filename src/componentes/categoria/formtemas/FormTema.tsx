import { type ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../service/Service";
import { ClipLoader } from "react-spinners";

function FormTema() {
    const navigate = useNavigate();
    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '' } as Tema);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;
    const { id } = useParams<{ id: string }>();

    async function buscarPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
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
    }, [buscarPorId, id]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setTema({
            ...tema,
            [e.target.name]: e.target.value
        });
    }

    function retornar() {
        navigate("/temas");
    }

    async function gerarNovoTema(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        if (id !== undefined) {
            // Rota de Atualização
            try {
                await atualizar(`/temas`, tema, setTema, {
                    headers: { 'Authorization': token }
                });
                alert('Tema atualizado com sucesso!');
                retornar();
            } catch (error: unknown) {
                if (error instanceof Error && error.toString().includes('401')) {
                    handleLogout();
                } else {
                    alert('Erro ao atualizar o Tema');
                }
            }
        } else {
            // Rota de Cadastro
            try {
                await cadastrar(`/temas`, tema, setTema, {
                    headers: { 'Authorization': token }
                });
                alert('Tema cadastrado com sucesso!');
                retornar();
            } catch (error: unknown) {
                if (error instanceof Error && error.toString().includes('401')) {
                    handleLogout();
                } else {
                    alert('Erro ao cadastrar o Tema');
                }
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="container flex flex-col items-center justify-center mx-auto">
            <h1 className="text-4xl text-center my-8">
                {id === undefined ? 'Cadastrar Tema' : 'Editar Tema'}
            </h1>

            <form onSubmit={gerarNovoTema} className="w-1/2 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="descricao">Descrição do Tema</label>
                    <input
                        type="text"
                        placeholder="Descrição"
                        name='descricao'
                        className="border-2 border-slate-700 rounded p-2"
                        value={tema.descricao}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <button
                    className="rounded text-slate-100 bg-indigo-400 hover:bg-indigo-800 w-1/2 py-2 mx-auto block"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? <ClipLoader color="#fff" size={20} /> : 
                    <span>{id !== undefined ? 'Editar' : 'Cadastrar'}</span>}
                </button>
            </form>
        </div>
    );
}

export default FormTema;