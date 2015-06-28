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
};

/**
 * Generates numbers until a new maximum.
 * 
 * @param {Number} max   A new maximum to generate until.
 */
LsGenerator.prototype.generateNext = function generateNext(number) {
    var generatedLength,
        exclude,
        i, j;

    i = this.maximum;

    do {
        i += 1;

        // If i has already been excluded, ignore it
        if (this.excludedMap.hasOwnProperty(i)) {
            continue;
        }

        if (this.keepExcludesOf) {
            this.excludesOf[i] = [];
        }

        // For each previously excluded number...
        generatedLength = this.generatedArray.length;
        for (j = 0; j < generatedLength; j += 1) {
            // ... compute each possible new exclusion, j
            exclude = i + i - this.generatedArray[j];

            // If j is a duplicate, ignore it
            if (this.excludedMap.hasOwnProperty(exclude)) {
                continue;
            }

            this.excludedArray.push(exclude);
            this.excludedMap[exclude] = true;

            if (this.keepExcludesOf) {
                this.excludesOf[i].push(exclude);
            }
        }

        if (this.keepExcludesOf) {
            this.excludesOf[i].sort();
        }

        this.generatedArray.push(i);
        this.generatedMap[i] = true;

        number -= 1;
    } while (number > 0);

    this.maximum = Math.max(this.maximum, i);
};

/**
 * 
 */
LsGenerator.prototype.retractAfter = function (minimum) {
    // First find where both exclusions and generateds 
    var excludedStart = this.findMinimum(this.excludedArray, minimum),
        generatedStart = this.findMinimum(this.generatedArray, minimum),
        i;

    // Remove all the excluded numbers past the minimum
    for (i = excludedStart; i < this.excludedArray.length; i += 1) {
        delete this.excludedMap[this.excludedArray[i]];
        delete this.excludesOf[this.excludedArray[i]];
    }
    this.excludedArray.length = excludedStart;

    // Remove all the generated numbers past the minimum
    for (i = generatedStart; i < this.generatedArray.length; i += 1) {
        delete this.generatedMap[this.generatedArray[i]];
    }
    this.generatedArray.length = generatedStart;

    this.maximum = this.generatedArray[this.generatedArray.length - 1] || 1;

    return generatedStart;
};

/**
 * 
 * 
 * @remarks This doesn't use binary search, as this.excludedArray isn't sorted.
 */
LsGenerator.prototype.findMinimum = function (array, minimum) {
    var bestDifference = Math.abs(array[0] - minimum),
        bestIndex = 0,
        difference, i;

    for (i = 1; i < array.length; i += 1) {
        difference = Math.abs(array[i] - minimum);

        if (difference < bestDifference) {
            bestDifference = difference;
            bestIndex = i;
        }
    }

    return bestIndex;
};

// async (start, stop methods)
