import { gql } from "@apollo/client/core";

export const GET_MESSAGES = gql`
subscription Subscription {
  messages {
    id
    user
    content
  }
}
`;

export const CREATE_MESSAGE = gql`
mutation Mutation($postMessageId: ID, $user: String, $content: String) {
    postMessage(id: $postMessageId, user: $user, content: $content)
}
`