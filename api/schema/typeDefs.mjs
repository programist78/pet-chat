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
  type Friend {
    email: String
    nick: String
  }
  type User{
    id: ID
    fullname: String
    email: String
    role: String
    balance: String
    donate: String
    status: String
    avatarUrl: String
    friend_sent: [Friend]
    friend_pending: [Friend]
    friends: [Friend]
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
    nick: String!
    email: String!
    password: String!
    confirm_password: String!
  }

  type Mutation {
    postMessage(id: ID, user: String, content: String): ID

    sendFriendRequest(from_email: String, nick: String) : User
    acceptFriendRequest(from_email: String, to_email: String) : User
    rejectFriendRequest(from_email: String, to_email: String) : User

    loginUser(about: LoginInput!): AuthPayload
    registerUser(about: RegisterInput!): AuthPayload
    changeStatus(id: ID, confirmationCode: String): User
    changeUserLogo(id: ID, file: [Upload]): AuthPayload
  }
`;

export default typeDefs