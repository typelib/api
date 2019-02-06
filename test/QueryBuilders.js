import { expect } from 'chai';
import QueryBuilder from '../src/QueryManagers/QueryBuilder'
describe('QueryBuilders', () => {
  it('resolveFields', () => {
    let queryBuilder = new QueryBuilder();
    const inputs = 'name,lastName';
    const fields = {users: inputs};
    let result = queryBuilder.resolveFields(fields);

    expect(result).to.deep.equal(`&fields[users]=${inputs}`);
  });

  it('resolveFilters without Group', () => {
    let queryBuilder = new QueryBuilder();
    const inputs = 'name';
    const filters = {users: inputs};
    let result = queryBuilder.resolveFilters(filters);

    expect(result).to.deep.equal('&filter[users]=name');
  });

  it('resolveFilters with Group', () => {
    let queryBuilder = new QueryBuilder();
    const inputs = {permission: 'admin'};
    const filters = {users: inputs};
    let result = queryBuilder.resolveFilters(filters);

    expect(result).to.deep.equal('&filter[users][permission]=admin');
  });

  it('resolveIncludes', () => {
    let queryBuilder = new QueryBuilder();
    const inputs = ['company', 'chief'];
    const includes = inputs;
    let result = queryBuilder.resolveIncludes(includes);

    expect(result).to.deep.equal(`include=${inputs.toString()}`);
  });

  it('resolvePagination', () => {
    let queryBuilder = new QueryBuilder();
    const inputs = [3, 1];
    const pagination = { size: inputs[0], number: inputs[1] };
    let result = queryBuilder.resolvePagination(pagination);

    expect(result).to.deep.equal(`&page[size]=${inputs[0]}&page[number]=${inputs[1]}`);
  });

  it('resolveSort', () => {
    let queryBuilder = new QueryBuilder();
    const inputs = ['created_at'];
    const sort = inputs;
    let result = queryBuilder.resolveSort(sort);

    expect(result).to.deep.equal(`&sort=${inputs}`);
  });
})
