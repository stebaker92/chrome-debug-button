// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function setScreenshotUrl(url) {
  document.getElementById('target').src = url;
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

  button.disabled = true;

  button.innerText = "Submitted!";

}