import { Serializer, JsonEncoder, JsonApiNormalizer, DateNormalizer } from '@kernel-js/serializer';
import { clone, mapValues, isUndefined, forEach, isEmpty, indexOf, keys } from 'lodash'
import { Model } from './Model';
import { AxiosResponse } from 'axios';

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
  private _hydrate(that: Model, respond: any): any
  {
    return Object.assign(clone(that), respond)
  }
  
  /**
   *
   * @param that
   * @param respond
   * @returns {any}
   * @private
   */
  private _hydrateCollection(that: Model, respond: any): any
  {
    let self = this;
    return mapValues(respond, (value) => {
      return self._hydrate(clone(that), value);
    });
  }
  
  /**
   *
   * @param that
   * @param response
   * @param hydrate
   * @returns {any}
   */
  public respond(that: Model, response: AxiosResponse, hydrate = true): any
  {
    let serializer = new Serializer(new JsonEncoder(), [new JsonApiNormalizer(), new DateNormalizer()]);
    let respond = serializer.unserialize((typeof response === 'string') ? response : JSON.stringify(response));
    let hydrated;

    if(indexOf(keys(respond), '0') !== -1) {
      hydrated = this._hydrateCollection(that, respond);
    }else {
      hydrated = this._hydrate(that, respond);
    }

    return hydrate ? hydrated : respond;
  }
  
  /**
   *
   * @param response
   * @returns {any}
   */
  public serialize(response: Model): any
  {
    let data: {
      id: number,
      type: string,
      data?: any,
    } = {
      id: NaN,
      type: '',
    };
  
    if (response.hasOwnProperty('id')) {
      data.id = response.id;
    }

    data.type = response.type;
  
    // forEach(response.fields, field => {
    //   if (!isUndefined(response[field])) {
    //     data[field] = response[field];
    //   }
    // });
  
    // forEach(response.relationshipNames, name => {
    //   if(!isEmpty(response[name])){
    //     data[name] = response[name]['id'];
    //   }
    // });

    let serializer = new Serializer(new JsonEncoder());
    return serializer.serialize(data);
  }

}