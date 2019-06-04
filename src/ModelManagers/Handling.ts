import { Serializer, JsonEncoder, JsonApiNormalizer, DateNormalizer } from '@kernel-js/serializer';
import { clone, mapValues, isUndefined, forEach, isEmpty, indexOf, keys } from 'lodash';
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
   * @returns Model
   */
  private _hydrate(that: Model, respond: any): Model
  {
    that.id = respond.id;
    that.attributes = Object.assign(clone(that.attributes), respond)
    return that
  }

  /**
   * @param  {Model} that
   * @param  {any} respond
   * @returns any
   */
  private _hydrateCollection(that: Model, respond: any): any
  {
    let self = this;
    return mapValues(respond, (value: any) => {
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
    let serializer = new Serializer(new JsonEncoder());

    if (response.relationships) {
      response.relationships.type = response.relationships.type.toLowerCase();
      return serializer.serialize(response.relationships);
    }

    let data: ModelSignature = {
      id: NaN,
      type: '',
    };
  
    if (response.hasOwnProperty('id')) {
      data.id = response.id;
    }

    data.type = response.type;
  
    forEach(response.fields, field => {
      if (!isUndefined(response.attributes[field])) {
        data[field] = response.attributes[field];
      }
    });
  
    forEach(response.relationshipNames, name => {
      if(!isEmpty(response[name])){
        data[name] = response[name]['id'];
      }
    });

    return serializer.serialize(data);
  }

}