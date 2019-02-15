
import { isEmpty, forOwn, isObject, isNull } from 'lodash';
import { Paginate } from '../Interfaces/index';
import { Model } from '../ModelManagers/Model';

/**
 *
 */
export default class QueryBuilder {
  /**
   * @type {string}
   */
  public query: string = '';

  /**
   * @type {Array<string>}
   */
  public includes!: Array<string>;

  /**
   * @type {string}
   */
  public sort!: string;

  /**
   * @type {Array<string>}
   */
  public filters!: Array<string>;

  /**
   * @type {Array<string>}
   */  
  public fields!: Array<string>;

  /**
   * @type {Paginate}
   */
  public pagination!: Paginate;

  /**
   *
   */
  constructor() {}

  /**
   * @param  {Model} self
   * @returns string
   */
  public getQuery(self: Model): string {
    let query = '';

    query += this.resolveIncludes(self.queryBuilder.includes);
    query += this.resolveFields(self.queryBuilder.fields);
    query += this.resolveFilters(self.queryBuilder.filters);
    query += this.resolvePagination(self.queryBuilder.pagination);
    query += this.resolveSort(self.queryBuilder.sort);
    
    if (query.length) {
      self.queryBuilder.query = `?${encodeURI(query)}`;
    }
    
    return self.queryBuilder.query;
  }

  /**
   * @param  {string} query
   */
  private setAmpersand(query: string) {
    if (query.length) {
      return '&'
    }
    return '';
  }

  /**
   * @param  {Model} self
   */
  public resetQuery(self: Model) {
    self.queryBuilder.query = '';
    self.queryBuilder.includes = [];
    self.queryBuilder.sort = '';
    self.queryBuilder.filters = [];
    self.queryBuilder.fields = [];
    self.queryBuilder.pagination = {number: NaN, size: NaN};
  }
  
  /**
   * @param  {any} fields
   * @returns string
   */
  public resolveFields(fields: any): string {
    let resolveFields = '';

    forOwn(fields, (fields, resource) => {
      resolveFields += `&fields[${resource}]=${fields.toString()}`;
    });

    if (!isEmpty(resolveFields)) {
      return `${this.setAmpersand(this.query)}${resolveFields}`;
    }

    return ''
  }
  
  /**
   * @param  {Array<string>} filters
   * @returns string
   */
  public resolveFilters(filters: Array<string>): string {
    let resolveFilters = '';

    forOwn(filters, (value, filter) => {
        if (isObject(value)) {
            forOwn(value, (innerValue: Array<string>, innerFilter) => {
                resolveFilters += `filter[${filter}][${innerFilter}]=${innerValue.toString()}`;
            });
        } else {
            resolveFilters += (isNull(value)) ? `filter[${filter}]` : `filter[${filter}]=${value.toString()}`;
        }
    });

    if (!isEmpty(resolveFilters)) {
        return `${this.setAmpersand(this.query)}${resolveFilters}`;
    }

    return ''
  }
  
  /**
   * @param  {Array<string>} includes
   * @returns string
   */
  public resolveIncludes(includes: Array<string>): string {
    if (!isEmpty(includes)) {
      return `${this.setAmpersand(this.query)}include=${includes.toString()}`;
    }

    return ''
  }
  
  /**
   * @param  {Paginate} pagination
   * @returns string
   */
  public resolvePagination(pagination: Paginate): string {
    if (!isEmpty(pagination)) {
      return `${this.setAmpersand(this.query)}page[size]=${pagination.size}&page[number]=${pagination.number}`;
    }
    
    return ''
  }

  /**
   * @param  {string} sort
   * @returns string
   */
  public resolveSort(sort: string): string {
    if (!isEmpty(sort)) {
      return `${this.setAmpersand(this.query)}sort=${sort}`;
    }

    return ''
  }
}
