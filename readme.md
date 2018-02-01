# Chrome Debug Button prototype

A basic chrome extension that adds a 'debug button' for submitting help requests (including a screenshot and the console.log history)


## Resources 

[Extension dev guide](https://developer.chrome.com/extensions/devguide)

[Screenshot sample extension](https://developer.chrome.com/extensions/samples#search:screenshot)

[Message Passing](https://developer.chrome.com/extensions/messaging)

## Event lifecycle

- `phoenix.js` is injected on page load of any URLs specified in the manifest.json - so that we can collect the console history
- When clicking the 'bug button', our `chrome.pageAction.onClicked` gets triggered in `background.js` and sends a `RequestConsoleHistory` event to the users window (i.e. Phoenix)
- The code we've injected into phoenix (see `phoenix.js`) receives this event & sends a new event: `SendConsoleHistory` with the console history we gathered by overridding the console object using a plugin: [console-history](https://github.com/lesander/console.history/).
- The content_script receives the `SendConsoleHistory` event and passes the event along to our chrome background process (see `background.js`)
- Our listener in `background.js` is triggered & takes a screenshot using the captureVisibleTab API and then opens our `screenshot.html` view 
- The user sees a beautiful form they can fill in & would submit to a endpoint (when implemented)


## Screenshot

![screenshot](https://raw.githubusercontent.com/stebaker92/chrome-debug-button/master/screenshot.png)
