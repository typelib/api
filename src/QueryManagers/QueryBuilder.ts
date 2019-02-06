
import { isEmpty, forOwn } from 'lodash';
import { TypeError } from '@kernel-js/exceptions';
import { Paginate } from '../Interfaces/index';
import { Model } from '../ModelManagers/Model';

/**
 *
 */
export default class QueryBuilder {
  public query: string;
  public includes: Array<string>;
  public sort: Array<string>;
  public filters: Array<string>;
  public fields: Array<string>;
  public pagination: Paginate;

  /**
   *
   */
  constructor() {}
  
  /**
   *
   * @param self
   * @returns {string}
   */
  public getQuery(self: Model): string
  {
    let query = '';

    query += this.resolveIncludes(self.queryBuilder.includes);
    // query += this.resolveFields(self.queryBuilder.fields);
    // query += this.resolveFilters(self.queryBuilder.filters);
    // query += this.resolvePagination(self.queryBuilder.pagination);
    query += this.resolveSort(self.queryBuilder.sort);
    
    if (query.length) {
      self.queryBuilder.query = `?${encodeURI(query)}`;
    }
    
    return self.queryBuilder.query;
  }
  
  /**
   *
   * @param self
   */
  public resetQuery(self: Model)
  {
    self.queryBuilder.query = '';
    self.queryBuilder.includes = [];
    self.queryBuilder.sort = [];
    self.queryBuilder.filters = [];
    self.queryBuilder.fields = [];
    self.queryBuilder.pagination = {number: NaN, size: NaN};
  }
  
  /**
   *
   * @param fields
   * @returns {string}
   */
  public resolveFields(fields: Array<string>): string
  {
    if(!(typeof fields === 'object')) {
      throw new TypeError('Value passed is a not a object')
    }

    let resolveFields = '';

    // forOwn(fields, (fields, resource) => {
    //   resolveFields += `&fields[${resource}]=${fields.toString()}`;
    // });

    if (!isEmpty(resolveFields)) {
      return resolveFields;
    }

    return ''
  }
  
  /**
   *
   * @param filters
   * @returns {string}
   */
  public resolveFilters(filters: Array<string>): string
  {
    let resolveFilters = '';

    // forOwn(filters, (value, filter) => {
    //     if (isObject(value)) {
    //         forOwn(value, (innerValue, innerFilter) => {
    //             resolveFilters += `&filter[${filter}][${innerFilter}]=${innerValue.toString()}`;
    //         });
    //     } else {
    //         resolveFilters += (isNull(value)) ? `&filter[${filter}]` : `&filter[${filter}]=${value.toString()}`;
    //     }
    // });

    if (!isEmpty(resolveFilters)) {
        return resolveFilters;
    }

    return ''
  }
  
  /**
   *
   * @param includes
   * @returns {string}
   */
  public resolveIncludes(includes: Array<string>): string
  {
    // if(!((typeof includes === 'object'))) {
    //   throw new TypeError('Value passed is a not a object')
    // }

    if (!isEmpty(includes)) {
      return `include=${includes.toString()}`;
    }

    return ''
  }
  
  /**
   *
   * @param pagination
   * @returns {string}
   */
  public resolvePagination(pagination: Paginate): string
  {
    // if(!(typeof pagination === 'object')) {
    //   throw new TypeError('Value passed is a not a object')
    // }

    if (!isEmpty(pagination)) {
      return `&page[size]=${pagination.size}&page[number]=${pagination.number}`;
    }
    
    return ''
  }
  
  /**
   *
   * @param sort
   * @returns {string}
   */
  public resolveSort(sort: Array<string>): string
  {
    // if(!(typeof sort === 'object')) {
    //   throw new TypeError('Value passed is a not a string')
    // }

    if (!isEmpty(sort)) {
      return `&sort=${sort.toString()}`;
    }

    return ''
  }
}
