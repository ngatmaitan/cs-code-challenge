// referenced https://javascript.plainenglish.io/unit-test-front-end-javascript-code-without-a-framework-8f00c63eb7d4
// found a testing method that isn't a framework but this loads before the DOM is complete, adding an eventListener to the window or document didn't seem to work
(function () {
  function it(desc, func) {
    try {
      func();
      console.log("\x1b[32m%s\x1b[0m", "\u2714 " + desc);
    } catch (error) {
      console.log("\n");
      console.log("\x1b[31m%s\x1b[0m", "\u2718 " + desc);
      console.error(error);
      console.log("\n");
    }
  }

  function assert(isTrue) {
    if (!isTrue) {
      throw new Error();
    }
  }
})();
