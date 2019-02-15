const {Model} = require('./dist/ModelManagers/Model.js')
const _ = require('lodash')
const Axios = require('axios');

class Entity extends Model {

  async request (config) {
    return Axios.request(config);
  }

  get baseUrl(){
    return 'http://127.0.0.1:8000/api';
  } 

}

class Post extends Entity{

  constructor() {
    super()
    this.id = 2
  }
  get resourceName() {
    return 'posts';
  } 

  get fields() {
    return ['title', 'slug', 'subtitle', 'body', 'published_at'];
  }

  get relationshipNames() {
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

let post1 = new Post;
let post2 = post1.find(2).getEntity();

post2.then(result => {
  let response = result.save().getUrl();
  console.log(response)
})











