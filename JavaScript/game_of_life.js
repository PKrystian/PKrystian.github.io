const size_of_field = 50; // Define the size of the game field
const interval_time = 200; // Define the time interval in milliseconds for generating new generations
const max_repeating = 5; // Define the maximum number of times the same generation can be repeated before restarting the game
const random_fill = 0.3; // Define the percentage of random alive cells to be created at the start of the game
var html_elements = []; // An array of HTML elements used for rendering the game field
var cells = []; // An array representing the state of the game field
var dead_cell = 0; // The value representing a dead cell
var alive_cell = 1; // The value representing an alive cell
var count_generations = 0; // A counter to keep track of the number of generations passed
var previous_generations = []; // An array of previous generations used for detecting repeating patterns

// A function that creates the game field and initializes the game state

function create_field_gol() 
{
    html_elements = [];
    cells = [];
    var table = document.getElementById("game_of_life_field"); // Get the HTML table element
    table.innerHTML = ""; // Clear the table content, useful when next generation starts
    for (var y = 0; y < size_of_field; y++) 
    {
        var tr = document.createElement("tr"); // Create a new HTML table row element
        var td_elements = [];
        cells.push(new Array(size_of_field).fill(dead_cell)); // Fill the 2D array with dead cells
        html_elements.push(td_elements);
        table.appendChild(tr); // Append the new row to the HTML table element
        for (var x = 0; x < size_of_field; x++) 
        {
            var td = document.createElement("td"); // Create a new HTML table data element
            td_elements.push(td);
            tr.appendChild(td); // Append the new data element to the current row
        }
    }
}

// A function to render the game field based on the current game state

function draw_gol() 
{
    for (var y = 0; y < size_of_field; y++) 
    {
        for (var x = 0; x < size_of_field; x++) 
        {
            html_elements[y][x].setAttribute("class", "cell_attribute " + 
            (cells[y][x] == 1 ? "alive_cell_attribute" : "dead_cell_attribute")); // Set the class of each cell element based on whether its alive or dead
        }
    }
}

// A function to count the number of alive neighbors of a cell at (x, y)

function count_neighbours_gol(x, y) 
{
    var count = 0;
    for (dy = -1; dy <= 1; dy++) 
    {
        for (dx = -1; dx <= 1; dx++) 
        {
            var nx = (x + dx + size_of_field) % size_of_field; 
            var ny = (y + dy + size_of_field) % size_of_field;
            count = count + cells[ny][nx];
        }
    }
    return count - cells[y][x]; // Subtract the cell at (x, y) from the count because it was included in the loop
}

// A function to create new generation of cells for the Game of Life simulation

function new_generation_gol() 
{
    var new_cells = [];
    for (var i = 0; i < size_of_field; i++) 
    {
        new_cells.push(new Array(size_of_field).fill(dead_cell)); // Fill the new array with dead cells
    }
    var no_changes = true; // A flag to check if there were any changes in the new generation
    for (var y = 0; y < size_of_field; y++)
    {
        for (var x = 0; x < size_of_field; x++) 
        {
            var neighbours = count_neighbours_gol(x, y); // Count the number of alive neighbors for this cell
            if (cells[y][x] == dead_cell && neighbours == 3) // If the cell is dead and has exactly 3 alive neighbors, it becomes alive in the new generation
            {
                new_cells[y][x] = alive_cell;
                if (cells[y][x] != new_cells[y][x]) // Check if there was a change from the previous generation
                {
                    no_changes = false;
                }
            }
            if (cells[y][x] == alive_cell && (neighbours == 2 || neighbours == 3)) // If the cell is alive and has 2 or 3 alive neighbors, it stays alive in the new generation
            {
                new_cells[y][x] = alive_cell;
                if (cells[y][x] != new_cells[y][x]) // Check if there was a change from the previous generation
                {
                    no_changes = false;
                }
            }
        }
    }
    cells = new_cells; // Replace the old generation with the new one
    draw_gol(); // Draw the new generation on the canvas
    var alldead_cell = true; // A flag to check if all cells are dead
    for (var y = 0; y < size_of_field; y++) 
    {
        for (var x = 0; x < size_of_field; x++) 
        {
            if (cells[y][x] == alive_cell) // If there is at least one alive cell, not all cells are dead
            {
                alldead_cell = false;
                break;
            }
        }
        if (!alldead_cell) // If there is at least one alive cell, not all cells are dead
        {
            break;
        }
    }
    if (alldead_cell || no_changes || check_repeating_gol(cells)) // If all cells are dead, there were no changes, or the new generation is repeating a previous one, increase the generation count
    {
        count_generations++;
    } 
    else{
        count_generations = 0; // Otherwise, reset the generation count
    }
    if (count_generations >= max_repeating) // If the generation count exceeds the maximum allowed repetitions, start a new simulation
    {
        start_gol();
        count_generations = 0; // Reset the generation count
        previous_generations = []; // Clear the previous generations array
    } 
    else{
        previous_generations.push(JSON.stringify(cells)); // Add the current generation to the previous generations array
    }
}

// A function that checks if the current generation of cells has already occurred by comparing it to the previous generations of cells using JSON.stringify

function check_repeating_gol(cells) 
{
    var current_generation = JSON.stringify(cells);
    for (var i = 0; i < previous_generations.length; i++) 
    {
        if (previous_generations[i] === current_generation) 
        {
            return true;
        }
    }
    return false;
}

// A function that initializes a new Game of Life simulation

function start_gol() 
{
    create_field_gol();
    for (var i = 0; i < Math.floor(size_of_field * size_of_field * random_fill); i++) 
    {
        var x, y;

        // Randomly choose a cell and set it to alive

        while(true)
        {
            x = Math.floor(Math.random() * size_of_field);
            y = Math.floor(Math.random() * size_of_field);
            if (cells[y][x] == dead_cell) 
            {
                cells[y][x] = alive_cell;
                break;
            }
        }
    }
    draw_gol(); // Draw the initial field on the canvas
    setInterval(new_generation_gol, interval_time); // Set a timer to update the field with new generations
}