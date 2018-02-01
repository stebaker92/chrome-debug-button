// We could add this code directly into 'Phoenix' but this approach is more generic

console.log("This has been injected into phoenix")

window.consoleBuffer = [];

var data = { type: "FROM_PAGE", text: "Hello from the webpage!" };
window.postMessage(data, "*");

console._intercept = function (type, args) {

    if (type === 'error' || type === 'warning') {
        // send the error to your server or do something else..
    }

    // pass the log intent to the collector.
    console._collect(type, args)
}

// window.consoleTest = function (args) {
//     if (consoleBuffer.length > 100) {
//         consoleBuffer.unshift();
//     }

//     consoleBuffer.push(args);

//     console.log(args);

//     // Send the message to our extension if it exists
//     // chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//     //     console.log(response.farewell);
//     // });
// }

// consoleTest && 
window.console.warn("Test - phoenix app run.js", "test");


window.getAndSendConsoleHistory = function () {
    sendToContentScript();
}

function sendToContentScript() {
    // var event = document.createEvent('Event');
    // event.initEvent('hello');
    // document.dispatchEvent(event);

    console.log("[phoenix] sending SendConsoleHistory customEvent")

    // Create a CustomEvent so we can attach data

    // deprecated
    // var evt = document.createEvent("CustomEvent");
    // evt.initCustomEvent("SendConsoleHistory", true, true, { detail: window.console.history });
    // document.dispatchEvent(evt);

    var cust = new CustomEvent('SendConsoleHistory', { 'detail': JSON.parse(JSON.stringify(window.console.history)) });
    document.dispatchEvent(cust);
}

document.addEventListener("RequestConsoleHistory", function (data) {
    console.log("[phoneix] RequestConsoleHistory received from background.js");
    sendToContentScript();
});
