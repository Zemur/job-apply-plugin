/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    document.addEventListener("click", (e) => {
        /**
         * Just log the error to the console.
         */
        function reportError(error) {
            console.error(`Could not run: ${error}`);
        }

        /**
         * Returns the command based on the appropriate button.
         */
        function buttonToCommand(button_text) {
            switch (button_text) {
                case "LinkedIn Profile":
                    return "linkedin"
                case "Cover Letter":
                    return "coverletter"
                default:
                    return "invalid"
            }
        }

        /**
         * Sends the command to the content script event listener.
         */
        function copyContext(tabs) {
            const command = buttonToCommand(e.target.textContent);
            browser.tabs.sendMessage(tabs[0].id, {
                command: command
            });
        }

        /**
         * Get the active tab,
         * then call the specified actions.
         */
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        }
        browser.tabs
            .query({
                active: true,
                currentWindow: true
            })
            .then(copyContext)
            .catch(reportError);
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs
    .executeScript({
        file: "/content_scripts/job_application_helper.js"
    })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);