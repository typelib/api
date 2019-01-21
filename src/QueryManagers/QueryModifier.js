import _ from 'lodash';
import TypeError from '@kernel-js/exceptions'

/**
 *
 */
export default class QueryModifier {

  constructor () {}

  /**
   *
   * @param includes
   * @returns {QueryModifier}
   */
  with(includes)
  {
    if (!_.isArray(includes) || _.indexOf('&', includes.toString()) !== -1) {
      throw new TypeError('Invalid includes', 500);
    }

    if (!_.isEmpty(includes)) {
      includes = _.uniq(includes);

      this.queryBuilder.includes = includes
    }

    return this
  }

  /**
   *
   * @param fields
   * @returns {QueryModifier}
   */
  select(fields)
  {
    if (!_.isArray(fields) || _.indexOf(['&'], fields) !== -1) {
      throw new TypeError('Invalid fields', 500);
    }

    if (_.isArray(fields)) {
      let selectFields = _.clone(fields);
      fields = {};
      fields[this.resourceName()] = selectFields;
    }

    _.forOwn(fields, (value, resource) => {
        this.queryBuilder.fields[resource] = value.toString();
    });

    return this;
  }

  /**
   *
   * @param column
   * @param direction
   * @returns {QueryModifier}
   */
  orderBy(column, direction = 'asc')
  {
    if (_.indexOf(['asc', 'desc'], direction) === -1) {
      throw new TypeError(`Argument 2 invalid`, 500);
    }

    if (!_.isArray(column) || _.indexOf(['&'], column) !== -1) {
      throw new TypeError('Invalid column', 500);
    }

    if (direction === 'desc') {
        column = `-${column}`;
    }

    this.queryBuilder.sort = column;

    return this;
  }

  where (key, value = null, group = null) {
    if (_.isNull(group)) {
      this.queryBuilder.filters[key] = value
    } else {
      if (_.isUndefined(this.queryBuilder.filters[group])) {
        this.queryBuilder.filters[group] = {}
      }

      this.queryBuilder.filters[group][key] = value
    }

    return this
  }

}
