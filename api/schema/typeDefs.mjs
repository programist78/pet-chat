// import singleTypeDefs from ''

const typeDefs = `#graphql
  scalar Upload
  type File {
    url: [String]
  }
  enum Role {
  USER
  ADMIN
  }
  type User{
    id: ID
    fullname: String
    email: String
    role: String
    password: String
    balance: String
    donate: String
    status: String
    avatarUrl: String
  }
  type AuthPayload {
    user: User
    token: String
  }
  type Message {
  id: ID
  user: String
  content: String
  }
  type Query {
    messages: [Message]

    getUser(email: String): User
  }

  input LoginInput{
    email: String!
    password: String!
  }

  input RegisterInput{
    fullname: String!
    email: String!
    password: String!
    confirm_password: String!
  }

  type Mutation {
    postMessage(id: ID, user: String, content: String): ID

    loginUser(about: LoginInput!): AuthPayload
    registerUser(id: ID, about: RegisterInput!): AuthPayload
    changeStatus(id: ID, confirmationCode: String): User
    changeUserLogo(id: ID, file: [Upload]): AuthPayload
  }
`;

export default typeDefs