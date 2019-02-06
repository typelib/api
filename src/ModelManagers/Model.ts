import Handling from './Handling';
import QueryModifier from '../QueryManagers/QueryModifier'
import QueryBuilder from '../QueryManagers/QueryBuilder';
import { AxiosPromise } from 'axios';
import { Config } from '../Interfaces/index';
import { TypeError } from '@kernel-js/exceptions';
import { Validate } from '../helpers/index';

/**
 *
 */
export abstract class Model {
    
  /**
   *
   * @type {Handling}
   */
  protected handling: Handling;

  /**
   * 
   * @type {QueryBuilder}
   */
  public queryBuilder: QueryBuilder;

  /**
   * 
   * @type {Number}
   */
  public id: number;

  /**
   * 
   * @type {String}
   */
  public type: string;

  /**
   * 
   * @type {Config}
   */
  public config: Config;

  /**
   * 
   * @type {String}
   */
  abstract get resourceName(): string

  /**
   * 
   * @type {String}
   */
  abstract get baseUrl(): string;

  /**
   * 
   * @type {Array<string>}
   */
  abstract get fields(): Array<string>;

  /**
   * 
   * @type {Array<string>}
   */
  abstract get relationshipNames(): Array<string>;

  /**
   *
   */
  constructor() {

    this.queryBuilder = new QueryBuilder();
    this.handling = new Handling();
  }

  /**
   * @returns string
   */
  protected resourceUrl(): string {
    return `${this.baseUrl}/${this.resourceName}/`
  }

  /**
   * @param  {Config} config
   * @returns AxiosPromise
   */
  protected abstract async request(config: Config): Promise<any>;

  // Triggers

  /**
   *
   * @returns {Promise<any>}
   */
  protected async send(hydrate = true): Promise<any> {
    let response = await this.request(this.config);
    console.log(response, 'w');
    return (response.data) ? this.handling.respond(this, response.data, hydrate) : response;
  }

  /**
   *
   * @returns {Promise<any>}
   */
  protected getContent(): Promise<any> {
    return this.send(false);
  }

  /**
   *
   * @returns {string}
   */
  protected getUrl(): string {
    return this.config.url;
  }

  /**
   *
   * @returns {*}
   */
  protected getUrlConfig(): any {
    return this.config;
  }

  // Constructors

  /**
   *
   * @returns {Model}
   */
  protected all(): Model {
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
  protected save(): Model {
    if (this.hasOwnProperty('id')) {
      this.config = {
        method: 'PUT',
        url: `${this.resourceUrl()}${this.id}`,
        data: this.handling.serialize(this)
      };
    } else {
      this.config = {
        method: 'POST',
        url: `${this.resourceUrl()}`,
        data: this.handling.serialize(this)
      };
    }

    this.queryBuilder.resetQuery(this);

    return this;
  }

  /**
   * @returns {Model}
   * @param id 
   */
  protected find(id: number): Model {
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
  protected delete(): Model {
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
  protected paginate(perPage: number, page: number): Model {
    if (typeof perPage !== 'number') {
      throw new TypeError(`Argument 1 passed must be of the type number, ${typeof this.id} given`, 500);
    }

    if (typeof page !== 'number') {
      throw new TypeError(`Argument 2 passed must be of the type number, ${typeof this.id} given`, 500);
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

  // Modificadores

  @Validate()
  protected with(includes: Array<string>): Model {
    this.queryBuilder.includes = QueryModifier.with(includes)
    return this;
  }

  // @Validate()
  // protected select(fields: Array<string>): Model {
  //   this.queryBuilder.fields = QueryModifier.select(fields);
  //   return this;
  // }

  // @Validate()
  protected orderBy(column: Array<string>, direction: string = 'asc'): Model {
    this.queryBuilder.sort = QueryModifier.orderBy(column, direction);
    return this;
  }

  // @Validate()
  // protected where(key: string, value: string | null = null, group = null): Model {
  //   this.queryBuilder.filters = QueryModifier.where(key, value, group);
  //   return this;
  // }

}
