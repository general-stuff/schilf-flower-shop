# Filling the Database via Web App

## Requirements

We want to remove the test UI from the web app and replace it with first, real UI elements.

On top level, we want to have a hero text "Flower Shop". It must be visible on the top of every page.

Below the top-level hero text, we want to have elegant links to different sections of our app. This will act as the main menu. At the end, we expect to have only a few (< 5) links, no nested menus. For now, just add one link to the fill database page.

Add a page to fill the database with demo data. It uses the `fillFlowers` function from the library.

* A button to trigger filling the database.
* While filling, display a "loading" message.
* Below the button, display a list of all flowers (only names).
* Refresh the flower list after the filling is complete.
* If the user clicks on a flower name, use a HTML modal dialog to display the flower details (name, description, colors). Convert markdown in the description to HTML.

## Cleanup

* Remove the demo end-to-end tests for the home page.
* Remove any demo logic from the library that might sill exist.

## Testing

Add and run an end-to-end test verifying that the fill database page works:

* Check if the button is visible and clickable.
* Click the button.
* Verify that the flower list is not empty once the filling is complete.

## Acceptance Criteria

As always, code must be warning-free and tests must pass without errors/warnings. Do execute e2e tests, too.
