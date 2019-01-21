import { Serializer, JsonEncoder, JsonApiNormalizer, DateNormalizer } from '@kernel-js/serializer';
import _ from 'lodash'

/**
 *
 */
export default class Handling {
  
  /**
   *
   * @param that
   * @param respond
   * @returns {any}
   * @private
   */
  _hydrate(that, respond)
  {
    return Object.assign(_.clone(that), respond)
  }
  
  /**
   *
   * @param that
   * @param respond
   * @returns {*}
   * @private
   */
  _hydrateCollection(that, respond)
  {
    let self = this;
    return _.mapValues(respond, function (value) {
      return self._hydrate(_.clone(that), value);
    });
  }
  
  /**
   *
   * @param that
   * @param response
   * @param hydrate
   * @returns {*}
   */
  respond(that, response, hydrate = true)
  {
    let serializer = new Serializer(new JsonEncoder(), [new JsonApiNormalizer(), new DateNormalizer()]);
    let respond = serializer.unserialize((typeof response === 'string') ? response : JSON.stringify(response));
    let hydrated;

    if(_.indexOf(_.keys(respond), '0') !== -1) {
      hydrated = this._hydrateCollection(that, respond);
    }else {
      hydrated = this._hydrate(that, respond);
    }

    return hydrate ? hydrated : respond;
  }
  
  /**
   *
   * @param response
   * @returns {*}
   */
  serialize(response)
  {
    let data = {};
  
    if (response.hasOwnProperty('id')) {
      data.id = response.id;
    }

    data.type = response.type;
  
    _.forEach(response.fields(), field => {
      if (!_.isUndefined(response[field])) {
        data[field] = response[field];
      }
    });
  
    _.forEach(response.relationshipNames(), name => {
      if(!_.isEmpty(response[name])){
        data[name] = response[name]['id'];
      }
    });

    let serializer = new Serializer(new JsonEncoder());
    return serializer.serialize(data);
  }

}