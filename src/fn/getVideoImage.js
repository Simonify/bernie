import { YOUTUBE, RECORDER } from 'constants/videos';

export default function getVideoImage(video, { staticHost } = {}) {
  if (video.has('image')) {
    return video.get('image');
  }

  switch (video.get('type')) {
    case YOUTUBE:
      return `https://i.ytimg.com/vi/${video.get('service_id')}/maxresdefault.jpg`;
    case RECORDER:
      return `${staticHost || ''}/${video.get('id')}/1.png`;
    default:
      return null;
  }
}
