/// <reference path="LsGenerator.js" />

document.onreadystatechange = (function () {
    function generateNext(min, max, container, generator) {
        var row, cell, span, generated, excludes,
            i, j;

        generator.generateNext(max - min);

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
            cell.textContent = i;
            row.appendChild(cell);

            cell = document.createElement("span");
            cell.className = "key";
            cell.textContent = generated;
            row.appendChild(cell);

            cell = document.createElement("span");
            cell.className = "values";
            excludes = generator.excludesOf[generated];
            for (j = 0; j < excludes.length; j += 1) {
                span = document.createElement("span");
                span.className = "excluded";
                span.textContent = excludes[j];
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
            container = document.getElementById("viewer");

        if (search.max) {
            generateNext(0, search.max, container, generator);
            current = search.max;
        } else {
            generateNext(0, increment, container, generator);
        }

        setInterval(
            function () {
                if (window.scrollY + window.innerHeight <= document.body.clientHeight - 70) {
                    return;
                }

                for (var i = current; i < current + increment; i += 1) {
                    generateNext(i, i += increment, container, generator);
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
    };
})();