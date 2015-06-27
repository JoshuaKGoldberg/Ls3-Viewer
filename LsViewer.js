function LsViewer(settings) {
    this.generator = new LsGenerator(
    {
        "keepExcludesOf": true
    }),

    this.search = this.generateSearch(location.search),
    this.increment = 100,
    this.current = 0,
    this.container = document.getElementById("viewer"),
    this.primeGenerator = new PrimeGenerator();

    this.generateNext(this.increment);

    // Primes checkbox toggles whether primes are highlighted
    document.getElementById("inputPrimes").onchange = function (event) {
        var checked = event.target.checked;

        if (checked) {
            document.getElementById("viewer").className = "primes";
        } else {
            document.getElementById("viewer").className = "";
        }
    }.bind(this);

    // Adder button gets adds more
    document.getElementById("adderButton").onclick = function () {
        var amount = parseInt(document.getElementById("adderAmount").value);
        this.generateNext(amount);
    }.bind(this);
}

/**
 * 
 */
LsViewer.prototype.generateNext = function (amount) {
    var primes = this.primeGenerator.primes,
        cap = this.current + amount,
        row, cell, span, generated, excludes,
        i, j;

    this.generator.generateNext(amount);
    this.primeGenerator.generate(this.generator.maximum);

    for (i = this.current; i < cap; i += 1) {
        generated = this.generator.generatedArray[i];

        if (i % 2 === 0 && i > 0) {
            row = document.createElement("span");
            row.className = "gap";

            cell = document.createElement("span");
            cell.innerText = generated - this.generator.generatedArray[i - 1];

            row.appendChild(cell);
            this.container.appendChild(row);
        }

        row = document.createElement("div");
        row.className = "row";

        cell = document.createElement("span");
        cell.className = "index";
        cell.textContent = i + 1;

        if (primes[i + 1]) {
            cell.className += " prime";
        }

        row.appendChild(cell);

        cell = document.createElement("span");
        cell.className = "key";
        cell.textContent = generated;

        if (primes[generated]) {
            cell.className += " prime";
        }

        row.appendChild(cell);

        cell = document.createElement("span");
        cell.className = "values";
        excludes = this.generator.excludesOf[generated];
        for (j = 0; j < excludes.length; j += 1) {
            span = document.createElement("span");
            span.className = "excluded";
            span.textContent = excludes[j];

            if (primes[excludes[j]]) {
                span.className += " prime";
            }

            cell.appendChild(span);
        }
        row.appendChild(cell);

        this.container.appendChild(row);
    }

    this.current = cap;
};

/**
 * 
 */
LsViewer.prototype.generateSearch = function generateSearch(search) {
    if (!search) {
        search = "";
    } else {
        if (search[0] == "?") {
            search = search.substring(1);
        }
    }

    var args = search.split("?").map(
        function (text) {
            return text.split("=");
        }),
        output = {},
        i;

    for (i = 0; i < args.length; i += 1) {
        output[args[i][0]] = args[i][1];
    }

    return output;
};

/**
 * 
 */
LsViewer.prototype.retractAfter = function (min) {
    var generatedStart = this.generator.retractAfter(min),
        rows = Array.prototype.slice.call(this.container.querySelectorAll(".row")),
        gaps = Array.prototype.slice.call(this.container.querySelectorAll(".gap")),
        i;

    for (i = generatedStart + 1; i < rows.length; i += 1) {
        this.container.removeChild(rows[i]);
    }

    for (i = Math.max(generatedStart - 3, 0) ; i < gaps.length; i += 1) {
        this.container.removeChild(gaps[i]);
    }
};