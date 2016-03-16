import { normalize } from 'normalizr';
import { CALL_SERVER } from 'constants/middleware';
import schema from 'utils/schemas';
import {
  FETCH_VIDEOS, FETCH_VIDEOS_SUCCESS, FETCH_VIDEOS_FAILURE,
  FETCH_VIDEO, FETCH_VIDEO_SUCCESS, FETCH_VIDEO_FAILURE
} from 'constants/videos';

export function fetchVideos() {
  return (dispatch) => dispatch({
    [CALL_SERVER]: {
      types: [FETCH_VIDEOS, FETCH_VIDEOS_SUCCESS, FETCH_VIDEOS_FAILURE],
      method: 'get',
      action: 'videos',
      schema, response: ({ videos }) => ({ videos })
    }
  });
}

export function fetchVideo(id) {
  return (dispatch) => dispatch({
    [CALL_SERVER]: {
      types: [FETCH_VIDEO, FETCH_VIDEO_SUCCESS, FETCH_VIDEO_FAILURE],
      method: 'get',
      action: `videos/${id}`,
      schema, response: (video) => ({ video })
    }
  });
}
