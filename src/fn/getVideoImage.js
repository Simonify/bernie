import { YOUTUBE } from 'constants/videos';

export default function getVideoImage(video) {
  if (video.has('image')) {
    return video.get('image');
  }

  switch (video.get('type')) {
    case YOUTUBE:
      return `https://i.ytimg.com/vi/${video.get('id')}/maxresdefault.jpg`;
    default:
      return null;
  }
}
