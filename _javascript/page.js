import { basic, initSidebar, initTopbar } from './modules/layouts';
import {
  loadImg,
  imgPopup,
  initClipboard,
  loadMermaid,
  highlightLines,
  runCpp,
  runJavascript,
  runPython,
  runRust
} from './modules/components';

loadImg();
imgPopup();
initSidebar();
initTopbar();
initClipboard();
loadMermaid();
basic();
highlightLines();
runCpp();
runJavascript();
runPython();
runRust();
