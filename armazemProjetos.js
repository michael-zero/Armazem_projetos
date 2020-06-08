const express = require('express');

const app = express();
app.use(express.json());

const projects = [];

function contaRequisições(req, res, next) {

    console.count("Número de requisições");
  
    return next();
  }
  
  app.use(contaRequisições);

function contem(req, res, next){
    const {id} = req.params;
    const projeto = projects.find(p => p.id == id); 

    if(!projeto){
        return res.status(400).json({message: "Projeto não cadastrado"})
    }

    req.projeto = projeto;

    return next();
}

function criarProjeto(req, res, next){
    const {id, title} = req.body; 

    
     const projeto = projects.find(p => p.id == id);
    
     if(projeto){
        return res.status(400).json({message: 'Projeto com id já cadastrado'});
     }

     const project = {
        id,
        title,
        tasks: []
    }

    projects.push(project);
    
    req.project = project;

    return next();
    
}


app.get('/', (req, res) => {
    return res.send('Bem-vindo ao Armazém de Projetos');
})

app.get('/projects', (req, res) => {
    return res.json(projects);
})

//Criar Projeto 
app.post('/projects', criarProjeto ,(req, res) => {
    return res.json(req.project);
})


//Adicionar Tarefas
app.post('/projects/:id/task', contem ,(req, res) => {
     const {task} = req.body; 

     req.projeto.tasks.push(task);
    
    return res.json(req.projeto);
})

//Atualizar título
app.put('/projects/:id', contem, (req, res) => {
    
    const {title} = req.body; 
    req.projeto.title = title; 
    
    return res.json(req.projeto);
})


app.delete('/projects/:id', contem, (req, res) => {
    const {id} = req.params;

    const p = projects.find(projeto => projeto.id == id)

    projects.splice(p, 1);

    return res.json('success')

})



app.listen(3000);