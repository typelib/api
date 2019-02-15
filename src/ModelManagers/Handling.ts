import { Serializer, JsonEncoder, JsonApiNormalizer, DateNormalizer } from '@kernel-js/serializer';
import { clone, mapValues, isUndefined, forEach, isEmpty, indexOf, keys } from 'lodash'
import { Model } from './Model';
import { ModelSignature } from '../Interfaces/index';
import { AxiosResponse } from 'axios';

/**
 *
 */
export default class Handling {
  
  /**
   * @param  {Model} that
   * @param  {any} respond
   * @returns any
   */
  private _hydrate(that: Model, respond: any): any
  {
    return Object.assign(clone(that), respond)
  }
  
  /**
   * @param  {Model} that
   * @param  {any} respond
   * @returns any
   */
  private _hydrateCollection(that: Model, respond: any): any
  {
    let self = this;
    return mapValues(respond, (value) => {
      return self._hydrate(clone(that), value);
    });
  }
  
  /**
   * @param  {Model} that
   * @param  {AxiosResponse} response
   * @param  {boolean=true} hydrate
   * @returns any
   */
  public respond(that: Model, response: AxiosResponse, hydrate:boolean = true): any
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
   * @param  {Model} response
   * @returns any
   */
  public serialize(response: ModelSignature): any
  {
    let data: ModelSignature = {
      id: NaN,
      type: '',
    };
  
    if (response.hasOwnProperty('id')) {
      data.id = response.id;
    }

    data.type = response.type;
  
    forEach(response.fields, field => {
      if (!isUndefined(response[field])) {
        data[field] = response[field];
      }
    });
  
    forEach(response.relationshipNames, name => {
      if(!isEmpty(response[name])){
        data[name] = response[name]['id'];
      }
    });
    console.log(data)
    let serializer = new Serializer(new JsonEncoder());
    return serializer.serialize(data);
  }

}