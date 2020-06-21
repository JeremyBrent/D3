
var svgHeight = 500;
var svgWidth = 500;

var margin = {
    top: 20,
    right: 20,
    left: 20,
    bottom: 20
};

var chartWidth = svgWidth - margin.right - margin.left;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append('svg')
    .attr("width", svgHeight)
    .attr('height', svgHeight);

var chartCanvass = svg.append('g')
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv('assets/data/data.csv').then(function (data) {
    console.log(data);

    data.forEach(d => {
        d.healthcare = +d.healthcare;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.poverty = +d.poverty;
        d.smokes = +d.smokes;
    })

    /// Creating the x axis
    var xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.poverty))
        .range([0, chartWidth]);

    var xAxis = d3.axisBottom(xScale);

    chartCanvass.append("g")
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    /// creating the y axis
    var yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.obesity))
        .range([chartHeight, 0]);

    var yAxis = d3.axisLeft(yScale);

    chartCanvass.append("g")
        .call(yAxis);

    /// creating the scatter points
    var chartDots = chartCanvass.selectAll("circle")
        .data(data)
        .enter()
        .append("g");

    chartDots.append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.obesity))
        .attr("r", 8);

    chartDots.append("text")
        .text(d => d.abbr)
        .classed("stateText", true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.obesity));

    /// Creating tool tips
    var toolTip = chartCanvass.append("div")
        .attr("class", "tooltip");

    chartDots.on("mouseover", function (d, i) {
        toolTip.style("display", "block");
        toolTip.html(`<strong>State:</strong> ${d.state[i]}`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
    }).on("mouseout", function () {
            toolTip.style("display", "none");
        });
})

