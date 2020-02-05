const rewire = require('rewire');

const app = rewire('../controllers/rule');

getRuleAsObjFuc = app.__get__('getRuleAsObj');
extractTypeFuc = app.__get__('extractType');
adjustOperatorToQueryFuc = app.__get__('adjustOperatorToQuery');

test('take rule as string and returns it as object', () => {
  expect(getRuleAsObjFuc('{volume} > 50')).toEqual({
    type: 'volume',
    operator: '>',
    value: '50'
  });
});

test('take rule as 2 string and returns it as objects', () => {
  expect(getRuleAsObjFuc('{volume} > 50', '{volume} < 10')).toEqual(
    {
      type: 'volume',
      operator: '>',
      value: '50'
    },
    {
      type: 'volume',
      operator: '<',
      value: '10'
    }
  );
});

test('extract type of sample to check and adjust object', () => {
  expect(extractTypeFuc('{volume} > 100')).toEqual({
    operator: '>',
    type: 'volume',
    value: '100'
  });
});

test('take rule as object and adjust query conditional operator', () => {
  expect(
    adjustOperatorToQueryFuc({ type: 'volume', operator: '<', value: '100' })
  ).toEqual({
    $lt: 100
  });
});
