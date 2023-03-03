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
  type Post {
    id: ID
    title: String
    text: String
    price: String
    images: [String]
    comments: [String]
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
  type PostComment {
    comment: String
    user: String
  }
  type PostAnswers {
    comment: String
    user: String
  }
  type PostCommentwanswers {
    comment: String
    user: String
    id: String
    answers: [PostComment]
  }
  type AuthPayload {
    user: User
    token: String
  }
  type InfoAboutUser {
    id: ID
    fullname: String
    email: String
    role: String
    avatarUrl: String
  }
  type Query {
    getAllPosts: [Post]
    getPost(id: ID): Post

    getPostComments(id: ID): [PostCommentwanswers]

    getUser(email: String): User
  }
  input PostInput {
    title: String
    text: String
    price: String
  }

  input PostCommentInput{
    comment: String!
    user: String!
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
    createPost(post: PostInput!, image: [Upload]!): Post
    deletePost(id: ID): String
    updatePost(id: ID,post: PostInput): Post

    PostcreateComment(id: ID, about: PostCommentInput) : PostComment
    PostanswerComment(id: ID, about: PostCommentInput) : PostCommentwanswers
    PostdeleteanswerComment(id: ID): String

    loginUser(about: LoginInput!): AuthPayload
    registerUser(id: ID, about: RegisterInput!): AuthPayload
    changeStatus(id: ID, confirmationCode: String): User
    changeUserLogo(id: ID, file: [Upload]): AuthPayload
    withdrawBalance(email: String, balance: String): User
    topupBalance(email: String, balance: String): User
    donateUser(email: String, donate: String): User

    subscribeToNewsletter(email: String): String
  }
`;

// export const uploadTypeDefs = `#graphql
//   extend type Query: {
//     greetings: String
//   }
//   extend type Mutation: {
//     singleUpload(file: Upload!): SuccessMessage
//   }
//   type SuccessMessage: {
//     message: String
//   }
// `

export default typeDefs