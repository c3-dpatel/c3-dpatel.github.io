// Load your data
d3.csv("data/global-temperature.csv").then(function(data) {
    // Prepare the data
    data.forEach(d => {
        d.year = +d.year;
        d.temperature = +d.temperature;
    });

    // Parameters
    let currentScene = 0;

    // Set up scenes
    function scene1() {
        d3.select("#visualization").html("");
        let svg = d3.select("#visualization")
            .append("svg")
            .attr("class", "scene")
            .attr("width", "100%")
            .attr("height", "100%");

        let margin = {top: 20, right: 20, bottom: 30, left: 50};
        let width = +svg.attr("width") - margin.left - margin.right;
        let height = +svg.attr("height") - margin.top - margin.bottom;

        let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleLinear().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(data, d => d.year));
        y.domain(d3.extent(data, d => d.temperature));

        let line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.temperature));

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y));

        // Annotations
        const annotations = [
            {
                note: {
                    label: "Significant increase in temperature",
                    title: "Trend Overview"
                },
                x: x(2000),
                y: y(0.5),
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
    }

    function scene2() {
        d3.select("#visualization").html("");
        let svg = d3.select("#visualization")
            .append("svg")
            .attr("class", "scene")
            .attr("width", "100%")
            .attr("height", "100%");

        // Same setup as scene1 with different annotations
        let margin = {top: 20, right: 20, bottom: 30, left: 50};
        let width = +svg.attr("width") - margin.left - margin.right;
        let height = +svg.attr("height") - margin.top - margin.bottom;

        let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleLinear().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(data, d => d.year));
        y.domain(d3.extent(data, d => d.temperature));

        let line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.temperature));

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y));

        // Annotations
        const annotations = [
            {
                note: {
                    label: "Sharp increase in temperature after 1970",
                    title: "Climate Change Highlight"
                },
                x: x(1970),
                y: y(0.2),
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
    }

    function scene3() {
        d3.select("#visualization").html("");
        let svg = d3.select("#visualization")
            .append("svg")
            .attr("class", "scene")
            .attr("width", "100%")
            .attr("height", "100%");

        // Same setup as scene1 with different annotations
        let margin = {top: 20, right: 20, bottom: 30, left: 50};
        let width = +svg.attr("width") - margin.left - margin.right;
        let height = +svg.attr("height") - margin.top - margin.bottom;

        let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        let x = d3.scaleLinear().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        x.domain(d3.extent(data, d => d.year));
        y.domain(d3.extent(data, d => d.temperature));

        let line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.temperature));

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y));

        // Annotations
        const annotations = [
            {
                note: {
                    label: "Recent temperature trends and future projections",
                    title: "Future Projections"
                },
                x: x(2020),
                y: y(1.0),
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
    }

    // Triggers
    d3.select("body").on("keydown", function(event) {
        if (event.key === "ArrowRight") {
            currentScene = (currentScene + 1) % 3;
        } else if (event.key === "ArrowLeft") {
            currentScene = (currentScene - 1 + 3) % 3;
        }
        updateScene();
    });

    function updateScene() {
        if (currentScene === 0) {
            scene1();
        } else if (currentScene === 1) {
            scene2();
        } else if (currentScene === 2) {
            scene3();
        }
    }

    // Initialize the first scene
    updateScene();
});
