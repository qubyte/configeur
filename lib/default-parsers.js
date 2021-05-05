export default [
  ['string', value => value],
  ['boolean', value => value === 'true'],
  ['number', Number]
];
