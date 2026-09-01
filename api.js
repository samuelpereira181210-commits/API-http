import http from 'node:http'
import { URL } from 'node:url'

const porta = 3000

const tarefas = [
    {id: 1, titulo: 'Lavar Louças'},
    {id: 2, titulo: 'Comprar uma RTX 5090'}
]

const server = http.createServer((requisicao, resposta) => {
    resposta.setHeader('content-type','application/json; charset=utf-8')

    const urlObj = new URL(requisicao.url, `http:/${requisicao.headers.host}`)

    if(requisicao.method == 'GET' && requisicao.url == '/tarefas'){
        resposta.statusCode = 200
        resposta.end(JSON.stringify(tarefas)) //JSON.stringfy trasforma JSON em string
    }
    else if(requisicao.method == 'GET' && urlObj.pathname == '/tarefas/busca'){//nome da rota da query string
        const titulo = urlObj.searchParams.get('titulo')
        const filtro = tarefas.filter((tarefa) => {
            
            tarefa.titulo.toLowerCase().includes(titulo || '')
            return tarefa.titulo.toLowerCase
        })
        statusCode = 200
        resposta.end(JSON.stringify(tarefas))
    }
    else if(requisicao.method == 'DELETE' && urlObj.pathname == '/tarefas'){
        const id = urlObj.searchParams.get('id')
        const tarefa = tarefa.find((t) => {
            t.id == id
        });

        const index = tarefas.index(tarefa);
        let elementoDeletado
        if (index > -1){
            elementoDeletado = tarefas.splice(index, 1)
        }

        resposta.end(JSON.stringify(elementoDeletado));
    }

    else if(requisicao.method == 'GET' && requisicao.url == '/tarefa'){
        let body = ''

        requisicao.on('data', (chunk) => {
            body += chunk.toString()
        })

        requisicao.on('end', () => {
            try{
                const novaTarefa = JSON.parse(body) //JSON.parse tranforma string em JSON

                if(!novaTarefa.titulo){
                    resposta.statusCode = 400 //Erro de cliente 
                    resposta.end(JSON.stringify({error: 'O campo "titulo" é obrigadorio.'}))
                }

                const tarefaCriada = {
                    id: tarefas.length + 1,
                    titulo: novaTarefa.titulo
                }

                tarefas.push(tarefaCriada)

                resposta.statusCode = 201 //Recurso Criado
                resposta.end(JSON.stringify(tarefaCriada))


            } catch(error) {
                resposta.statusCode = 400
                resposta.end(JSON.stringify ({error: 'Formato JSON invalido!'}))
            }
        })
    } else {
        resposta.statusCode = 404
        resposta.end(JSON.stringify({error: 'Página não encontrada.'}))
    }
});

server.listen(porta, () => {
    console.log(`Srvidor funcionando na porta ${porta}`);
})

