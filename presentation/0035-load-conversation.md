# Load Conversation History

## Requirements

When the chat page is loaded and there is already a conversation ID in the session, load the conversation history from the OpenAI conversation API (`GET /conversations/{conversation_id}/items` and `GET /conversations/{conversation_id}/items/{item_id}`) and display it in the chat history. This should allow a user to reload the page and continue the conversation from where it left off.

Once the conversation has been loaded, the conversation history must automatically scroll down to the bottom of the chat history.

Add a second button to the right of the "send" button that starts a new conversation by generating a new conversation ID and storing it in the session.

## Technical Requirements

Elements of a conversation might not be immediately available in the conversation API after a response is created. In tests, if OpenAI returns an empty list of items, retry a few times with a delay of 500ms.

## Acceptance Criteria

Write an end-to-end test:

* Load the chat page.
* Verify that the chat history is empty.
* Send a message to the bot.
* Verify that the message is displayed in the chat history.
* Reload the page.
* Verify that the message is still displayed in the chat history.
* Click the "new conversation" button.
* Verify that the chat history is empty.
