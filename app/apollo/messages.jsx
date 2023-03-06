import { gql } from "@apollo/client/core";

export const GET_MESSAGES = gql`
query Query {
    messages {
        content
        id
        user
    }
}
`;

export const CREATE_MESSAGE = gql`
mutation Mutation($postMessageId: ID, $user: String, $content: String) {
    postMessage(id: $postMessageId, user: $user, content: $content)
}
`