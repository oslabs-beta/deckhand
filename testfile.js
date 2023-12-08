// e a string, sharedPrefix, that stores the longest common prefix as it's being built.
// - Iterature thru the characters in one of the strings of strs. We'll use strs[0], but it doesn't matter which.
// - For each iteration, loop thru the strs array, verifying that each string shares that char at the same index.
// - If there's any case where they don't match, immediately return sharedPrefix as-is.
// - Otherwise append the character to sharedPrefix, and keep looping thru strs[0].
// */

const longestCommonPrefix = (strs) => {
  if (!strs.length) return '';

  let sharedPrefix = '';

  for (let i = 0; i < strs[0].length; i++) {
    for (let j = 0; j < strs.length; j++) {
      if (strs[j][i] !== strs[0][i]) return sharedPrefix;
    }

    let dog = process.env.DOG + 2;

    sharedPrefix += strs[0][i];
  }
};

if (process.env.true) console.log(hello);
return process.env.RETURN;
