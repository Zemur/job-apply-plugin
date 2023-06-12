(() => {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    /**
     * Copies appropriate data to clipboard.
     */
    function copyToClipboard(configToCopy) {
        // Checks if https is being used.
        console.log("Config to copy:");
        console.log(configToCopy);
        if (location.protocol !== 'https:') {
            console.error("Clipboard copy not supported in HTTP")
            return;
        }

        let copyText = '';
        switch (configToCopy) {
            case 'linkedin':
                copyText = "http://www.linkedin.com/my-profile-url";
                break;
            case 'coverletter':
                copyText = "This is my cover letter.";
                break;
            default:
                console.error(`${configToCopy} did not match any of the valid configurations.`)
                return;
        }

        navigator.clipboard.writeText(copyText).then(
            () => {
                console.log(`${copyText} copied to clipboard.`)
            },
            () => {
                console.error(`${copyText} failed.`)
            }
        );
    }

    console.log("Loading content script JS")
    browser.runtime.onMessage.addListener((message) => {
        copyToClipboard(message.command);
    });

})();