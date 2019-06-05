import _ from 'lodash';
import chai from 'chai';
import Entity from './Entity';
import chaiHttp from 'chai-http';
import Handling from "../src/ModelManagers/Handling";
import { requestOne, requestCollect } from './DataFile';
import QueryBuilder from '../src/QueryManagers/QueryBuilder';

chai.use(chaiHttp);

describe('Requests', () => {
  it('all', () => {
    let entity = new Entity();

    let result = entity.all().getUrlConfig();

    chai.expect(result).to.deep.equal({ method: 'GET', url: 'http://localhost/api/posts/' });
  });

  it('find', () => {
    let entity = new Entity();

    let result = entity.find(1).getUrlConfig();

    chai.expect(result).to.deep.equal({ method: 'GET', url: 'http://localhost/api/posts/1' });
  });

  it('paginate', () => {
    let entity = new Entity();

    let result = entity.paginate(3, 1).getUrlConfig();
    chai.expect(result).to.deep.equal({ method: 'GET', url: 'http://localhost/api/posts/?page%5Bsize%5D=3&page%5Bnumber%5D=1' });
  });

  // it('create', () => {
  //   let entity = new Entity();

  //   entity.save().then((res: any) => {
  //     console.log(res);
  //   });

    
  //   chai.expect('result').to.deep.equal({ method: 'POST', url: 'http://localhost/api/posts/', data: '{}' });
  // });

  // it('update', () => {
  //   let entity = new Entity();
  //   entity.id = 1;

  //   let result = entity.save().getUrlConfig();

  //   chai.expect(result).to.deep.equal({ method: 'PUT', url: 'http://localhost/api/posts/1', data: '{"id":1}' });
  // });

  // it('delete', () => {
  //   let entity = new Entity();
  //   entity.id = 1;

  //   let result = entity.delete().getUrlConfig();

  //   chai.expect(result).to.deep.equal({ method: 'DELETE', url: 'http://localhost/api/posts/1' });
  // });
});

const handling = new Handling();

describe('Handling', () => {
  it('respond without hydrate', () => {
    let entity = new Entity();

    let result = handling.respond(_.clone(entity), requestOne, false);

    chai.expect(result).to.deep.equal({
      id: '1',
      type: 'posts',
      title: 'Suscipit ad voluptatum est aliquam omnis.',
    });
  });

  it('respond with hydrate', () => {
    let entity = new Entity();

    let result = JSON.stringify(handling.respond(_.clone(entity), requestOne, true));
    const expect = '{"attributes":{"id":"1","type":"posts","title":"Suscipit ad voluptatum est aliquam omnis."},"queryBuilder":{"query":""},"queryModifier":{"resourceName":"posts"},"handling":{},"id":"1"}';

    chai.expect(result).to.deep.equal(expect);
  });

  it('respond collect without hydrate', () => {
    let entity = new Entity();

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
    let entity = new Entity();

    let result = handling.respond(_.clone(entity), requestCollect, true);

    chai.expect(result).to.deep.equal({
      '0': {
        queryModifier: {
          resourceName: 'posts',
        },
        handling: {},
        id: '1',
        attributes: {
          id: '1',
          type: 'posts',
          title: 'Suscipit ad voluptatum est aliquam omnis.',
        },
        queryBuilder: {
          'query': ''
        }
      },
      '1': {
        queryModifier: {
          resourceName: 'posts',
        },
        handling: {},
        id: '2',
        attributes: {
          id: '2',
          type: 'posts',
          title: 'Suscipit ad voluptatum est aliquam omnis.',
        },
        queryBuilder: {
          'query': ''
        }
      },
      '2':{
        queryModifier: {
          resourceName: 'posts',
        },
        handling: {},
        id: '3',
        attributes: {
          id: '3',
          type: 'posts',
          title: 'Suscipit ad voluptatum est aliquam omnis.',
        },
        queryBuilder: {
          'query': ''
        }
      }
    });
  });

  it('serialize', () => {
    let entity = new Entity();

    entity.id = 1;
    entity.type = 'posts';
    entity.attributes.slug = 'suscipit-ad-voluptatum-est-aliquam-omnis';
    entity.attributes.title = 'Suscipit ad voluptatum est aliquam omnis.';
    entity.attributes.subtitle = 'Suscipit ad voluptatum est aliquam omnis.';

    let result = handling.serialize(entity);

    chai.expect(result).to.deep.equal('{"id":1,"type":"posts","title":"Suscipit ad voluptatum est aliquam omnis.","subtitle":"Suscipit ad voluptatum est aliquam omnis."}');
  });

});

describe('QueryModifiers', () => {
  it('with', () => {
    let entity = new Entity();
    let result = entity.with('company', 'chief');

    chai.expect(result.queryBuilder.includes).to.deep.equal([ 'company', 'chief' ]);
  });

  it('select', () => {
    let entity = new Entity();
    let result = entity.select('title', 'subtitle');

    chai.expect(result.queryBuilder.fields).to.deep.equal({ posts: 'title,subtitle' });
  });

  it('where with group', () => {
    let entity = new Entity();
    let result = entity.where('name', 'Jose');
    chai.expect(result.queryBuilder.filters).to.deep.equal({ name: 'Jose' });
  });

  // it('where without group', () => {
  //   let entity = new Entity();
  //   let result = entity.where('permission', 'Admin', 'user');
  //   chai.expect(result.queryBuilder.filters).to.deep.equal({ user: { permission: 'Admin' } });
  // });

  it('orderByAsc', () => {
    let entity = new Entity();
    const inputs = 'created_at';
    let result = entity.orderByAsc(inputs);
    chai.expect(result.queryBuilder.sort).to.deep.equal('created_at');
  });

  it('orderByDesc', () => {
    let entity = new Entity();
    const inputs = '-created_at';
    let result = entity.orderByAsc(inputs);
    chai.expect(result.queryBuilder.sort).to.deep.equal('-created_at');
  });
});

