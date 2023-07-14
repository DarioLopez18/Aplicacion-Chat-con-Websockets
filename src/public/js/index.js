const socket = io()

let user //este user sera con el que cliente se identificara para saber quien escribio el mensaje.

let chatBox = document.getElementById('chatBox') //obtenemos la referencia del cuadro donde se recibira

Swal.fire({
    title:"¡Bienvenido al Chat Desarrollado por Dario Lopez!",
    input: "text",
    text: "Ingresa tu nombre para continuar.(Ese nombre sera visible para todos los participantes del chat)",
    //esta validacion ocurre si el usuario quiere continuar sin poner nombre de usuario.
    inputValidator: (value) => {
        return !value && '¡Necesitas escribir un nombre de usuario para continuar!'
    },
    //impide que el usuario salga de la alerta al darle click fuera de la alerta
    allowOutsideClick: false
}).then(result=>{
    user = result.value //una vez que el usuario se identifica lo asignamos a la variable
    document.getElementById('username').innerHTML = user
    socket.emit('new',user)
})
    


chatBox.addEventListener('keyup',evt=>{
    if(evt.key === "Enter"){
        const message = chatBox.value.trim()
        //el mensaje se enviara cuando el usuario aprete enter en la caja de chat
        if(message.length>0){
            //validamos que el mensaje no este vacio o solo contenga espacios
            socket.emit("message",{user,message}) 
            chatBox.value = ""
        }
    }
})



socket.on('messageLogs',data=>{
    let log = document.getElementById('messageLogs')
    let messages = ""
    data.forEach(message => {
        messages =`${message.user}: ${message.message}</br>` + messages 
    })
    log.innerHTML = messages
})

socket.on('new',user=>{
    Swal.fire({
        text: `${user} acaba de saltar al servidor! Enviale un mensaje de bienvenida`,
        toast: true,
        position: "center"
    })
})