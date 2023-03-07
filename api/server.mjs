import { ApolloServer } from "apollo-server-koa";
import graphqlUploadKoa from "graphql-upload/graphqlUploadKoa.mjs";
import Koa from "koa";
import chalk from 'chalk'
import makeDir from "make-dir";
import { fileURLToPath } from "node:url";
import mongoose from 'mongoose';
import UPLOAD_DIRECTORY_URL from "./config/UPLOAD_DIRECTORY_URL.mjs";
import schema from "./schema/index.mjs";
import serve from "koa-static";
import path from 'path'
import { expressMiddleware } from '@apollo/server/express4';
import cors from "@koa/cors";
const __dirname = path.resolve();
const errorMsg = chalk.bold.red;
const successMsg = chalk.bold.blue;
//subscription

import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

// async function startServer() {
  await makeDir(fileURLToPath(UPLOAD_DIRECTORY_URL));
  const corsOptions = {
    origin: "*",
    // 'http://localhost:3001', 'http://localhost:4000/graphql'],
    credentials: true,
    }

  const app = new Koa()
  const httpServer = createServer(app.callback())
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  })
  const serverCleanup = useServer({ schema }, wsServer);
  const apolloServer = new ApolloServer({ schema,
    plugins:[
      ApolloServerPluginDrainHttpServer({ httpServer}),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  });
  
  await apolloServer.start();



  
  app
    .use(
      graphqlUploadKoa({
        maxFileSize: 10000000, // 10 MB
        maxFiles: 20,
      })
    )
    .use(serve(path.join(__dirname, '/uploads')))
    .use(cors(
      corsOptions
      ))
    .use(apolloServer.getMiddleware({ app, path: "/graphql", cors }));
    httpServer.listen(process.env.PORT, () => {
      console.info(successMsg(
        `Serving http://localhost:${process.env.PORT} for ${process.env.NODE_ENV}.`
      ));
    });
// }


mongoose
  .set('strictQuery', false)
  .connect(process.env.MONGO_DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }).then(() => console.log(successMsg(('💖Db ok'))))
  .catch((err) => console.log(errorMsg('DB error ❌', err)))


// startServer();
