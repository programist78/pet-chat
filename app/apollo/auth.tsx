import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
mutation Mutation($about: LoginInput!) {
  loginUser(about: $about) {
    user {
      id
      nick
      email
      role
      balance
      donate
      status
      avatarUrl
    }
    token
  }
}
`

export const REGISTER_USER = gql`
mutation Mutation($about: RegisterInput!) {
  registerUser(about: $about) {
    user {
      balance
      id
      nick
      email
      role
      donate
      status
      avatarUrl
      chats
    }
    token
  }
}
`

export const GET_USER = gql`
query GetUser($input: String) {
  getUser(input: $input) {
    nick
    email
    avatarUrl
  }
}
`

export const CHANGE_USER_LOGO = gql`
mutation ChangeUserLogo($changeUserLogoId: ID, $file: [Upload]) {
  changeUserLogo(id: $changeUserLogoId, file: $file) {
    user {
      id
      nick
      email
      role
      balance
      donate
      status
      avatarUrl
      chats
    }
    token
  }
}
`

export const CHANGE_STATUS = gql`
mutation ChangeStatus($changeStatusId: ID, $confirmationCode: String) {
  changeStatus(id: $changeStatusId, confirmationCode: $confirmationCode) {
    id
    nick
    email
    role
    balance
    donate
    status
    avatarUrl
  }
}
`

