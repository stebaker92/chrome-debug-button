// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            // pageUrl: { urlContainsMatches: 'phoenix' },
            pageUrl: { urlMatches: '(phoenix|localhost:6701)' },
          })
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});


// To make sure we can uniquely identify each screenshot tab, add an id as a
// query param to the url that displays the screenshot.
// Note: It's OK that this is a global variable (and not in localStorage),
// because the event page will stay open as long as any screenshot tabs are
// open.
var id = 100;

// Listen for a click on the camera icon. On that click, take a screenshot.
chrome.pageAction.onClicked.addListener(function () {

  // Ask the tab for a log of their console

  var script = `//getAndSendConsoleHistory();
  
  var event = document.createEvent('Event');
  event.initEvent('RequestConsoleHistory');
  document.dispatchEvent(event);
  `;
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
});

// Listen to the event from our content script
chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  //do something that only the extension has privileges here
  // console.log("received message from contentscript");
  // console.log(message);

  if (message.name === "SendConsoleHistory") {
    console.log("SendConsoleHistory received", message.history.length + " messages found");
    captureVisibleTab(message.history);
  }

  return true;
});



// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (response) {
//     console.log("received message in extension from content script", response.farewell);
//   });
// });

function captureVisibleTab(consoleHistory) {

  chrome.tabs.captureVisibleTab(function (screenshotUrl) {
    var viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++)
    var targetId = null;

    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
      // We are waiting for the tab we opened to finish loading.
      // Check that the tab's id matches the tab we opened,
      // and that the tab is done loading.
      if (tabId != targetId || changedProps.status != "complete")
        return;

      // Passing the above test means this is the event we were waiting for.
      // There is nothing we need to do for future onUpdated events, so we
      // use removeListner to stop getting called when onUpdated events fire.
      chrome.tabs.onUpdated.removeListener(listener);

      // Look through all views to find the window which will display
      // the screenshot.  The url of the tab which will display the
      // screenshot includes a query parameter with a unique id, which
      // ensures that exactly one view will have the matching URL.
      var views = chrome.extension.getViews();
      for (var i = 0; i < views.length; i++) {
        var view = views[i];
        if (view.location.href == viewTabUrl) {
          view.setScreenshotUrl(screenshotUrl);
          view.setConsoleHistory(consoleHistory);
          break;
        }
      }
    });

    chrome.tabs.create({ url: viewTabUrl }, function (tab) {
      targetId = tab.id;
    });
  });
}

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   alert("message received");
// });
