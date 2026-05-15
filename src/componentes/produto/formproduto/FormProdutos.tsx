import { type ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import  type Tema from "../../../models/Tema";
import type Postagem from "../../../models/Postagem";
import { buscar, atualizar, cadastrar } from "../../../service/Service";

function FormPostagem() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [temas, setTemas] = useState<Tema[]>([]);
    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '' });
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem);

    async function buscarPostagemPorId(id: string) {
        await buscar(`/postagens/${id}`, setPostagem, {
            headers: { Authorization: token }
        });
    }

    async function buscarTemaPorId(id: string) {
        await buscar(`/temas/${id}`, setTema, {
            headers: { Authorization: token }
        });
    }

    async function buscarTemas() {
        await buscar('/temas', setTemas, {
            headers: { Authorization: token }
        });
    }

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado');
            navigate('/');
        }
    }, [token]);

    useEffect(() => {
        buscarTemas();
        if (id !== undefined) {
            buscarPostagemPorId(id);
        }
    }, [id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPostagem({
            ...postagem,
            tema: tema,
        });
    }, [tema]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            tema: tema,
            usuario: usuario,
        });
    }

    function retornar() {
        navigate('/postagens');
    }

    async function gerarNovaPostagem(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        if (id !== undefined) {
            try {
                await atualizar(`/postagens`, postagem, setPostagem, {
                    headers: { Authorization: token },
                });
                alert('Postagem atualizada com sucesso');
                retornar();
            } catch (err) {
                const errorMessage = String(err);
                if (errorMessage.includes('401')) {
                    handleLogout();
                } else {
                    alert('Erro ao atualizar a Postagem');
                }
            }
        } else {
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, {
                    headers: { Authorization: token },
                });
                alert('Postagem cadastrada com sucesso');
                retornar();
            }catch (err) {
                const errorMessage = String(err);
                if (errorMessage.includes('401')) {
                    handleLogout();
                } else {
                    alert('Erro ao cadastrar a Postagem');
                }
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="container flex flex-col mx-auto items-center">
            <h1 className="text-4xl text-center my-8">
                {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}
            </h1>

            <form onSubmit={gerarNovaPostagem} className="flex flex-col w-1/2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Título da Postagem</label>
                    <input
                        value={postagem.titulo || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        type="text"
                        placeholder="Titulo"
                        name="titulo"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="texto">Texto da Postagem</label>
                    <input
                        value={postagem.texto || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        type="text"
                        placeholder="Texto"
                        name="texto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p>Tema da Postagem</p>
                    <select name="tema" id="tema" className="border p-2 border-slate-800 rounded"
                        onChange={(e) => buscarTemaPorId(e.currentTarget.value)}>
                        <option value="" selected disabled>Selecione um Tema</option>
                        {temas.map((tema) => (
                            <option key={tema.id} value={tema.id}>{tema.descricao}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading || tema.id === 0}
                    className='rounded disabled:bg-slate-200 bg-purple-400 hover:bg-purple-800 text-white font-bold w-full mx-auto py-2 flex justify-center'
                >
                    {isLoading ? <span>Carregando</span> : id !== undefined ? 'Editar' : 'Cadastrar'}
                </button>
            </form>
        </div>
    );
}

export default FormPostagem;