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
  id: String
  user: String
  content: String
  }
  type Query {

    getUser(input: String): User

    getFriends(email: String) : [Friend]
    getPending(email: String) : [Friend]
    getSent(email: String) : [Friend]
  }

  type Subscription {
    messages: Message
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
    postMessage(user: String, content: String, id: ID): String

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