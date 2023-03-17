import { gql } from '@apollo/client'

export const SEND_FRIEND = gql`
mutation SendFriendRequest($fromEmail: String, $nick: String) {
  sendFriendRequest(from_email: $fromEmail, nick: $nick) {
    nick
    email
  }
}
`

export const ACCEPT_FRIEND = gql`
mutation AcceptFriendRequest($fromEmail: String, $toEmail: String) {
  acceptFriendRequest(from_email: $fromEmail, to_email: $toEmail) {
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

export const REJECT_FRIEND = gql`
mutation RejectFriendRequest($fromEmail: String, $toEmail: String) {
  rejectFriendRequest(from_email: $fromEmail, to_email: $toEmail) {
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

export const DELETE_FRIEND = gql`
mutation DeleteFriend($fromEmail: String, $toEmail: String) {
  deleteFriend(from_email: $fromEmail, to_email: $toEmail) {
    nick
    email
  }
}
`

export const GET_FRIENDS = gql`
query Query($email: String) {
  getFriends(email: $email) {
    email
    nick
  }
}
`

export const GET_PENDING_FRIENDS = gql`
query GetPending($email: String) {
  getPending(email: $email) {
    email
    nick
  }
}
`

export const GET_SENT_FRIENDS = gql`
query GetSent($email: String) {
  getSent(email: $email) {
    email
    nick
  }
}
`