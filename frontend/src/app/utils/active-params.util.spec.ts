import {ActiveParamsUtil} from './active-params.util';

describe('active params util', ()=> {

  it('should change type string to type array', ()=> {
    const result = ActiveParamsUtil.processParams({types: 'sukkulenti'});

    expect(result.types).toBeInstanceOf(Array);
  })

  it('should change page string to int', ()=> {
    const result = ActiveParamsUtil.processParams({page: '2'});

    expect(result.page).toBe(2);
  })

  it('should change the object to an object of the type', ()=> {
    const result = ActiveParamsUtil.processParams({
      types: 'sukkulenti',
      heightFrom: '1',
      heightTo: '2',
      diameterFrom: '1',
      diameterTo: '3',
      sort: '3',
      page: '2',
    });

    expect(result).toEqual({
      types: ['sukkulenti'],
      heightFrom: '1',
      heightTo: '2',
      diameterFrom: '1',
      diameterTo: '3',
      sort: '3',
      page: 2,
    });
  })


  it('should returned object without an invalid property', ()=> {
    const result: any = ActiveParamsUtil.processParams({pages: '2'});

    expect(result.pages).toBeUndefined();
  })

})
