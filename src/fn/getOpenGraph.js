import { RECORDER, YOUTUBE } from 'constants/videos';
import getVideoImage from './getVideoImage';

export default function getOpenGraph(video, config) {
  const tags = [
    { property: 'og:title', content: `Why I'm voting for Bernie Sanders` },
    { property: 'og:type', content: `video.other` },
    { property: 'og:image', content: getVideoImage(video, config) }
  ];

  switch (video.get('type')) {
    case YOUTUBE:
      tags.push({ property: 'og:video', content: `https://www.youtube.com/v/${video.get('id')}` });
      break;
    case RECORDER: {
      const content = `${config.staticHost || ''}/${video.get('id')}/video.mp4`;
      tags.push({ property: 'og:video', content });
      break;
    }
  }

  return tags;
}
