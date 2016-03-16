import { Schema, arrayOf } from 'normalizr';

const video = new Schema('videos');

export default {
  video, videos: arrayOf(video)
};
