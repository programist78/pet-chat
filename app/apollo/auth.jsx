import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
mutation LoginUser($about: LoginInput!) {
  loginUser(about: $about) {
    token
    user {
      avatarUrl
      balance
      email
      donate
      nick
      role
      id
      status
      friend_pending {
        email
        nick
      }
      friend_sent {
        email
        nick
      }
      friends {
        email
        nick
      }
    }
  }
}
`

export const REGISTER_USER = gql`
mutation RegisterUser($about: RegisterInput!) {
  registerUser(about: $about) {
    token
    user {
      avatarUrl
      balance
      email
      donate
      nick
      role
      id
      status
      friend_pending {
        email
        nick
      }
      friend_sent {
        email
        nick
      }
      friends {
        email
        nick
      }
    }
  }
}
`

export const GET_USER = gql`
  query GetUser($email: String) {
    getUser(email: $email) {
        avatarUrl
        balance
        email
        donate
        nick
        role
        id
        status
        friend_pending {
          email
          nick
        }
        friend_sent {
          email
          nick
        }
        friends {
          email
          nick
        }
    }
  }
`

export const GET_USER_NAME = gql`
  query GetUser($email: String) {
    getUser(email: $email) {
      nick
    }
  }
`
export const CHANGE_USER_LOGO = gql`
  mutation ChangeUserLogo($changeUserLogoId: ID, $file: [Upload]) {
    changeUserLogo(id: $changeUserLogoId, file: $file) {
      token
      user {
        avatarUrl
        balance
        email
        donate
        nick
        role
        id
        status
        friend_pending {
          email
          nick
        }
        friend_sent {
          email
          nick
        }
        friends {
          email
          nick
        }
      }
    }
  }
`

export const CHANGE_STATUS = gql`
  mutation ChangeStatus($changeStatusId: ID, $confirmationCode: String) {
    changeStatus(id: $changeStatusId, confirmationCode: $confirmationCode) {
        avatarUrl
        balance
        email
        donate
        nick
        role
        id
        status
        friend_pending {
          email
          nick
        }
        friend_sent {
          email
          nick
        }
        friends {
          email
          nick
        }
    }
  }
`

export const SEND_FRIEND = gql`
mutation SendFriendRequest($fromEmail: String, $nick: String) {
  sendFriendRequest(from_email: $fromEmail, nick: $nick) {
    avatarUrl
    balance
    donate
    friend_pending {
      email
      nick
    }
    email
    friend_sent {
      email
      nick
    }
    friends {
      email
      nick
    }
    id
    nick
    role
    status
  }
}
`
