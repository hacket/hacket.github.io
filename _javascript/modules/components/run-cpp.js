/*
 * Run C++ code with Coliru.
 * Reference: The Rust Programming Language -> https://doc.rust-lang.org/book/
 * API: https://coliru.stacked-crooked.com/
 */

const btnSelector = '.code-header button.button-run-cpp';

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

/**
 * @param {HTMLButtonElement} btn
 * @param {HTMLDivElement} codeBlock
 * @param {HTMLParagraphElement} resultBlock
 * @param {string} errorPrompt
 */
function run_cpp_code(codeBlock, resultBlock, btn, errorPrompt) {
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

  let params = {
    cmd: 'g++ -std=c++20 main.cpp && ./a.out',
    src: text
  };

  let http = new XMLHttpRequest();
  http.open('POST', 'https://coliru.stacked-crooked.com/compile', true);
  http.onload = () => {
    resultBlock.innerText = http.responseText;
    unlock(btn);
  };

  http.onerror = () => {
    resultBlock.innerText = errorPrompt + http.responseText;
    unlock(btn);
  };
  http.send(JSON.stringify(params));
}

export function runCpp() {
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
      run_cpp_code(codeBlock, p, btn, btn.getAttribute('error-prompt'));
    }
  })
}