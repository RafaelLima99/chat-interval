if (localStorage.getItem("chatId")) {
    verificaChatOpen()
}


function abrirChat(){

    fetch("/api/abrir-chat.php", {
    method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        
        let chatId = data.chatId;

        localStorage.setItem("chatId", chatId);
        exibirChat()

       /*========= interval ==========*/
        setInterval( async() => {
            await intervalMensagens(chatId);
        }, 3000)
       /*========= interval ==========*/
       

    })
    .catch(error => {
        alert('Erro na requisição:', error);
        console.error('Erro na requisição:', error);
    });
}

function fecharChat() {

    const chat     = document.getElementById("chat");
    const iconChat = document.getElementById("icon-chat");

    chat.classList.add('hide');
    chat.classList.remove('show');

    iconChat.classList.remove('hide');
    iconChat.classList.add('show');

    const chatId = localStorage.getItem("chatId");
    const data = {chatId: chatId};

    fetch("/api/fechar-chat.php", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json)
    .then(data => {
        
        localStorage.removeItem('chatId')
        document.getElementById("chat-messages").innerHTML = ""
    })
    .catch(error => {
        alert('Erro na requisição:', error)
        console.error('Erro na requisição:', error)
    });

    window.location.reload();
}

function enviarMensagem()
{
    const chatId           = localStorage.getItem("chatId");
    const mensagemConteudo = document.getElementById("inpt-mensagem").value
   
    const data = {chatId: chatId , mensagem: mensagemConteudo};
    
    fetch("/api/enviar-mensagem.php", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json)
    .then(data => {
        
        console.log(data)
    })
    .catch(error => {
        alert('Erro na requisição:', error);
        console.error('Erro na requisição:', error);
    });

    document.getElementById("inpt-mensagem").value = " "

    const dataAtual              = new Date();
    const dataHoraAtualFormatada = formatarDataHora(dataAtual);

    inserirMensagemHtml('você', dataHoraAtualFormatada, mensagemConteudo)
  
}

async function verificaChatOpen()
{
    console.log("teste")
    
    const chatId = localStorage.getItem("chatId");
    const data = {chatId: chatId};

    try {
        const response = await fetch('/api/verificar-open-chat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        });

        if (!response.ok) {
        throw new Error('Erro na requisição');
        }

        const responseData = await response.json();

        if(responseData.chatOpen == true){

            exibirChat()
            
            const mensagens = await chatMensagens(chatId)

            mensagens.map((mensagem) => {

                let remetente = '';

                if (mensagem.you_sent == true) {
                        remetente = 'você'
                }else{
                        remetente = 'Admin'
                }

                inserirMensagemHtml(remetente, mensagem.created_at, mensagem.message)
            })

            /*========= interval ==========*/

            setInterval( async() => {
            await intervalMensagens(chatId);
        }, 3000)
       /*========= interval ==========*/
        }

    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }

}

function exibirChat(){
    
    const iconChat = document.getElementById("icon-chat");
    const chat     = document.getElementById("chat");

    iconChat.classList.remove('show');
    iconChat.classList.add('hide');

    chat.classList.remove('hide');
    chat.classList.add('show');
        
}

function inserirMensagemHtml(remetente, dataEhora, mensagem){

    let elemento = ''

    if(remetente == 'você'){

        elemento = ` <div class="direct-chat-msg right">
                        <div class="direct-chat-info clearfix">
                            <span class="direct-chat-name pull-right">${remetente}</span>
                            <span class="direct-chat-timestamp pull-left">${dataEhora}</span>
                        </div>
                                
                        <img class="direct-chat-img" src="https://img.icons8.com/office/36/000000/person-female.png" alt="message user image">
                        
                        <div class="direct-chat-text">
                            ${mensagem}
                    </div>`

    }else{
        elemento = `<div class="direct-chat-msg">
                        <div class="direct-chat-info clearfix">
                            <span class="direct-chat-name pull-left">${remetente}</span>
                            <span class="direct-chat-timestamp pull-right">${dataEhora} </span>
                        </div>
                            
                        <img class="direct-chat-img" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="message user image">
                    
                        <div class="direct-chat-text">
                            ${mensagem}
                        </div>
                    </div>`   
    }

    document.getElementById("chat-messages").innerHTML += elemento
}

async function intervalMensagens(chatId){

    console.log("entrando")

    let mensagens = await chatMensagens(chatId);

    document.getElementById("chat-messages").innerHTML = ''

    mensagens.map((mensagem) => {

        let remetente = '';

        if (mensagem.you_sent == true) {
                remetente = 'você'
        }else{
                remetente = 'Admin'
        }

        inserirMensagemHtml(remetente, mensagem.created_at, mensagem.message)
    })

}
