import Handling from './Handling';
import QueryModifier from '../QueryManagers/QueryModifier'
import QueryBuilder from '../QueryManagers/QueryBuilder';
import { Config, ModelSignature } from '../Interfaces/index';
import { TypeError } from '@kernel-js/exceptions';
import { ResolveArray } from '../helpers/index';

/**
 *
 */
export abstract class Model implements ModelSignature {
    
  /**
   * @type {Handling}
   */
  protected handling: Handling;

  /**
   * @type {QueryModifier}
   */
  protected queryModifier: QueryModifier;

  /**
   * @type {QueryBuilder}
   */
  public queryBuilder: QueryBuilder;

  /**
   * @type {Number}
   */
  public id!: number;

  /**
   * @type {String}
   */
  public type!: string;

  /**
   * @type {Config}
   */
  public config!: Config;

  /**
   * @type {String}
   */
  get resourceName() {
    return '';
  };

  /**
   * @type {String}
   */
  abstract get baseUrl(): string;

  /**
   * @type {Array<string>}
   */
  abstract get fields(): Array<string>;

  /**
   * @type {Array<string>}
   */
  abstract get relationshipNames(): Array<string>;

  /**
   *
   */
  constructor() {
    this.queryBuilder = new QueryBuilder();
    this.queryModifier = new QueryModifier(this.resourceName);
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
   * @returns Promise
   */
  protected abstract async request(config: Config): Promise<any>;

  /**
   * @param  {boolean=true} hydrate
   * @returns Promise
   */
  protected async getEntity(hydrate:boolean = true): Promise<any> {
    let response = await this.request(this.config);
    return (response.data) ? this.handling.respond(this, response.data, hydrate) : response;
  }

  /**
   * @returns Promise
   */
  protected getContent(): Promise<any> {
    return this.getEntity(false);
  }

  /**
   * @returns string
   */
  protected getUrl(): any {
    return this.config;
  }

  /**
   * @returns Model
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
   * @returns Model
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
   * @param  {number} id
   * @returns Model
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
   * @returns Model
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
   * @param  {number} perPage
   * @param  {number} page
   * @returns Model
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
  
  /**
   * @param  {Array<string>} ...includes
   * @returns Model
   */
  @ResolveArray()
  protected with(...includes: Array<string>): Model {
    this.queryBuilder.includes = this.queryModifier.include(includes)
    return this;
  }

  /**
   * @param  {Array<string>} ...fields
   * @returns Model
   */
  @ResolveArray()
  protected select(...fields: Array<string>): Model {
    this.queryBuilder.fields = this.queryModifier.select(fields);
    return this;
  }

  /**
   * @param  {Array<string>} ...column
   * @returns Model
   */
  @ResolveArray()
  protected orderByAsc(...column: Array<string>): Model {
    this._orderBy('asc', ...column);
    return this;
  }

  /**
   * @param  {Array<string>} ...column
   * @returns Model
   */
  @ResolveArray()
  protected orderByDesc(...column: Array<string>): Model {
    this._orderBy('desc', ...column);
    return this;
  }

  /**
   * @param  {string} key
   * @param  {string} value
   * @returns Model
   */
  protected where(key: string, value: string): Model {
    this.queryBuilder.filters = this.queryModifier.filter(key, value);
    return this;
  }

  /**
   * @param  {string} value
   * @returns Model
   */
  protected limit(value: string): Model {
    this.queryBuilder.filters = this.queryModifier.filter('limit', value);
    return this;
  }

  /**
   * @param  {string} direction
   * @param  {Array<string>} ...column
   * @returns Model
   */
  private _orderBy(direction: string, ...column: Array<string>): Model {
    this.queryBuilder.sort = this.queryModifier.orderBy(column, direction);
    return this;
  }
}
