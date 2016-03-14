import videos from './videos';

export default function getVideoById(id) {
  return videos.find((video) => video.get('id') === id);
}
