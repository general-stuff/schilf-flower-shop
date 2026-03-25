# Session Management

## Requirements

Integrate `iron-session` for session management.

Use some text as the `iron-session` password. Put it in the `.env.local` file (`IRON_SESSION_PASSWORD`). I will change that manually later.

## Quality Assurance

To verify that the session management is working:

* Add an API route:
  * Check whether the session already has a random number.
  * If it does, return the random number.
  * If it does not, add a random number to the session and return it.
* Call the API route from a client component that is embedded on the home page. Display a status message indicating that the data has been added to the session.
* Read the data from the session and display it on the home page (server component).
* Write an end-to-end test verifying that the session ID is displayed on the home page:
  1. Load the home page
  2. Wait for the status message indicating that the data has been added to the session. Remember the generated number.
  3. Reload the page
  4. Verify that the session ID is still displayed and has not changed

## Acceptance Criteria

As usual, the code must be warning-free and tests must pass without errors/warnings. Do run the e2e tests, too!
