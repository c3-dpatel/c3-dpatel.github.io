// Load your data
d3.csv("https://c3-dpatel.github.io/data/global-temperature.csv").then(function(data) {
    // Prepare the data
    data.forEach(d => {
        d.year = +d.year;
        d.rainfall = +d.rainfall;
        d.temperature = +d.temperature;
        d.hurricanes = +d.hurricanes;
    });

    // Parameters
    let currentScene = 0;
    let variable = 'rainfall';

    // Function to draw the scene
    function drawScene(variable, annotationTitle, annotationLabel, showDropdown = false) {
        d3.select("#visualization").html("");
        let svg = d3.select("#visualization")
            .append("svg")
            .attr("class", "scene")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", "0 0 960 600");

        let margin = {top: 40, right: 20, bottom: 80, left: 70};
        let width = 960 - margin.left - margin.right;
        let height = 500 - margin.top - margin.bottom;

        let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleLinear().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(data, d => d.year));
        y.domain([d3.min(data, d => d[variable]) - 0.1, d3.max(data, d => d[variable]) + 0.1]);

        let line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d[variable]));

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y));

        // Add labels
        g.append("text")
            .attr("transform", `translate(${width / 2} ,${height + 40})`)
            .style("text-anchor", "middle")
            .text("Year");

        let yLabel = variable.charAt(0).toUpperCase() + variable.slice(1);
        if (variable === 'temperature') {
            yLabel += " Anomaly (°C)";
        } else if (variable === 'rainfall') {
            yLabel += " (mm)";
        } else if (variable === 'hurricanes') {
            yLabel = "Number of Hurricanes";
        }

        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(yLabel);

        // Add title
        svg.append("text")
            .attr("x", (width / 2) + margin.left)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "underline")
            .text(`Global ${yLabel} (1880-2020)`);

        // Annotations
        const annotations = [
            {
                note: {
                    label: annotationLabel,
                    title: annotationTitle
                },
                x: x(2000),
                y: y(d3.mean(data, d => d[variable])),
                dy: -30,
                dx: 30
            }
        ];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);

        // Show individual data points and tooltips in the fourth scene
        if (showDropdown) {
            svg.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.year)+70)
                .attr("cy", d => y(d[variable])+40)
                .attr("r", 3)
                .attr("fill", "red")
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .attr("r", 6)
                        .attr("fill", "orange");

                    svg.append("text")
                        .attr("id", "tooltip")
                        .attr("x", x(d.year)+60)
                        .attr("y", y(d[variable])+30)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "12px")
                        .attr("font-weight", "bold")
                        .text(`${d.year}: ${d[variable]}`);
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .attr("r", 3)
                        .attr("fill", "red");

                    svg.select("#tooltip").remove();
                });

            let navigation = d3.select(".navigation");
            if (navigation.select("#variableDropdown").empty()) {
                let dropdown = navigation.append("select")
                    .attr("id", "variableDropdown")
                    .on("change", function() {
                        variable = this.value;
                        drawScene(variable, annotationTitle, annotationLabel, true);
                    });

                dropdown.selectAll("option")
                    .data(["rainfall", "temperature", "hurricanes"])
                    .enter()
                    .append("option")
                    .attr("value", d => d)
                    .text(d => d.charAt(0).toUpperCase() + d.slice(1));

                dropdown.property("value", variable);
            }
        } else {
            d3.select("#variableDropdown").remove();
        }

    }

    function scene1() {
        drawScene('rainfall', "Rainfall Overview", "Steady rainfall levels");
    }

    function scene2() {
        drawScene('temperature', "Temperature Overview", "Significant increase in temperature");
    }

    function scene3() {
        drawScene('hurricanes', "Hurricanes Overview", "Fluctuations in number of hurricanes");
    }

    function scene4() {
        drawScene(variable, "Interactive Exploration", "Hover over individual data points", true);
    }

    // Navigation buttons
    d3.select("#prev").on("click", function() {
        if (currentScene > 0) {
            currentScene = (currentScene - 1) % 4;
            updateScene();
        }
    });

    d3.select("#next").on("click", function() {
        if (currentScene < 3) {
            currentScene = (currentScene + 1) % 4;
            updateScene();
        }
    });

    function updateScene() {
        if (currentScene === 0) {
            d3.select("#prev").attr("disabled", true);
            scene1();
        } else {
            d3.select("#prev").attr("disabled", null);
        }

        if (currentScene === 3) {
            d3.select("#next").attr("disabled", true);
            scene4();
        } else {
            d3.select("#next").attr("disabled", null);
        }

        if (currentScene === 1) {
            scene2();
        } else if (currentScene === 2) {
            scene3();
        }
    }

    // Initialize the first scene
    updateScene();
});
