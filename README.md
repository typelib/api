# @kernel-js/api<br />
[![Build Status](https://travis-ci.org/kernel-js/API.svg?branch=master)](https://travis-ci.org/kernel-js/API)
[![Coverage Status](https://coveralls.io/repos/github/kernel-js/API/badge.svg?branch=master)](https://coveralls.io/github/kernel-js/API?branch=master)
<br />

> Package to easily develop REST API following JSON API specification.

## Why

First of all I created this to support development of [Kernel Framework](https://www.npmjs.com/package/@kernel-js/framework).<br />
Just like the rest of the packages that make up the framework, I make the most of other existing libraries that are well 
tested on a day-to-day basis. The idea is not to reinvent the wheel, just join the ideas in a lightweight framework 
(the focus is on the client side), simple to use and make the code on the front more beautiful and organized. 

## Install
```npm install @kernel-js/api```


## Class Directory

### Common Class

* [EntityManager](entitymanager)

### Common Triggers Methods 
* [send](#send)
* [getContent](#getContent)
* [getUrl](#getUrl)
* [getUrlConfig](#getUrlConfig)

### Common Request Methods 

* [all](#all)
* [save](#save)
* [find](#find)
* [delete](#delete)
* [paginate](#paginate)

### Common Fetching Methods

* [with](#with)
* [select](#select)
* [orderBy](#orderBy)
* [where](#where)

## Building Classes

### Base Entity Class

É necessario criar uma classe que herdará e sobrescreverá os metodos dessa classa dentro da sua aplicação
Essa mesma classe vai ser herdada pelas entidades da aplicação.


```js
export default class Entity extends EntityManager {

  async request (config) {
    return Axios.request(config); // Você retornará a instancia do axios na sua aplicação
  }

  baseUrl() {
    return 'http://127.0.0.1:8000/api'
  }

}
```

### Aplication Entity Class

Você sobreescreverá os metodos de entity na sua aplication-entity (user) informando os dados e relacionamentos da mesma.


```js
export default class Post extends Entity{

    resourceName() {
      return 'users';
    }
    
    fields() {
      return ['name', 'email', 'subnick'];
    }
    
    relationshipNames() {
      return ['company', 'owner'];
    }

}
```


## Authors

This library was developed by 

* Gustavo Siqueira
* Bruno Santos
* Carlos Henrique Escouto

## Contribute

Please do! Check out our [Contributing guidelines](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2018-2018 Kernel JS
