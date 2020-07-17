// @TODO: YOUR CODE HERE!
// SVG Wrapper dimensions which we define ourselves.
var svgWidth = 960;
var svgHeight = 500;
// // Alternatively, we can make the height and width responsive based on window size.
// var svgWidth = window.innerWidth;
// var svgHeight = window.innerHeight;

// Setting margin dimensions.
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the SVG Wrapper, appending an SVG group that will hold the chart, 
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(journalData){
    // console.log(journalData);
    // Cast our data as numbers.
    journalData.forEach(function(data) {
        // console.log(data);
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    // console.log(d3.min(journalData, d => d.healthcare));
    // Create scale functions/variables.
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(journalData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(journalData, d => d.healthcare)])
        .range([height, 0])
    
    // Create axis functions.
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

    // Create the circles.
    var circlesGroup = chartGroup.selectAll("circle")
        .data(journalData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("fill", "green")
        .attr("opacity", ".5");


    // Add the State Abbr. text to circles.
    var circleText = chartGroup.selectAll()
        .data(journalData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(d => (d.abbr));

    //Initialize the tool tip.
    // var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .style("background", "black")
        .style("color", "white")
        .html(function(d) {
        return (`${d.state}<hr>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
        });


    // Call the tooltip into the chart.
    chartGroup.call(toolTip);

    // Create the "mouseover" event listener to display the tooltip.
    circlesGroup.on("mouseover", function() {
        d3.select(this)
            .transition()
            .duration(1000)
            .attr("r", 20)
            .attr("fill", "blue");
    })
        .on("click", function(d) {
            toolTip.show(d, this);
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(1000)
                .attr("r", 20)
                .attr("fill", "green")
                toolTip.hide()
        });
    // Create axis labels.
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height /1.5))
        .attr("y", 0 - margin.left)
        .attr("dy", "3em")
        // .attr("value", "hair_length") // value to grab for event listener
        // .classed("active", true)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
        
});