import {Model} from '../src';
import Axios, { AxiosResponse, AxiosPromise } from 'axios';

export default class Entity extends Model{
  public request(config: any): AxiosPromise<any> {
    return Axios.request(config);
  }

  get resourceName(): string {
    return 'posts'
  }

  get baseUrl(): string {
    return 'http://localhost/api';
  } 

  get fields(): Array<string> {
    return ['title', 'subtitle', 'body'];
  }

  get relationshipNames(): Array<string> {
    return ['author', 'tags'];
  }
}