// Feature('HAR');
// const assert = require('assert');
// const fs = require('fs');
// const { parseHttpArchiveText, isEquivalent, compareEntries } = require('./har');

// Scenario('Compare HAR file', async I => {
//   const recording1 = parseHttpArchiveText(
//     fs.readFileSync('./test-e2e/har/test_data/recording1.har', 'utf8')
//   );
//   const recording2 = parseHttpArchiveText(
//     fs.readFileSync('./test-e2e/har/test_data/recording2.har', 'utf8')
//   );
//   const recording3 = parseHttpArchiveText(
//     fs.readFileSync('./test-e2e/har/test_data/recording3.har', 'utf8')
//   );
//   // assert(compareEntries(recording1, recording1), "compare identical entries should return true")
//   assert(
//     compareEntries(recording1, recording2),
//     'compare entries from same AJS should return true'
//   );
//   assert(
//     !compareEntries(recording1, recording3),
//     'compare entries between different AJS configurations that are expected to produce different payloads'
//   );
// });

// Scenario('isEquivalent is able to ignore some properties', I => {
//   // deep equal
//   assert(
//     isEquivalent({ a: 1, b: 2, c: { d: 1 } }, { a: 1, b: 2, c: { d: 1 } }, {})
//   );
//   assert(
//     isEquivalent(
//       { a: 1, b: 2, c: { d: { e: { f: {} } } } },
//       { a: 1, b: 2, c: { d: { e: { f: {} } } } },
//       {}
//     )
//   );
//   // 'ignored' properties don't matter whether they exist or not or have different values
//   assert(
//     isEquivalent(
//       { a: 1, b: 2, c: { d: 1 } },
//       { a: 1, b: 'foobar', c: { d: 1 } },
//       { ignored: ['b'] }
//     )
//   );
//   assert(
//     isEquivalent(
//       { a: 1, b: 2, c: { d: 1 } },
//       { a: 1, c: { d: 1 } },
//       { ignored: ['b'] }
//     )
//   );
//   assert(
//     isEquivalent(
//       { a: 1, b: 2, c: { d: 1 } },
//       { a: 1, b: 2, c: { d: 123 } },
//       { ignored: ['c.d'] }
//     ),
//     'ignored non top-level'
//   );
//   assert(
//     isEquivalent(
//       { b: 2, c: { d: 2 } },
//       { a: 1, b: 2, c: { d: 1 } },
//       { ignored: ['a', 'c.d'] }
//     ),
//     'ignored c.d but not entire c'
//   );
//   assert(
//     !isEquivalent(
//       { b: 2 },
//       { a: 1, b: 2, c: { d: 1 } },
//       { ignored: ['a', 'c.d'] }
//     ),
//     'ignored c.d but not entire c #2'
//   );
//   assert(
//     isEquivalent(
//       { a: 1, b: 2, c: { g: 1 } },
//       { a: 1, b: 2, c: { d: 1, e: 2, f: {} } },
//       { ignored: ['c'] }
//     ),
//     'ignore entire sub-object'
//   );
//   // 'exists' properties only need to exist on both and values do not matter
//   assert(
//     isEquivalent(
//       { a: 123, b: 2, c: { d: 1 } },
//       { a: 1, b: 2, c: { d: 1 } },
//       { exists: ['a'] }
//     )
//   );
//   assert(
//     isEquivalent(
//       { a: null, b: 2, c: { d: 1 } },
//       { a: 1, b: 2, c: { d: 1 } },
//       { exists: ['a'] }
//     ),
//     'exists: null value'
//   );
//   assert(
//     !isEquivalent(
//       { b: 2, c: { d: 1 } },
//       { a: 1, b: 2, c: { d: 1 } },
//       { exists: ['a'] }
//     ),
//     'exists:  missing prop'
//   );
//   assert(
//     isEquivalent(
//       { a: 1, b: 2, c: { d: 1 } },
//       { a: 1, b: 234, c: { d: 123 } },
//       { exists: ['b', 'c.d'] }
//     ),
//     'exists: multiple props, nested'
//   );
//   assert(
//     isEquivalent(
//       { a: 1, b: 2, c: { d: 2 } },
//       { a: 1, b: 2, c: { d: { e: { f: {} } } } },
//       { exists: ['c'] }
//     ),
//     'exists: deeply nested objects'
//   );
//   // mix of ignored and exists
//   assert(
//     isEquivalent(
//       { b: 'foo', c: { d: 1 } },
//       { a: 1, b: 2, c: { d: 1 } },
//       { ignored: ['a'], exists: ['b'] }
//     )
//   );
// });
