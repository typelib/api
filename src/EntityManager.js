import Model from './ModelManagers/Model';

export default class EntityManager extends Model{

  /**
   *
   */
  constructor() {
    super()
  }

  /**
   *
   * @param config
   * @returns {Promise<AxiosPromise<any>>}
   */
  async request (config) {
    //
  }

  /**
   *
   * @returns {Array}
   */
  fields () {
    return [];
  }

  /**
   *
   * @returns {Array}
   */
  relationshipNames () {
    return [];
  }

  /**
   *
   * @returns {null}
   */
  resourceName () {
    return null;
  }

  /**
   *
   * @returns {null}
   */
  baseUrl() {
    return null
  }

  /**
   *
   * @returns {string}
   */
  resourceUrl () {
    return `${this.baseUrl()}/${this.resourceName()}/`
  }

}
