import { type ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import type Categoria from "../../../models/Categoria";
import type Produto from "../../../models/Produto";
import { buscar, atualizar, cadastrar } from "../../../service/Service";

function FormProduto() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]); 
    const [categoria, setCategoria] = useState<Categoria>({ id: 0, descricao: '' });
    const [produto, setProduto] = useState<Produto>({} as Produto);

    async function buscarProdutoPorId(id: string) {
        await buscar(`/produtos/${id}`, setProduto, {
            headers: { Authorization: token }
        });
    }

    async function buscarCategoriaPorId(id: string) {
        await buscar(`/categorias/${id}`, setCategoria, {
            headers: { Authorization: token }
        });
    }

    async function listarCategorias() {
        await buscar('/categorias', setCategorias, {
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
        listarCategorias();
        if (id !== undefined) {
            buscarProdutoPorId(id);
        }
    }, [id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProduto({
            ...produto,
            categoria: categoria,
        });
    }, [categoria]);

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
        setProduto({
            ...produto,
            [e.target.name]: e.target.value,
            categoria: categoria,
            usuario: usuario,
        });
    }

    function retornar() {
        navigate('/produtos');
    }

    async function gerarNovoProduto(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        if (id !== undefined) {
            try {
                await atualizar(`/produtos`, produto, setProduto, {
                    headers: { Authorization: token },
                });
                alert('Produto atualizado com sucesso');
                retornar();
            } catch (err) {
                const errorMessage = String(err);
                if (errorMessage.includes('401')) {
                    handleLogout();
                } else {
                    alert('Erro ao atualizar o Produto');
                }
            }
        } else {
            try {
                await cadastrar(`/produtos`, produto, setProduto, {
                    headers: { Authorization: token },
                });
                alert('Produto cadastrado com sucesso');
                retornar();
            } catch (err) {
                const errorMessage = String(err);
                if (errorMessage.includes('401')) {
                    handleLogout();
                } else {
                    alert('Erro ao cadastrar o Produto');
                }
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="container flex flex-col mx-auto items-center">
            <h1 className="text-4xl text-center my-8">
                {id !== undefined ? 'Editar Produto' : 'Cadastrar Produto'}
            </h1>

            <form onSubmit={gerarNovoProduto} className="flex flex-col w-1/2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="nome">Nome do Produto</label>
                    <input
                        value={produto.nome || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        type="text"
                        placeholder="Ex: Amoxicilina"
                        name="nome"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="descricao">Descrição</label>
                    <input
                        value={produto.descricao || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                        type="text"
                        placeholder="Descrição do produto"
                        name="descricao"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p>Categoria do Produto</p>
                    <select 
                        name="categoria" 
                        id="categoria" 
                        className="border p-2 border-slate-800 rounded"
                        onChange={(e) => buscarCategoriaPorId(e.currentTarget.value)}
                    >
                        <option value="" selected disabled>Selecione uma Categoria</option>
                        {categorias.map((item) => (
                            <option key={item.id} value={item.id}>{item.descricao}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={isLoading || categoria.id === 0}
                    className='rounded disabled:bg-slate-200 bg-purple-600 hover:bg-purple-800 text-white font-bold w-full mx-auto py-2 flex justify-center'
                >
                    {isLoading ? <span>Carregando...</span> : id !== undefined ? 'Atualizar' : 'Cadastrar'}
                </button>
            </form> 
        </div>
    );
}
export default FormProduto;