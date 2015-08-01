/* global describe, beforeEach, it, browser<% if (e2eTestFramework === 'jasmine') { %>, expect<% } %> */
'use strict';

import <%= upperCamel %>Page from './<%= hyphenName %>.po';<% if (e2eTestFramework === 'mocha') { %>

let chai = require('chai')
  , chaiAsPromised = require('chai-as-promised')
  , expect = chai.expect;

chai.use(chaiAsPromised);<% } %>

describe('<%= humanName %> page', () => {
  let <%= lowerCamel %>Page;

  beforeEach(() => {
    <%= lowerCamel %>Page = new <%= upperCamel %>Page();
    browser.get('/#<%= url %>');
  });

  it('should say <%= ctrlName %>', () => {
    expect(<%= lowerCamel %>Page.heading.getText()).<% if (e2eTestFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %>('<%= lowerCamel %>');
    expect(<%= lowerCamel %>Page.text.getText()).<% if (e2eTestFramework === 'mocha') { %>to.eventually.equal<% } else { %>toEqual<% } %>('<%= ctrlName %>');
  });
});
