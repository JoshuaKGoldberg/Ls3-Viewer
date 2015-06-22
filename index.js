/// <reference path="LsGenerator.js" />

document.onreadystatechange = (function () {
    function generateUntil(max, container, generator) {
        var row, cell, span, generated, excludes,
            i, j;

        generator.generateUntil(max);

        for (i = 0; i < generator.generatedArray.length; i += 1) {
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
            container = document.getElementById("viewer");

        generateUntil(50000, container, generator);
    };
})();