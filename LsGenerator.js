function LsGenerator(settings) {
    this.excludedArray = [];
    this.excludedMap = {};
    this.excludesOf = {};

    this.generatedArray = [];
    this.generatedMap = {};
    this.maximum = 0;

    if (settings) {
        this.keepExcludesOf = Boolean(settings.keepExcludesOf);

        if (settings.maximum) {
            this.generateUntil(settings.maximum);
        }
    }
};

/**
 * Generates numbers until a new maximum.
 * 
 * @param {Number} max   A new maximum to generate until.
 */
LsGenerator.prototype.generateUntil = function generateUntil(maximum) {
    var generatedLength,
        exclude,
        i, j;

    for (i = this.maximum + 1; i < maximum; i += 1) {
        if (this.excludedMap.hasOwnProperty(i)) {
            continue;
        }
        
        if (this.keepExcludesOf) {
            this.excludesOf[i] = [];
        }

        generatedLength = this.generatedArray.length;
        for (j = 0; j < generatedLength; j += 1) {
            exclude = i + i - this.generatedArray[j];
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
    }

    this.maximum = Math.max(this.maximum, maximum);
}

// async (start, stop methods)
