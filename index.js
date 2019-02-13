const { Model } = require('./dist/ModelManagers/Model.js')
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

let post = new Post;
let response = post.with('author', 'tags', 'comments').select('title').all().getUrl();
console.log(response)
// response
//    .then((response) => {
//       // response.title = 'Um novo dia para perder um dia YEAH';
//       // response.save().send()
//         // .then(result => console.log(result))
//       console.log(response)
//    });











