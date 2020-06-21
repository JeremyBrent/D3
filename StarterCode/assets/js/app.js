// @TODO: YOUR CODE HERE!
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

    var states = []
    var stateAbbr = []
    var healthcare = []
    var income = []
    for (var i = 0; i < data.length; i++) {
        states.push(data[i].state)
        stateAbbr.push(data[i].abbr)
        healthcare.push(data[i].healthcare)
        income.push(data[i].income)
    }

    console.log(states)
    console.log(stateAbbr)
    console.log(healthcare)
    console.log(income)

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(income)])
        .range([0, chartWidth])

    var xAxis = d3.axisBottom(xScale)

    chartCanvass.append("g")
        .attr('transform',`translate(0, ${chartHeight})`)
        .call(xAxis);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(healthcare)])
        .range([chartHeight,0])

    var yAxis = d3.axisLeft(yScale)

    chartCanvass.append("g")
        .call(yAxis);
})

