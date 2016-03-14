import { windowFocused, windowBlurred } from 'actions/app';

export default function createFocusListener({ dispatch }) {
  window.addEventListener('focus', () => dispatch(windowFocused()));
  window.addEventListener('blur', () => dispatch(windowBlurred()));
}
