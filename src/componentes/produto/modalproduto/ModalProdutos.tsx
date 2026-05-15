import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'; 
import FormProduto from '../formproduto/FormProdutos';


function ModalProduto() {
    return (
        <>
            <Popup
                trigger={
                    <button
                        className='border rounded px-4 py-2 hover:bg-white hover:text-purple-800 transition-all duration-300'>
                        Nova Produto
                    </button>
                }
                modal
                contentStyle={{
                    borderRadius: '1rem',
                    paddingBottom: '2rem',
                    width: '80%',    
                    maxWidth: '600px'
                }}
            >
                <div className='bg-white rounded-2xl'> 
                    <FormProduto />  
                </div>
            </Popup>
        </>
    );
}

export default ModalProduto; 