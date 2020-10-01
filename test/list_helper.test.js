const listHelper = require('../utils/list_helper')

test('Dummy function returns one', () => {
  const blogs = []

  expect(listHelper.dummy(blogs)).toBe(1)
})