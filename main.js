const Modal = {
    open(){
        //Abrir modal e adicionar classe 'active' ao modal
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close(){
        //Fechar modal e remover classe 'active' do modal
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}