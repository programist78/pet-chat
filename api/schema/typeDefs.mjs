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
    nick: String
    email: String
    role: String
    balance: String
    donate: String
    status: String
    avatarUrl: String
    chats: [String]
  }
  type Body{
    nick: String
    email: String
    avatarUrl: String
  }
  type Friend {
    nick: String
    email: String
  }
  type AuthPayload {
    user: User
    token: String
  }
  type Message {
  _id: String
  user: String
  content: String
  }
  type Query {

    getUser(input: String): Body

    getFriends(email: String) : [Friend]
    getPending(email: String) : [Friend]
    getSent(email: String) : [Friend]

    getMessages(id: String): [Message]
    getChats(email: String): [ChatforGet] 
  } 

  type Sendler {
    user: String
    content: String
  }

  type ChatforGet {
    id: ID
    user1: String
    user2: String
    lastMessage: Sendler
  }

  type Chat {
    id: ID
    user1: String
    user2: String
    messages: [Message]!
  }

  type Subscription {
    messages(id: ID!): [Message]
    messageAdded(chatID: ID!): Message!
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
    postMessage(user: String, content: String, id: ID): Message
    createChat(email1: String, email2: String, id:ID): Chat

    sendFriendRequest(from_email: String, nick: String) : Friend
    acceptFriendRequest(from_email: String, to_email: String) : Friend
    rejectFriendRequest(from_email: String, to_email: String) : Friend
    deleteFriend(from_email: String, to_email: String) : Friend

    loginUser(about: LoginInput!): AuthPayload
    registerUser(about: RegisterInput!): AuthPayload
    changeStatus(id: ID, confirmationCode: String): User
    changeUserLogo(id: ID, file: [Upload]): AuthPayload
  }
`;

export default typeDefs