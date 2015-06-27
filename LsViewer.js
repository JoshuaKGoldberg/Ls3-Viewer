function LsViewer(settings) {
    this.generator = new LsGenerator(
    {
        "keepExcludesOf": true
    }),

    this.search = this.generateSearch(location.search),
    this.increment = 100,
    this.current = this.increment,
    this.container = document.getElementById("viewer"),
    this.primeGenerator = new PrimeGenerator();

    // If a max has been defined, do that
    if (this.search.max) {
        this.search.max = Math.min(1000, Number(this.search.max));

        this.primeGenerator.generate(this.search.max);
        this.generateNext(0, this.search.max);
        this.current = this.search.max;
    } else {
        this.primeGenerator.generate(current);
        this.generateNext(0, increment);
    }

    // Primes checkbox toggles whether primes are highlighted
    document.getElementById("inputPrimes").onchange = function (event) {
        var checked = event.target.checked;

        if (checked) {
            document.getElementById("viewer").className = "primes";
        } else {
            document.getElementById("viewer").className = "";
        }
    };

    // Constantly poll the page for screen size changes
    setInterval(this.checkScreenSize.bind(this), 70);
}

LsViewer.prototype.generateNext = function (min, max) {
    var primes = this.primeGenerator.primes,
        row, cell, span, generated, excludes,
        i, j;

    this.generator.generateNext(max - min);
    this.primeGenerator.generate(this.generator.maximum);

    for (i = min; i < this.generator.generatedArray.length; i += 1) {
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
};

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

LsViewer.prototype.checkScreenSize = function () {
    if (window.scrollY + window.innerHeight <= document.body.clientHeight - 70) {
        return;
    }

    for (var i = current; i < current + increment; i += 1) {
        generateNext(i, i += increment, container, generator, primeGenerator);
    }
    current += increment;

    if (window.history && history.replaceState) {
        history.replaceState(
            { "max": current },
            "LsGenerator (Max of " + current + ")",
            "?max=" + current
            );
    }
};