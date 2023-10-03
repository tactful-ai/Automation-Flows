const chai = require('chai');
const expect = chai.expect;
const { FormStep } = require('./formStep'); 

describe('FormStep', function () {
  // Test case for the cacheRetrieval method
  it('should retrieve and parse cache data from a file', function () {
    const insta = new FormStep('Test Form');
    const cacheData = insta.cacheRetrieval();

    // Assert that cacheData is an object
    expect(cacheData).to.be.an('object');
  });


  // Test case for validation method
  it('should validate user input based on regex', function () {
    const insta = new FormStep('Test Form');
    const validationObj = {
      question: 'Test question for input validation',
      validation: {
        regex: /^\d+$/, // Regular expression to match digits
        errorMessage: 'Please enter digits only',
        retryCount: 3,
      },
    };
    // Simulate user input
    const userInput = '123';
    const result = insta.validation(validationObj, () => userInput);

    // Assert that the result is equal to the user input
    expect(result).to.equal(userInput);
  });

});
