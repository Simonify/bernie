import { WINDOW_FOCUSED, WINDOW_BLURRED } from 'constants/app';

export function windowFocused() {
  return { type: WINDOW_FOCUSED };
}

export function windowBlurred() {
  return { type: WINDOW_BLURRED };
}
