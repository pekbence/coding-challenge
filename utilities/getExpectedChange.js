/* Based on the given formula ec should be between 0 and 1 (both side inclusive)
* so I changed the original implementation which was exclusive from the right
* (generator was not able to reach number 100)
*/
module.exports = generator => generator.intBetween(0, 100) / 100;
