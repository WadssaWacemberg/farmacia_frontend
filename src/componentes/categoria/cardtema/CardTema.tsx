import { Link } from 'react-router-dom'
import type Tema from '../../../models/Tema'


interface CardTemaProps{
    tema: Tema
}

function CardTema({ tema }: CardTemaProps) {
    
    return (
    <div className='border flex flex-col rounded-2x1 overflow-hidden justify-between'>
        <header className='py-2 px-6 bg-purple-800 text-white font-bold text-2x1'>Tema</header>
        <p className='p-8 text-3xl bg-slate-200 h-full'>{tema.descricao}</p>

            <div className="flex">
            <Link to={`/editartema/${tema.id}`}
                className='w-full text-slate-100 bg-purple-400 hover:bg-purple-800 flex itens-center justify-center py-2'>
                <button>Editar</button>
            </Link>

            <Link to={`/deletartema/${tema.id}`} 
                className='w-full text-slate-100 bg-red-400 hover:bg-red-800 flex itens-center justify-center py-2'>
                <button>Deletar</button>
            </Link>
        </div>
   
    </div>
    )
}
export default CardTema;