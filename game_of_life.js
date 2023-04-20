const size_of_field = 50;
const interval_time = 200;
const max_repeating = 5;
const random_fill = 0.3;
var html_elements = [];
var cells = [];
var dead_cell = 0;
var alive_cell = 1;
var count_generations = 0;
var previous_generations = [];

function create_field_gol() 
{
    html_elements = [];
    cells = [];
    var table = document.getElementById("game_of_life_field");
    table.innerHTML = "";
    for (var y = 0; y < size_of_field; y++) 
    {
        var tr = document.createElement("tr");
        var td_elements = [];
        cells.push(new Array(size_of_field).fill(dead_cell));
        html_elements.push(td_elements);
        table.appendChild(tr);
        for (var x = 0; x < size_of_field; x++) 
        {
            var td = document.createElement("td");
            td_elements.push(td);
            tr.appendChild(td);
        }
    }
}

function draw_gol() 
{
    for (var y = 0; y < size_of_field; y++) 
    {
        for (var x = 0; x < size_of_field; x++) 
        {
            html_elements[y][x].setAttribute
            ("class", "cell_attribute " + (cells[y][x] == 1 ? "alive_cell_attribute" : "dead_cell_attribute"));
        }
    }
}

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
    return count - cells[y][x];
}

function new_generation_gol() 
{
    var new_cells = [];
    for (var i = 0; i < size_of_field; i++) 
    {
        new_cells.push(new Array(size_of_field).fill(dead_cell));
    }
    var no_changes = true;
    for (var y = 0; y < size_of_field; y++)
    {
        for (var x = 0; x < size_of_field; x++) 
        {
            var neighbours = count_neighbours_gol(x, y);
            if (cells[y][x] == dead_cell && neighbours == 3) 
            {
                new_cells[y][x] = alive_cell;
                if (cells[y][x] != new_cells[y][x]) 
                {
                    no_changes = false;
                }
            }
            if (cells[y][x] == alive_cell && (neighbours == 2 || neighbours == 3)) 
            {
                new_cells[y][x] = alive_cell;
                if (cells[y][x] != new_cells[y][x]) 
                {
                    no_changes = false;
                }
            }
        }
    }
    cells = new_cells;
    draw_gol();
    var alldead_cell = true;
    for (var y = 0; y < size_of_field; y++) 
    {
        for (var x = 0; x < size_of_field; x++) 
        {
            if (cells[y][x] == alive_cell) 
            {
                alldead_cell = false;
                break;
            }
        }
        if (!alldead_cell) 
        {
            break;
        }
    }
    if (alldead_cell || no_changes || check_repeating_gol(cells)) 
    {
        count_generations++;
    } 
    else{
        count_generations = 0;
    }
    if (count_generations >= max_repeating) 
    {
        start_gol();
        count_generations = 0;
        previous_generations = [];
    } 
    else{
        previous_generations.push(JSON.stringify(cells));
    }
}

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

function start_gol() 
{
    create_field_gol();
    for (var i = 0; i < Math.floor(size_of_field * size_of_field * random_fill); i++) 
    {
        var x, y;
        while(true)
        {
            x = Math.floor(Math.random() * size_of_field);
            y = Math.floor(Math.random() * size_of_field);
            if (cells[y][x] == dead_cell) 
            {
                cells[y][x] = alive_cell;
                break;
            }
        };
    }
    draw_gol();
    setInterval(new_generation_gol, interval_time);
}