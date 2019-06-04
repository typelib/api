const {Model} = require('./dist/ModelManagers/Model.js')
const _ = require('lodash')
const Axios = require('axios');

class Entity extends Model {

  async request (config) {
    Axios.defaults.headers.put['Content-Type'] = 'application/json';
    Axios.defaults.headers.post['Content-Type'] = 'application/json';
    Axios.defaults.headers.patch['Content-Type'] = 'application/json';
    return Axios.request(config);
  }

  get baseUrl(){
    return 'http://192.168.10.213:8000/api';
  } 

}

class Permission extends Entity{

  constructor() {
    super()
    this.id = 2
  }
  get resourceName() {
    return 'permissions';
  } 

  get fields() {
    return ['name', 'code'];
  }

  get relationshipNames() {
    return ['profile'];
  }

}

class Profile extends Entity {

  get resourceName() {
    return 'profiles'
  }

  get relationshipNames() {
    return ['permission'];
  }

  get fields()
  {
    return ['name']
  }

}

// constructor
let profile = new Profile();

// função get (com apenas um, para teste)
async function getProfile() {
  profile = await profile.find(1).getEntity();
}

// Mounted
getProfile()

// constructor
let permission = new Permission();

// função get (com apenas um, para teste)
async function getPermission() {
  permission = await permission.find(1).getEntity()
}

// Mounted
getPermission()

console.log('Loading SHOW')
setTimeout(() => {
  profile.createPivot(permission).then(res => console.log(res.status)).catch(res => {console.log(res)})
  console.log('Loading HIDE')
}, 2000)
