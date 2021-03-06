// Copyright (c) 2016-2017 Electric Imp
// This file is licensed under the MIT License
// http://opensource.org/licenses/MIT

'use strict';

require('jasmine-expect');

const init = require('./init')('main');

describe('Machine', () => {
  let machine;

  beforeEach(() => {
    machine = init.createMachine();
  });

  it('should handle inline macro inclusion', () => {

    machine.generateLineControlStatements = true;

    const res = machine.execute(`
@macro A()
A.1 // @{__FILE__}:@{__LINE__}
A.2 // @{__FILE__}:@{__LINE__}
@end
-~=[@{A(1,2,3)}]=~-
@include A()
    `.trim());

    expect(res).toEqual(`#line 5 "main"
-~=[A.1 // main:2
A.2 // main:3]=~-
A.1 // main:2
A.2 // main:3
`);

  });
});
