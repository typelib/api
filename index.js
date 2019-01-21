const EntityManager = require('./dist/EntityManager')
const _ = require('lodash')
const Axios = require('axios');

class Entity extends EntityManager {

  baseUrl() {
    return 'http://127.0.0.1:8000/api'
  }

}

class Post extends Entity{

  resourceName() {
    return 'posts'
  }

  async request (config) {
    return Axios.request(config);
  }

  fields() {
    return ['title', 'slug', 'subtitle', 'body', 'published_at']
  }

  relationshipNames() {
    return ['author', 'tags', 'comments'];
  }

}

class Tag extends Entity {

  resourceName() {
    return 'tags'
  }

  fields()
  {
    return ['name']
  }

}


let post = new Post;

let response = post.select(['title', 'published_at']).where('limit', 1).all().send()
response
   .then((response) => {
      // response.title = 'Um novo dia para perder um dia YEAH';
      // response.save().send()
        // .then(result => console.log(result))

      console.log(response)
   });











