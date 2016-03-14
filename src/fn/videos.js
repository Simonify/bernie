import shuffle from 'lodash/shuffle';
import { fromJS } from 'immutable';
import { YOUTUBE } from 'constants/videos';

export default fromJS(shuffle([
  {
    type: YOUTUBE,
    id: '6qMA4ZSB_P4',
    tags: ['foreignpolicy', 'tpp']
  },
  {
    type: YOUTUBE,
    id: 'IWZmnzqCIhg',
    tags: ['humanrights', 'police', 'warondrugs']
  },
  {
    type: YOUTUBE,
    id: 'rSV6RZ1gIVM',
    tags: ['integrity', 'corruption', 'iraq', 'warondrugs']
  },
  {
    type: YOUTUBE,
    id: 'reYj6Jj5VTM',
    tags: ['honesty']
  },
  {
    type: YOUTUBE,
    id: '5LHsf18JpUQ',
    tags: ['equality']
  },
  {
    type: YOUTUBE,
    id: 'wWBo7vi_g1c',
    image: 'https://i.ytimg.com/vi/wWBo7vi_g1c/hqdefault.jpg',
    tags: ['labour', 'medicare', 'healthcare']
  },
  {
    type: YOUTUBE,
    id: 'ZH7QqYVPT90',
    tags: ['wallstreet', 'healthcare', 'college']
  },
  {
    type: YOUTUBE,
    id: 'mKE_7gn90Bs',
    tags: ['honesty']
  },
  {
    type: YOUTUBE,
    id: '_iJfAJYd1DE',
    tags: ['heathcare', 'minimumwage']
  },
  {
    type: YOUTUBE,
    id: 'cKf4kAZhp4I',
    tags: ['college', 'education']
  },
  {
    type: YOUTUBE,
    id: 'ryJH6d1VkZI',
    image: 'https://i.ytimg.com/vi/ryJH6d1VkZI/hqdefault.jpg',
    tags: ['honesty', 'education', 'healthcare', 'change']
  },
  {
    type: YOUTUBE,
    id: 'NabnhREkIsE',
    tags: ['healthcare', 'warondrugs']
  },
  {
    type: YOUTUBE,
    id: 'wfELl2v5wn0',
    tags: ['iraq', 'equality', 'integrity', 'prochoice', 'LGBT']
  },
  {
    type: YOUTUBE,
    id: 'yDw_6oHWYJk',
    tags: ['wallstreet', 'grassroots']
  },
  {
    type: YOUTUBE,
    id: 'f_4HatSD3wo',
    tags: ['grassroots', 'citizensunited']
  },
  {
    type: YOUTUBE,
    id: 'PO40vGZkRWc',
    tags: ['college']
  }
]));
