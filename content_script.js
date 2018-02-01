// From this file, we have full access to the DOM, but not the window object, which we need for the console
// https://stackoverflow.com/questions/20499994/access-window-variable-from-content-script

console.log("This is the injected content script!");


function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
injectScript(chrome.extension.getURL('/libs/console-history.js'), 'body');
injectScript(chrome.extension.getURL('/js/phoenix.js'), 'body');



window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received message: " + event.data.text);
    }
});


// Listen to the webpage and forward to the chrome extension
document.addEventListener("hello", function (data) {
    console.log("[contentscript] hello received ")
    chrome.runtime.sendMessage("test");
});

// Listen to the webpage and forward to the chrome extension
document.addEventListener("SendConsoleHistory", function (data) {
    console.log("[contentscript] SendConsoleHistory received");
    console.log(data.detail);

    chrome.extension.sendMessage({ name: "SendConsoleHistory", history: data.detail }, function (response) {
        //callback
    });

})

// Listen to the chrome extension and send to the webpage (injected phoenix.js)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ?
        "received message from a content script:" + sender.tab.url :
        "[contentscript] received message from the extension");

    console.log(request)

    console.log("sending RequestConsoleHistory")

    window.postMessage("RequestConsoleHistory");

    if (request.greeting == "hello")
        sendResponse({ farewell: "goodbye" });
});