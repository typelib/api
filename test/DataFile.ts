import { AxiosResponse } from 'axios';

const requestCollect: AxiosResponse<any> = {
  data: [
    {
      type: 'posts',
      id: '1',
      attributes: {
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      },
      links: { self: '/api/posts/1' },
    },
    {
      type: 'posts',
      id: '2',
      attributes: {
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      },
      links: { self: '/api/posts/2' },
    },
    {
      type: 'posts',
      id: '3',
      attributes: {
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      },
      links: { self: '/api/posts/3' },
    }
  ],
  status: 200,
  statusText: '',
  headers: {},
  config: {},
  // meta: {
  //   pagination: {
  //     total: 10,
  //     count: 3,
  //     per_page: 3,
  //     current_page: 1,
  //     total_pages: 4
  //   }
  // },
  // links: {
  //   self: 'http://127.0.0.1:8000/api/posts?page%5Bsize%5D=3&page%5Bnumber%5D=1',
  // }
};

const requestOne: AxiosResponse<any> = {
  data: {
    type: 'posts',
    id: '1',
    attributes: {
      title: 'Suscipit ad voluptatum est aliquam omnis.',
    },
    links: { self: '/api/posts/1' }
  },
  status: 200,
  statusText: 'Ok',
  headers: {},
  config: {}
};

export {
  requestOne,
  requestCollect,
}
