/*
 * Run Rust code with Rust Playground.
 * Reference: The Rust Programming Language -> https://doc.rust-lang.org/book/
 * API: Rust Playground: https://play.rust-lang.org/
 */

const btnSelector = '.code-header button.button-run-rust';

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

function fetch_with_timeout(url, options, timeout = 20000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]);
}

/**
 * @param {HTMLButtonElement} btn
 * @param {HTMLDivElement} codeBlock
 * @param {HTMLParagraphElement} resultBlock
 * @param {string} errorPrompt
 */
function run_rust_code(codeBlock, resultBlock, btn, errorPrompt) {
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
    version: 'stable',
    optimize: '0',
    code: text,
    edition: '2021'
  };

  if (text.indexOf('#![feature') !== -1) {
    params.version = 'nightly';
  }

  fetch_with_timeout('https://play.rust-lang.org/evaluate.json', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(params)
  })
    .then(response => response.json())
    .then(response => {
      resultBlock.innerText = response.result;
      unlock(btn);
    })
    .catch(error => {
      resultBlock.innerText = errorPrompt + error.message;
      unlock(btn);
    });
}

export function runRust() {
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
      run_rust_code(codeBlock, p, btn, btn.getAttribute('error-prompt'));
    }
  })
}