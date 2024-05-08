// ==UserScript==
// @name     Last.FM Utils
// @version  1
// @grant    none
// @include https://www.last.fm/user/*
// ==/UserScript==

'use strict';

// Adds the function to the host page, wrapped in a <script> node.
// Everything needs to be defined this way, even helper functions.
function define(func) {
  let scriptNode = document.createElement('script');
  scriptNode.type = "text/javascript";
  scriptNode.textContent = func.toString();
  let target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
  target.appendChild(scriptNode);
}

define(function getChartlistRows() {
  return [...document.querySelectorAll('.chartlist-row')];
});

define(function getArtistName(row) {
  let link = row.querySelector('.chartlist-artist a');
  return link ? link.textContent : '';
});

define(function getTitle(row) {
  let link = row.querySelector('.chartlist-name a');
  return link ? link.textContent : '';
});

define(function getTimestamp(row) {
  let label = row.querySelector('.chartlist-timestamp span');
  // The title text is a timestamp in a predictable format (e.g.
  // "Tuesday 7 May 2024, 11:37pm") in contrast to the user-visible
  // text which is looser and relative (e.g. "3 minutes ago").
  return label ? (label.title || label.textContent) : '';
});

define(function deleteRow(row) {
  var link = row.querySelector('.more-item--delete');
  if (link) {
    link.click();
  }
});

// Gets summary info on all the scrobbles on the current page.
define(function getSummary() {
  return getChartlistRows().map(row => {
    return {
      artist: getArtistName(row),
      title: getTitle(row),
      timestamp: getTimestamp(row),
      delete: () => deleteRow(row),
      domNode: row
    };
  });
});
