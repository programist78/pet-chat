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
mutation RegisterUser($about: RegisterInput!) {
  registerUser(about: $about) {
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

export const GET_USER = gql`
query Query($email: String) {
  getUser(email: $email) {
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

export const CHANGE_USER_LOGO = gql`
mutation Mutation($changeUserLogoId: ID, $file: [Upload]) {
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

