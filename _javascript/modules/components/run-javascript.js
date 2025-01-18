/*
 * Run JavaScript code locally.
 */

"use strict";

const btnSelector = '.code-header button.button-run-javascript';

const LOCK = 'lock';
const TIMEOUT = 20000; // in milliseconds

/**
 * @param {HTMLButtonElement} node 
 */
function isLocked(node) {
  if (node.hasAttribute(LOCK)) {
    let timeout = node.getAttribute(LOCK);
    if (Number(timeout) + 5000 > Date.now()) {
      return true;
    }
  }
  return false;
}

/**
 * @param {HTMLButtonElement} node 
 */
function lock(node) {
  node.setAttribute(LOCK, Date.now() + TIMEOUT);
  node.getElementsByTagName('i')[0].classList.replace('icon-playfill', 'icon-loading1');
}

/**
 * @param {HTMLButtonElement} node 
 */
function unlock(node) {
  node.removeAttribute(LOCK);
  node.getElementsByTagName('i')[0].classList.replace('icon-loading1', 'icon-playfill');
}

/**
 * @param {HTMLButtonElement} btn 
 * @return {HTMLDetailsElement}
 */
function getOutputFrame(btn) {
  /**
   * @type {HTMLDetailsElement}
   */
  let outputFrame = btn.parentNode.parentNode.nextElementSibling;
  if (outputFrame == undefined || !(outputFrame.tagName == 'DETAILS' && outputFrame.className == 'run-output')) {
    let referElement = outputFrame;
    outputFrame = document.createElement('details');
    outputFrame.className = 'run-output';
    let summary = document.createElement('summary');
    summary.textContent = btn.getAttribute('output-title');
    outputFrame.appendChild(summary);
    if (referElement == undefined) {
      btn.parentNode.parentNode.parentNode.appendChild(outputFrame);
    } else {
      referElement.parentNode.insertBefore(outputFrame, referElement);
    }
  }

  outputFrame.setAttribute('open', 'open');
  return outputFrame;
}

function log() {
  console.logs.push(Array.from(arguments));
  console.stdlog.apply(console, arguments);
}

export function runJavascript() {
  /**
   * @type {NodeListOf<HTMLButtonElement>}
   */
  let buttons = document.querySelectorAll(btnSelector);
  [...buttons].forEach((btn) => {
    btn.onclick = () => {
      if (isLocked(btn)) {
        return;
      }

      lock(btn);
      let outputFrame = getOutputFrame(btn);
      for (let p of outputFrame.getElementsByTagName('p')) {
        outputFrame.removeChild(p)
      }
      let p = document.createElement('p');
      p.innerText = btn.getAttribute('wait-message');
      outputFrame.appendChild(p);
      let codeBlock = btn.parentNode.nextElementSibling;
      let preBlock = codeBlock.getElementsByTagName('pre');
      let text;
      if (preBlock.length == 2) {
        text = preBlock[1].innerText;
      } else if (preBlock.length == 1) {
        text = preBlock[0].innerText;
      } else {
        unlock(btn);
        return;
      }
      let F = new Function(text);
      if (console.log != log) {
        console.stdlog = console.log.bind(console);
        console.log = log;
      }
      console.logs = [];
      F();
      p.innerText = console.logs.join('\n');
      unlock(btn);
    }
  })
}