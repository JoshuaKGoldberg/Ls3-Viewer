/// <reference path="PrimeGenerator.ts" />
/// <reference path="LsViewer.ts" />
var Ls3;
(function (Ls3) {
    /**
     *
     */
    var LsGenerator = (function () {
        /**
         *
         */
        function LsGenerator(settings) {
            this.excludedArray = [];
            this.excludedMap = {};
            this.excludesOf = {};
            this.generatedArray = [];
            this.generatedMap = {};
            this.maximum = 0;
            if (settings) {
                this.keepExcludesOf = Boolean(settings.keepExcludesOf);
            }
        }
        /**
         * Generates numbers until a new maximum.
         *
         * @param {Number} number   How many numbers to generate.
         * @param {Number} [startFrom]   A first starting number (if not provided, this.maximum + 1).
         */
        LsGenerator.prototype.generateNext = function (amount, startFrom) {
            var generatedLength, exclude, i, j;
            i = startFrom ? startFrom - 1 : this.maximum;
            do {
                i += 1;
                // If i has already been excluded, ignore it
                if (this.excludedMap.hasOwnProperty(i)) {
                    continue;
                }
                this.generateExcludesOf(i);
                this.generatedArray.push(i);
                this.generatedMap[i] = true;
                amount -= 1;
            } while (amount > 0);
            this.maximum = Math.max(this.maximum, i);
        };
        /**
         *
         */
        LsGenerator.prototype.generateExcludesOf = function (amount) {
            var generatedLength = this.generatedArray.length, generated, exclude, i;
            if (this.keepExcludesOf) {
                this.excludesOf[amount] = [];
            }
            for (i = 0; i < generatedLength; i += 1) {
                generated = this.generatedArray[i];
                exclude = amount + amount - generated;
                if (exclude < 0 || this.excludedMap.hasOwnProperty(exclude)) {
                    continue;
                }
                this.excludedArray.push(exclude);
                this.excludedMap[exclude] = true;
                if (this.keepExcludesOf) {
                    this.excludesOf[amount].push(exclude);
                }
            }
            if (this.keepExcludesOf) {
                this.excludesOf[amount].sort();
            }
        };
        /**
         *
         */
        LsGenerator.prototype.retractAfter = function (minimum) {
            // First find where both exclusions and generateds 
            var excludedStart = this.findMinimum(this.excludedArray, minimum), generatedStart = this.findMinimum(this.generatedArray, minimum), i;
            for (i = 0; i < this.excludedArray.length; i += 1) {
                delete this.excludedMap[this.excludedArray[i]];
                delete this.excludesOf[this.excludedArray[i]];
            }
            this.excludedArray.length = excludedStart;
            for (i = generatedStart; i < this.generatedArray.length; i += 1) {
                delete this.generatedMap[this.generatedArray[i]];
            }
            this.generatedArray.length = generatedStart;
            this.maximum = this.generatedArray[this.generatedArray.length - 1] || 1;
            for (i = 0; i < this.generatedArray.length; i += 1) {
                this.generateExcludesOf(this.generatedArray[i]);
            }
            return generatedStart;
        };
        /**
         *
         *
         * @remarks This doesn't use binary search, as this.excludedArray isn't sorted.
         */
        LsGenerator.prototype.findMinimum = function (array, minimum) {
            var bestDifference = Math.abs(array[0] - minimum), bestIndex = 0, difference, i;
            for (i = 1; i < array.length; i += 1) {
                difference = Math.abs(array[i] - minimum);
                if (difference < bestDifference) {
                    bestDifference = difference;
                    bestIndex = i;
                }
            }
            return bestIndex;
        };
        return LsGenerator;
    })();
    Ls3.LsGenerator = LsGenerator;
})(Ls3 || (Ls3 = {}));
