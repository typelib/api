import { isEmpty, isArray, indexOf, uniq, forOwn, clone, isNull, isUndefined } from 'lodash';
import { TypeError } from '@kernel-js/exceptions';

/**
 *
 */
export default class QueryModifier {

  constructor () {}

  /**
   *
   * @param includes
   * @returns {Array<string>}
   */
  public static with(includes: Array<string>): Array<string>
  {
    includes = uniq(includes);
    return includes;
  }

  // public static select(fields: Array<string>): Array<string>
  // {
  //   if (isArray(fields)) {
  //     return fields;
  //   }

  //   forOwn(fields, (value, resource) => {
  //     return fields[resource] = value.toString();
  //   });

  // }

  /**
   * @param  {Array<string>} column
   * @param  {string='asc'} direction
   * @returns Array
   */
  public static orderBy(column: Array<string>, direction: string = 'asc'): Array<string>
  {
    if (indexOf(['asc', 'desc'], direction) === -1) {
      throw new TypeError(`Argument 2 invalid`, 500);
    }

    if (direction === 'desc') {
      console.log( `-${column}`)
    }
    
    return column;
  }

  // public static where (key: string, value: string | null = null, group = null): Array<string>
  // {
  //   if (isNull(group)) {
  //     return filter[key] = value
  //   } else {
  //     // if (isUndefined(this.queryBuilder.filters[group])) {
  //     //   this.queryBuilder.filters[group] = {}
  //     // }

  //     return filters[group][key] = value
  //   }

  // }

}
