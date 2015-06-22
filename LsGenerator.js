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
}

// async (start, stop methods)
