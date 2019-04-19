const {Model} = require('./dist/ModelManagers/Model.js')
const _ = require('lodash')
const Axios = require('axios');

class Entity extends Model {

  async request (config) {
    return Axios.request(config);
  }

  get baseUrl(){
    return 'http://192.168.10.224:8000/api';
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

// let url = 'http://192.168.10.224:8000/api/posts'

// Axios.get(url)
// .then((tes) => {
//   console.log(tes.data)
// })
// .catch(result => {
//   console.log(result);
// })

let post1 = new Post;
let url = post1.select('title', 'slug').all().getUrl();
let post2 = post1.select('title', 'slug').all().getContent();
// // let post2 = post1.paginate(3,1).getContent();
console.log(url)

post2
.then(result => {
  console.log(result);
})
.catch(result => {
  console.log(result.response.data.message);
  // console.log(result.response.data.trace);
})









