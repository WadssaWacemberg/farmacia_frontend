import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import fotoPadrao from '../../assets/livros.jpeg'

function Perfil() {
  const navigate = useNavigate()
  const { usuario } = useContext(AuthContext)

  useEffect(() => {
    if (usuario.token === "") {
      alert('Você precisa estar logado')
      navigate("/login")
    }
  }, [usuario.token])

  return (
    <div className="flex justify-center mx-4">
      <div className='container mx-auto mt-4 rounded-2xl overflow-hidden shadow-xl'>
        
   
        <img
          className="w-full h-72 object-cover border-b-8 border-white"
          src="https://i.imgur.com/ZZFAmzo.jpg" 
          alt="Capa do Perfil"
        />

       
        <img
        src={usuario.foto && usuario.foto !== "" ? usuario.foto : fotoPadrao} 
        alt={`Foto de perfil de ${usuario.nome}`} 
        className='rounded-full w-56 h-56 object-cover mx-auto mt-[-8rem] border-8 border-white relative z-10' 
      />

        <div className="relative mt-[-4rem] h-72 flex flex-col bg-purple-500 text-white text-2xl items-center justify-center">
          <p className='font-bold'>Nome: {usuario.nome} </p>
          <p>Email: {usuario.usuario}</p>
        </div>
      </div>
    </div>
  )
}

export default Perfil