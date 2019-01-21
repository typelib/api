import _ from 'lodash'
import TypeError from '@kernel-js/exceptions'

/**
 *
 */
export default class QueryBuilder {
  /**
   *
   */
  constructor() {
    this.query = '';
    this.includes = [];
    this.sort = [];
    this.filters = {};
    this.fields = {};
    this.pagination = {};
  }
  
  /**
   *
   * @param self
   * @returns {string}
   */
  getQuery(self)
  {
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
   *
   * @param self
   */
  resetQuery(self)
  {
    self.queryBuilder.query = '';
    self.queryBuilder.includes = [];
    self.queryBuilder.sort = [];
    self.queryBuilder.filters = {};
    self.queryBuilder.fields = {};
    self.queryBuilder.pagination = {};
  }
  
  /**
   *
   * @param fields
   * @returns {string}
   */
  resolveFields(fields)
  {
    if(!(typeof fields === 'object')) {
      throw new TypeError('Value passed is a not a object')
    }

    let resolveFields = '';

    _.forOwn(fields, (fields, resource) => {
      resolveFields += `&fields[${resource}]=${fields.toString()}`;
    });

    if (!_.isEmpty(resolveFields)) {
      return resolveFields;
    }

    return ''
  }
  
  /**
   *
   * @param filters
   * @returns {string}
   */
  resolveFilters(filters) 
  {
    let resolveFilters = '';

    _.forOwn(filters, (value, filter) => {
        if (_.isObject(value)) {
            _.forOwn(value, (innerValue, innerFilter) => {
                resolveFilters += `&filter[${filter}][${innerFilter}]=${innerValue.toString()}`;
            });
        } else {
            resolveFilters += (_.isNull(value)) ? `&filter[${filter}]` : `&filter[${filter}]=${value.toString()}`;
        }
    });

    if (!_.isEmpty(resolveFilters)) {
        return resolveFilters;
    }

    return ''
  }
  
  /**
   *
   * @param includes
   * @returns {string}
   */
  resolveIncludes(includes) 
  {
    if(!((typeof includes === 'object'))) {
      throw new TypeError('Value passed is a not a object')
    }

    if (!_.isEmpty(includes)) {
      return `include=${includes.toString()}`;
    }

    return ''
  }
  
  /**
   *
   * @param pagination
   * @returns {string}
   */
  resolvePagination(pagination) 
  {
    if(!(typeof pagination === 'object')) {
      throw new TypeError('Value passed is a not a object')
    }

    if (!_.isEmpty(pagination)) {
      return `&page[size]=${pagination.size}&page[number]=${pagination.number}`;
    }
    
    return ''
  }
  
  /**
   *
   * @param sort
   * @returns {string}
   */
  resolveSort(sort)
  {
    if(!(typeof sort === 'object')) {
      throw new TypeError('Value passed is a not a string')
    }

    if (!_.isEmpty(sort)) {
      return `&sort=${sort.toString()}`;
    }

    return ''
  }
}
