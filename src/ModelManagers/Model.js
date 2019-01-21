import Handling from './Handling';
import QueryModifier from '../QueryManagers/QueryModifier'
import QueryBuilder from '../QueryManagers/QueryBuilder';
import TypeError from '@kernel-js/exceptions'

/**
 *
 * @type {Handling}
 */
const handling = new Handling();

/**
 *
 */
export default class Model extends QueryModifier{

  /**
   *
   */
  constructor() {
    super()
    this.queryBuilder = new QueryBuilder();
  }

  // Triggers

  /**
   *
   * @returns {Promise<any>}
   */
  async send(hydrate = true) {
    let response = await this.request(this.config);
    return (response.data) ? handling.respond(this, response.data, hydrate) : response;
  }

  /**
   *
   * @returns {Promise<any>}
   */
  getContent() {
    return this.send(false);
  }

  /**
   *
   * @returns {string}
   */
  getUrl() {
    return this.config.url;
  }

  /**
   *
   * @returns {*}
   */
  getUrlConfig() {
    return this.config;
  }

  // Constructors

  /**
   *
   * @returns {Model}
   */
  all() {
    this.config = {
      method: 'GET',
      url: `${this.resourceUrl()}${this.queryBuilder.getQuery(this)}`,
    };

    this.queryBuilder.resetQuery(this);

    return this;
  }

  /**
   *
   * @returns {Model}
   */
  save() {
    if (this.hasOwnProperty('id')) {
      this.config = {
        method: 'PUT',
        url: `${this.resourceUrl()}${this.id}`,
        data: handling.serialize(this)
      };
    } else {
      this.config = {
        method: 'POST',
        url: `${this.resourceUrl()}`,
        data: handling.serialize(this)
      };
    }

    this.queryBuilder.resetQuery(this);

    return this;
  }

  /**
   *
   * @param id
   * @returns {Model}
   */
  find(id) {
    if (typeof id !== 'number') {
      throw new TypeError(`Argument 1 passed must be of the type number, ${typeof id} given`, 500);
    }

    this.config = {
      method: 'GET',
      url: `${this.resourceUrl()}${id}${this.queryBuilder.getQuery(this)}`
    };

    this.queryBuilder.resetQuery(this);

    return this;
  }

  /**
   *
   * @returns {Model}
   */
  delete() {
    this.config = {
      method: 'DELETE',
      url: `${this.resourceUrl()}${this.id}`
    };

    this.queryBuilder.resetQuery(this);

    return this;
  }

  /**
   *
   * @param perPage
   * @param page
   * @returns {Model}
   */
  paginate(perPage, page) {
    if (typeof perPage !== 'number') {
      throw new TypeError(`Argument 1 passed must be of the type number, ${typeof id} given`, 500);
    }

    if (typeof page !== 'number') {
      throw new TypeError(`Argument 2 passed must be of the type number, ${typeof id} given`, 500);
    }

    this.queryBuilder.pagination = {
      size: perPage,
      number: page
    }

    this.config = {
      method: 'GET',
      url: `${this.resourceUrl()}${this.queryBuilder.getQuery(this)}`
    };

    this.queryBuilder.resetQuery(this);

    return this;
  }

}
