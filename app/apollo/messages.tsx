import { gql } from "@apollo/client/core";

export const GET_MESSAGES = gql`
query GetMessages($getMessagesId: String) {
  getMessages(id: $getMessagesId) {
    user
    _id
    content
  }
}
`;

export const SUBSCRIPTION_MESSAGES = gql`
subscription Subscription($messagesId: ID!) {
  messages(id: $messagesId) {
    user
    content
    _id
  }
}
`

export const CREATE_MESSAGE = gql`
mutation Mutation($user: String, $content: String, $postMessageId: ID) {
  postMessage(user: $user, content: $content, id: $postMessageId) {
    _id
    user
    content
  }
}
`

export const CREATE_CHAT = gql`
mutation Mutation($email1: String, $email2: String, $createChatId: ID) {
  createChat(email1: $email1, email2: $email2, id: $createChatId) {
    user2
    user1
    messages {
      user
      id
      content
    }
    id
  }
}
`

export const GET_CHATS = gql`
query GetChats($email: String) {
  getChats(email: $email) {
    id
    user1
    user2
    lastMessage {
      user
      content
    }
  }
}
`