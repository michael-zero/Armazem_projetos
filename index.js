const express = require('express');

const server = express();

server.use(express.json()); //necessário pra fazer o express entender o formato 
//json na hr dos métodos post, put...


const users = ['Snow', 'Kramer', 'Shinichi'];


//Log de requisição 
server.use((req, res, next) => {
    console.log(`Método: ${req.method} URL: ${req.url}`);
    return next();
})

function checkUserInArray(req, res, next){
    const user = users[req.params.index];
   
    if(!user){
        return res.status(400).json({erro: 'User does not exists'});
    }

    req.user = user;

    return next();
}


//Início 
server.get('/', (req, res) => {
    return res.send('Bem-vindo!')
})

//Listar usuários
server.get('/users', (req, res) => {
    return res.json(users);
})

//Buscar um usuário
//http://localhost:3000/users/5?name=mike
server.get('/users/:index', checkUserInArray ,(req, res) => {
     //const name = req.query.name; 
     //const {pos} = req.params; //destructuring

     return res.json(req.user);
})

//Criar um usuário
server.post('/users', checkUserExists ,(req, res) => {
    const {name} = req.body; 

    users.push(name);

    return res.json(users);

})

function checkUserExists(req, res, next){
    if(!req.body.name){
        return res.status(400).json({error: 'User name is required'})
    }

    return next();
}


//Atualizar usuário
server.put('/users/:index', checkUserExists, checkUserInArray ,(req, res) => {
    const {name} = req.body;
    const {index} = req.params;

    users[index] = name; 

    return res.json(users);
})

//Deletar
server.delete('/users/:index', checkUserInArray ,(req, res) => {
    const {index} = req.params;

    users.splice(index, 1);
    
    return res.send();
})

server.listen(3000);