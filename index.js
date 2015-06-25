/// <reference path="LsGenerator.js" />
/// <reference path="PrimeGenerator.js" />

document.onreadystatechange = (function () {
    function generateNext(min, max, container, generator, primeGenerator) {
        var primes = primeGenerator.primes,
            row, cell, span, generated, excludes,
            i, j;

        generator.generateNext(max - min);
        primeGenerator.generate(generator.maximum);

        for (i = min; i < generator.generatedArray.length; i += 1) {
            generated = generator.generatedArray[i];

            if (i % 2 === 0 && i > 0) {
                row = document.createElement("span");
                row.className = "gap";

                cell = document.createElement("span");
                cell.innerText = generated - generator.generatedArray[i - 1];

                row.appendChild(cell);
                container.appendChild(row);
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
            excludes = generator.excludesOf[generated];
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

            container.appendChild(row);
        }
    }

    function generateSearch(search) {
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
    }

    return function (event) {
        if (event.target.readyState !== "complete") {
            return;
        }

        var generator = new LsGenerator(
            {
                "keepExcludesOf": true
            }),
            search = generateSearch(location.search),
            increment = 100,
            current = increment,
            container = document.getElementById("viewer"),
            primeGenerator = new PrimeGenerator();

        // If a max has been defined, do that
        if (search.max) {
            search.max = Math.min(1000, Number(search.max));

            primeGenerator.generate(search.max);
            generateNext(0, search.max, container, generator, primeGenerator);
            current = search.max;
        } else {
            primeGenerator.generate(current);
            generateNext(0, increment, container, generator, primeGenerator);
        }

        // Constantly poll the page for screen size changes
        setInterval(
            function () {
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
            },
            70);

        // Primes checkbox toggles whether primes are highlighted
        document.getElementById("inputPrimes").onchange = function (event) {
            var checked = event.target.checked;

            if (checked) {
                document.getElementById("viewer").className = "primes";
            } else {
                document.getElementById("viewer").className = "";
            }
        };
    };
})();