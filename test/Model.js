import chai from 'chai';
import chaiHttp from 'chai-http';
import EntityManager from '../src/EntityManager'
import Handling from "../src/ModelManagers/Handling";
import _ from 'lodash';

chai.use(chaiHttp);

describe('Requests', () => {
  it('all', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    entity.baseUrl = () => {
      return 'http://localhost/api'
    };

    let result = entity.all().getUrlConfig();

    chai.expect(result).to.deep.equal({ method: 'GET', url: 'http://localhost/api/posts/' });
  });

  it('find', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    entity.baseUrl = () => {
      return 'http://localhost/api'
    };

    let result = entity.find(1).getUrlConfig();

    chai.expect(result).to.deep.equal({ method: 'GET', url: 'http://localhost/api/posts/1' });
  });

  it('paginate', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    entity.baseUrl = () => {
      return 'http://localhost/api'
    };

    let result = entity.paginate(3, 1).getUrlConfig();

    chai.expect(result).to.deep.equal({ method: 'GET', url: 'http://localhost/api/posts/?&page%5Bsize%5D=3&page%5Bnumber%5D=1' });
  });

  it('create', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    entity.baseUrl = () => {
      return 'http://localhost/api'
    };

    let result = entity.save().getUrlConfig();

    chai.expect(result).to.deep.equal({ method: 'POST', url: 'http://localhost/api/posts/', data: '{}' });
  });

  it('update', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    entity.baseUrl = () => {
      return 'http://localhost/api'
    };
    entity.id = 1;

    let result = entity.save().getUrlConfig();

    chai.expect(result).to.deep.equal({ method: 'PUT', url: 'http://localhost/api/posts/1', data: '{"id":1}' });
  });

  it('delete', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    entity.baseUrl = () => {
      return 'http://localhost/api'
    };
    entity.id = 1;

    let result = entity.delete().getUrlConfig();

    chai.expect(result).to.deep.equal({ method: 'DELETE', url: 'http://localhost/api/posts/1' });
  });
});

const requestCollect = {
  data: [
    { type: 'posts',
      id: '1',
      attributes: {
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      },
      links: { self: '/api/posts/1' }
    },
    { type: 'posts',
      id: '2',
      attributes: {
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      },
      links: { self: '/api/posts/2' }
    },
    { type: 'posts',
      id: '3',
      attributes: {
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      },
      links: { self: '/api/posts/3' }
    }],
  meta: {
    pagination: {
      total: 10,
      count: 3,
      per_page: 3,
      current_page: 1,
      total_pages: 4
    }
  },
  links: {
    self: 'http://127.0.0.1:8000/api/posts?page%5Bsize%5D=3&page%5Bnumber%5D=1',
    first: 'http://127.0.0.1:8000/api/posts?page%5Bsize%5D=3&page%5Bnumber%5D=1',
    next: 'http://127.0.0.1:8000/api/posts?page%5Bsize%5D=3&page%5Bnumber%5D=2',
    last: 'http://127.0.0.1:8000/api/posts?page%5Bsize%5D=3&page%5Bnumber%5D=4'
  }
};
const requestOne = {
  data: { type: 'posts',
    id: '1',
    attributes: {
      title: 'Suscipit ad voluptatum est aliquam omnis.',
    },
    links: { self: '/api/posts/1' }
  }
};
const handling = new Handling();

describe('Handling', () => {
  it('respond without hydrate', () => {
    let entity = new EntityManager();

    let result = handling.respond(_.clone(entity), requestOne, false);

    chai.expect(result).to.deep.equal({
      id: '1',
      type: 'posts',
      title: 'Suscipit ad voluptatum est aliquam omnis.',
    });
  });

  it('respond with hydrate', () => {
    let entity = new EntityManager();

    let result = handling.respond(_.clone(entity), requestOne, true);

    chai.expect(result).to.deep.equal({
      queryBuilder: {
        query: '',
        includes: [],
        sort: [],
        filters: {},
        fields: {},
        pagination: {}
      },
      id: '1',
      type: 'posts',
      title: 'Suscipit ad voluptatum est aliquam omnis.',
    });
  });

  it('respond collect without hydrate', () => {
    let entity = new EntityManager();

    let result = handling.respond(_.clone(entity), requestCollect, false);

    chai.expect(result).to.deep.equal({
      '0':
        { id: '1',
          type: 'posts',
          title: 'Suscipit ad voluptatum est aliquam omnis.',
        },
      '1':
        { id: '2',
          type: 'posts',
          title: 'Suscipit ad voluptatum est aliquam omnis.',
        },
      '2':
        { id: '3',
          type: 'posts',
          title: 'Suscipit ad voluptatum est aliquam omnis.',
        }
    });
  });

  it('respond collect with hydrate', () => {
    let entity = new EntityManager();

    let result = handling.respond(_.clone(entity), requestCollect, true);

    chai.expect(result).to.deep.equal({
      '0': {
        queryBuilder: {
          query: '',
          includes: [],
          sort: [],
          filters: {},
          fields: {},
          pagination: {}
        },
        id: '1',
        type: 'posts',
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      },
      '1': {
        queryBuilder: {
          query: '',
          includes: [],
          sort: [],
          filters: {},
          fields: {},
          pagination: {}
        },
        id: '2',
        type: 'posts',
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      },
      '2':{
        queryBuilder: {
          query: '',
          includes: [],
          sort: [],
          filters: {},
          fields: {},
          pagination: {}
        },
        id: '3',
        type: 'posts',
        title: 'Suscipit ad voluptatum est aliquam omnis.',
      }
    });
  });

  it('serialize', () => {
    let entity = new EntityManager();
    entity.fields = () => {
      return ['title', 'subtitle', 'body'];
    };
    entity.relationshipNames = () => {
      return ['author', 'tags'];
    };

    entity.id = 1;
    entity.type = 'posts';
    entity.slug = 'suscipit-ad-voluptatum-est-aliquam-omnis';
    entity.title = 'Suscipit ad voluptatum est aliquam omnis.';
    entity.subtitle = 'Suscipit ad voluptatum est aliquam omnis.';
    entity.author = {id: 10, name: 'João'};

    let result = handling.serialize(entity);

    chai.expect(result).to.deep.equal('{"id":1,"type":"posts","title":"Suscipit ad voluptatum est aliquam omnis.","subtitle":"Suscipit ad voluptatum est aliquam omnis.","author":10}');
  });

});

describe('QueryModifiers', () => {
  it('with', () => {
    let entity = new EntityManager();
    const inputs = ['company', 'chief'];
    let result = entity.with(inputs);

    chai.expect(result.queryBuilder.includes).to.deep.equal([ 'company', 'chief' ]);
  });

  it('select', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    const inputs = ['title', 'subtitle'];
    let result = entity.select(inputs);
    chai.expect(result.queryBuilder.fields).to.deep.equal({ posts: 'title,subtitle' });
  });

  it('where with group', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    let result = entity.where('user', 'name');
    chai.expect(result.queryBuilder.filters).to.deep.equal({ user: 'name' });
  });

  it('where without group', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    let result = entity.where('permission', 'name', 'user');
    chai.expect(result.queryBuilder.filters).to.deep.equal({ user: { permission: 'name' } });
  });

  it('orderBy', () => {
    let entity = new EntityManager();
    entity.resourceName = () => {
      return 'posts'
    };
    const inputs = ['created_at', 'title'];
    let result = entity.orderBy(inputs);
    chai.expect(result.queryBuilder.sort).to.deep.equal([ 'created_at', 'title' ]);
  });
});

