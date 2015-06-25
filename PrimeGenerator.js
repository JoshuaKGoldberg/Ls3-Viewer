/**
 * Sieve of Eratosthenes to find all primes under a maximum
 */
function PrimeGenerator() {
    this.primes = {};
    this.maximum = 0;
}

/**
 * @param {Number} maximum
 */
PrimeGenerator.prototype.generate = function (maximum) {
    var statuses = [],
        upperLimit = Math.sqrt(maximum) | 0,
        i, j;

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
};
