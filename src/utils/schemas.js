import { Schema, arrayOf } from 'normalizr';

const user = new Schema('users');
const event = new Schema('events');

export default {
  user, event,
  events: arrayOf(event),
  users: arrayOf(user)
};
