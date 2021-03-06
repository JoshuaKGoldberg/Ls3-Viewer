/// <reference path="LsGenerator.ts" />
/// <reference path="LsViewer.ts" />
var Ls3;
(function (Ls3) {
    /**
     * A simple implementation of the Sieve of Eratosthenes to find all primes under a maximum.
     */
    var PrimeGenerator = (function () {
        /**
         *
         */
        function PrimeGenerator() {
            this.primes = {};
            this.maximum = 0;
        }
        /**
         * @param {Number} maximum
         */
        PrimeGenerator.prototype.generate = function (maximum) {
            var statuses = [], upperLimit = Math.sqrt(maximum) | 0, i, j;
            for (i = 0; i < maximum; i++) {
                statuses.push(true);
            }
            for (i = 2; i <= upperLimit; i++) {
                if (statuses[i]) {
                    for (j = i * i; j < maximum; j += i) {
                        statuses[j] = false;
                    }
                }
            }
            for (i = 2; i < maximum; i++) {
                if (statuses[i]) {
                    this.primes[i] = true;
                }
            }
            this.maximum = maximum;
        };
        return PrimeGenerator;
    })();
    Ls3.PrimeGenerator = PrimeGenerator;
})(Ls3 || (Ls3 = {}));
