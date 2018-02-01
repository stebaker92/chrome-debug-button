// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


document.getElementById('frmBugReport').style.display = "none";
document.getElementById('frmNoReport').style.display = "block";
document.getElementById('btnClose').addEventListener("click", function () { window.close(); });


var consoleHistory;

function setScreenshotUrl(url) {
  // if we have data i.e. the user didn't refresh. Prevent a refresh
  // window.onbeforeunload = function () { return false; }

  document.getElementById('frmBugReport').style.display = "block";
  document.getElementById('frmNoReport').style.display = "none";

  document.getElementById('target').src = url;
}

function setConsoleHistory(history) {
  console.log("setting history to", history);
  consoleHistory = history;
  document.getElementById("consoleHistoryCount").innerText = history.length;
  document.getElementById("consoleHistory").innerText = JSON.stringify(history, null, 2);// pretty print
}

document.getElementById("btnSubmit").addEventListener("click", submit);

document.getElementById("selCategory").onchange = function (event) {
  document.getElementById("selSubCategory").style.display = event.target.selectedIndex === 2 ? "inline-block" : "none";
}

function submit() {
  console.log("submitting ... ");

  if (document.getElementById('target').src.includes("white.png")) {
    // user has refreshed
    console.warn("screenshot missing");
    return;
  }

  var button = document.getElementById("btnSubmit");
  var text = document.getElementById("txtReason").value;

  console.log("reason: " + text);

  document.getElementById("frmBugReportFieldset").disabled = true;

  button.disabled = true;

  // Uploading base64 encoded image
  var base64image = document.getElementById('target').attr;

  console.log("console.history: " + consoleHistory.length);

  button.innerText = "Submitted!";
}