import typeDefs from './typeDefs.mjs';
import resolvers from './resolvers.mjs';
// import { makeExecutableSchema } from 'graphql-tools';
//TODO
import { makeExecutableSchema } from '@graphql-tools/schema';

const schema = makeExecutableSchema({ typeDefs, resolvers});

export default schema