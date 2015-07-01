/// <reference path="LsGenerator.ts" />
/// <reference path="PrimeGenerator.ts" />

module Ls3 {
    /**
     * 
     */
    export class LsViewer {
        /**
         * 
         */
        public generator: Ls3.LsGenerator;

        /**
         * 
         */
        public search: any;

        /**
         * 
         */
        public increment: number;

        /**
         * 
         */
        public current: number;

        /**
         * 
         */
        public container: HTMLElement;

        /**
         * 
         */
        public primeGenerator: Ls3.PrimeGenerator;

        /**
         * 
         */
        constructor(settings: any) {
            this.generator = new Ls3.LsGenerator(
                {
                    "keepExcludesOf": true
                }),

            this.search = this.generateSearch(location.search),
            this.increment = 100,
            this.current = 0,
            this.container = document.getElementById("viewer"),
            this.primeGenerator = new Ls3.PrimeGenerator();

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

            // Continue button continues from a user-selected start
            document.getElementById("skipperButton").onclick = function (): void {
                var skipper: HTMLInputElement = <HTMLInputElement>document.getElementById("skipperStart"),
                    value: number = parseInt(skipper.value);

                this.generateNext(1, value);
            }.bind(this);

            // The continue button also cannot go below the current maximum
            document.getElementById("skipperStart").onchange = function (event) {
                var value = parseInt(event.target.value);
                if (value < this.generator.maximum + 1) {
                    event.target.value = this.generator.maximum + 1;
                }

                event.target.style.color = this.generator.excludedMap[value] ? "red" : "black";
            }.bind(this);

            // Adder button adds a user-selected amount of numbers
            document.getElementById("adderButton").onclick = function () {
                var adder: HTMLInputElement = <HTMLInputElement>document.getElementById("adderAmount"),
                    amount: number = parseInt(adder.value);

                this.generateNext(amount);
            }.bind(this);
        }

        /**
         * 
         */
        public generateNext(amount: number, startFrom?: number) {
            var primes = this.primeGenerator.primes,
                cap = this.current + amount,
                row, cell, span, generated, excludes,
                i, j;

            this.generator.generateNext(amount, startFrom);
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
                cell.className = "deleter";
                cell.textContent = "x";
                cell.onclick = function (index) {
                    this.retractAfter(this.generator.generatedArray[index]);
                }.bind(this, i);
                row.appendChild(cell);

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

            // The continue button should be updated for the new amount
            (<HTMLInputElement>document.getElementById("skipperStart")).value = (this.generator.maximum + 1).toString();
        }

        /**
         * 
         */
        public retractAfter(min) {
            var generatedStart = this.generator.retractAfter(min),
                rows = Array.prototype.slice.call(this.container.querySelectorAll(".row")),
                gaps = Array.prototype.slice.call(this.container.querySelectorAll(".gap")),
                i;

            for (i = generatedStart + 1; i < rows.length; i += 1) {
                this.container.removeChild(rows[i]);
            }

            for (i = (generatedStart / 2 - .5) | 0; i < gaps.length; i += 1) {
                this.container.removeChild(gaps[i]);
            }

            this.current = generatedStart;
        }

        /**
         * 
         */
        public generateSearch(search) {
            if (!search) {
                search = "";
            } else if (search[0] == "?") {
                search = search.substring(1);
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

    }
}
