// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Dummy test', () => {

  // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Dummy test', async () => {
    // @ts-expect-error TS(2552): Cannot find name 'expect'. Did you mean 'exec'?
    return expect(true).toBe(true);
  });

});

module.exports = '';