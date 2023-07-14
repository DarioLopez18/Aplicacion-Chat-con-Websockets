import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import {Server} from 'socket.io' //Este Server se creara a partir del server HTTP

const app = express()

const PORT = process.env.PORT || 8080

const httpServer = app.listen(PORT,console.log(`Listening on PORT ${PORT}`)) //Solo el server de http

const io = new Server(httpServer)

app.engine('handlebars',handlebars.engine()) 

app.set('views',__dirname+'/views')

app.set('view engine','handlebars')

app.use(express.static(__dirname+'/public'))

app.use('/',viewsRouter)

let messages = []

io.on('connection',socket=>{

    console.log('Nuevo cliente conectado')

    socket.on('new',user=>{

        console.log(`${user} acaba de conectarse.`)

        socket.broadcast.emit('new',user)

    })

    socket.on('message',data=>{

        messages.push(data)
        
        io.emit('messageLogs',messages)
    
    })
})

