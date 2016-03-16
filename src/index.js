import debug from 'debug';
import createApp from './createApp';
import './styles/index.css';
import 'react-select/dist/react-select.css';


if (process.env.BROWSER) {
  require('./vendor/facebook');
  require('./vendor/typekit');
}

const { NODE_ENV } = process.env;

if (NODE_ENV !== 'production') {
  debug.enable('dev');
}

window.__logger = false;
window.app = createApp(window._state);
