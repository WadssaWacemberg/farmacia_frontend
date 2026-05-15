import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscar } from "../../../service/Service";
import { SyncLoader } from "react-spinners";
import CardTema from "../cardtema/CardTema";
import type Tema from '../../../models/Tema';

function ListaTemas() {
    const navigate = useNavigate();
    const [temas, setTemas] = useState<Tema[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado!');
            navigate('/');
        }
    }, [token, navigate]);

    useEffect(() => {
        async function buscarTemas() {
            setIsLoading(true);
            try {
                await buscar('/temas', setTemas, {
                    headers: { Authorization: token }
                });
            } catch (error: unknown) {
                if (error instanceof Error && error.toString().includes('401')) {
                    handleLogout();
                }
            } finally {
                setIsLoading(false);
            }
        }

        if (token !== '') {
            buscarTemas();
        }
    }, [token, handleLogout]);

    return (
        <>
            {isLoading && (
                <div className="flex justify-center items-center h-screen">
                    <SyncLoader color="#312e81" size={32} />
                </div>
            )}
            
            <div className="flex justify-center w-full my-4">
                <div className="container flex flex-col mx-2">
                    {(!isLoading && temas.length === 0) && (
                        <span className="text-3xl text-center my-8 text-slate-500 font-light italic">
                            Nenhum Tema foi encontrado!
                        </span>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {temas.map((tema) => (
                            <CardTema key={tema.id} tema={tema} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListaTemas;