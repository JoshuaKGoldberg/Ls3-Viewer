/// <reference path="LsGenerator.js" />

document.onreadystatechange = (function () {
    function generateNext(min, max, container, generator) {
        var row, cell, span, generated, excludes,
            i, j;

        generator.generateNext(max - min);

        for (i = min; i < generator.generatedArray.length; i += 1) {
            row = document.createElement("div");
            row.className = "row";

            generated = generator.generatedArray[i];

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

    return function (event) {
        if (event.target.readyState !== "complete") {
            return;
        }

        var generator = new LsGenerator(
            {
                "keepExcludesOf": true
            }),
            increment = 100,
            current = 0,
            container = document.getElementById("viewer");

        setInterval(
            function () {
                console.log(window.scrollY, "&", window.innerHeight, " vs", document.body.clientHeight - 70);
                if (window.scrollY + window.innerHeight > document.body.clientHeight - 70) {
                    generateNext(current, current += increment, container, generator);
                }
            },
            70);
    };
})();