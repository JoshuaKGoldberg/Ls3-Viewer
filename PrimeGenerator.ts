/// <reference path="LsGenerator.ts" />
/// <reference path="LsViewer.ts" />

module Ls3 {
    /**
     * A simple implementation of the Sieve of Eratosthenes to find all primes under a maximum.
     */
    export class PrimeGenerator {
        /**
         * 
         */
        public primes: {
            [i: number]: boolean;
        };

        /**
         * 
         */
        public maximum: number;

        /**
         * 
         */
        constructor() {
            this.primes = {};
            this.maximum = 0;
        }

        /**
         * @param {Number} maximum
         */
        public generate(maximum: number): void {
            var statuses: boolean[] = [],
                upperLimit: number = Math.sqrt(maximum) | 0,
                i: number,
                j: number;

            // Make an statuses from 2 to (n - 1)
            for (i = 0; i < maximum; i++) {
                statuses.push(true);
            }

            // Remove multiples of primes starting from 2, 3, 5,...
            for (i = 2; i <= upperLimit; i++) {
                if (statuses[i]) {
                    for (j = i * i; j < maximum; j += i) {
                        statuses[j] = false;
                    }
                }
            }

            // All statuses[i] set to true are primes
            for (i = 2; i < maximum; i++) {
                if (statuses[i]) {
                    this.primes[i] = true;
                }
            }

            this.maximum = maximum;
        }
    }
}
