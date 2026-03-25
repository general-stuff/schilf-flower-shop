# Session Management

Integrate `iron-session` for session management.

Use some text as the iron-session password. Put it in the .env.local file (`IRON_SESSION_PASSWORD`). I will change that manually later.

* When the app is loaded, check if a session exists.
  * If not, create a new one and store a generated GUID `sessionId` in the session.
  * If it exists, use the existing session.
* Display the session ID on the home page.
* Write an end-to-end test verifying that the session ID is displayed on the home page:
  1. Load the home page
  2. Verify that the session ID is displayed. Remember it.
  3. Reload the page
  4. Verify that the session ID is still displayed and has not changed
