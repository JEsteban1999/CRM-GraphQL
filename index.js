const {ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const conectarDB = require('./config/db');

// Conectar a la base de datos
conectarDB();

// Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        //console.log(req.headers['authorization'])
        const token = req.headers['authorization'] || '';
        if (token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
                //console.log(usuario);
                return {
                    usuario
                }
            } catch (error) {
                console.log("Hubo un error");
                console.log(error);
            }
        }
    } 
});

// Arrancar el servidor
server.listen({port: process.env.PORT || 4000}).then(({url}) => {
    console.log(`Servidor listo en la URL ${url}`)
})