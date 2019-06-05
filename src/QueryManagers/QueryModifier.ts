import { isArray, indexOf, uniq, forOwn } from 'lodash';
import { TypeError } from '@kernel-js/exceptions';

/**
 * 
 */
export default class QueryModifier {
  /**
   * @type String
   */
  private resourceName: string;

  constructor (resourceName: string) {
    this.resourceName = resourceName;
  }

  /**
   * @param  {Array<string>} includes
   * @returns Array
   */
  public include(includes: Array<string>): Array<string>
  {
    includes = uniq(includes);
    return includes;
  }
  
  /**
   * @param  {Array<string>} fields
   * @returns Array
   */
  public select(fields: Array<string>): Array<string>
  {
    let selectFields: any = {};

    if (isArray(fields)) {
      selectFields[this.resourceName] = fields.toString()
      return selectFields;
    }

    forOwn(fields, (value: Array<string>, resource) => {
      selectFields[resource] = value.toString();
    });

    return selectFields;
  }

  /**
   * @param  {Array<string>} column
   * @param  {string='asc'} direction
   * @returns string
   */
  public orderBy(column: Array<string>, direction: string): string
  {
    if (indexOf(['asc', 'desc'], direction) === -1) {
      throw new TypeError(`Argument 2 invalid`, 500);
    }

    if (direction === 'desc') {
      return `-${column}`;
    }
    
    return column.toString();
  }

  /**
   * @param  {string} key
   * @param  {string} value
   * @returns Array
   */
  public filter(key: string, value: string): Array<string>
  {
    let newFilter: any = {};

    newFilter[key] = value
    return newFilter
  }

}
