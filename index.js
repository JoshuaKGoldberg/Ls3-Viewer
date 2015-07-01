/// <reference path="PrimeGenerator.js" />
/// <reference path="LsGenerator.js" />
/// <reference path="LsViewer.js" />

document.onreadystatechange = function (event) {
    if (event.target.readyState !== "complete") {
        return;
    }

    window.viewer = new Ls3.LsViewer();
};
