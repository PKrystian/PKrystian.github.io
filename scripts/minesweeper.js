function start_game()
{
    var x_axis = document.getElementById("get_x_board").value;
    x_axis = parseInt(x_axis);

    var y_axis = document.getElementById("get_y_board").value;
    y_axis = parseInt(y_axis);

    var how_much_mines = document.getElementById("get_num_mines").value;
    how_much_mines = parseInt(how_much_mines);

    const game_outcome = document.getElementById("game_outcome");
    game_outcome.innerHTML = "";

    const board_element = document.querySelector('.board');
    board_element.innerHTML = "";

    const timer_element = document.querySelector('.timer');
    timer_element.textContent = "Time: 0s";

    const game = new Minesweeper(x_axis, y_axis, how_much_mines);
}

class Minesweeper 
{
  constructor(rows, cols, num_of_mines) 
  {
    this.rows = rows;
    this.cols = cols;
    this.num_of_mines = num_of_mines;
    this.board = [];
    this.is_game_over = false;
    this.time_start = null;
    this.timer_element = document.querySelector('.timer');
    this.draw_board();
    this.draw_mines();
    this.calculate_adjacent_mines();
    this.start_timer();
  }

  draw_board() 
  {
    const board_element = document.querySelector('.board');
    for (let i = 0; i < this.rows; i++) 
    {
      const row = document.createElement('tr');
      const row_data = [];
      for (let j = 0; j < this.cols; j++) 
      {
        const cell = document.createElement('td');
        cell.classList.add('cell', 'unopened');
        cell.addEventListener('click', () => this.handle_left_click(i, j));
        cell.addEventListener('contextmenu', (event) => this.handle_right_click(event, i, j));
        row.appendChild(cell);
        row_data.push(
        {
          element: cell,
          has_mine: false,
          adjacent_mines: 0,
          is_open: false,
          is_flag: false
        });
      }
      this.board.push(row_data);
      board_element.appendChild(row);
    }
  }

  draw_mines() 
  {
    let placed_mines = 0;
    while (placed_mines < this.num_of_mines) 
    {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (!this.board[row][col].has_mine) 
      {
        this.board[row][col].has_mine = true;
        placed_mines++;
      }
    }
  }

  calculate_adjacent_mines() 
  {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];  
    for (let i = 0; i < this.rows; i++) 
    {
      for (let j = 0; j < this.cols; j++) 
      {
        if (!this.board[i][j].has_mine) 
        {
          let count = 0;
          for (const [dx, dy] of directions) 
          {
            const new_row = i + dx;
            const new_col = j + dy;
            if (new_row >= 0 && new_row < this.rows && new_col >= 0 && new_col < this.cols && this.board[new_row][new_col].has_mine)
            {
              count++;
            }
          }
          this.board[i][j].adjacent_mines = count;
        }
      }
    }
  }

  handle_left_click(row, col) 
  {
    const cell = this.board[row][col];
    if (this.is_game_over || cell.is_open || cell.is_flag) 
    {
      return;
    } 
    if (cell.has_mine) 
    {
      this.end_game(false);
    }else{
      this.show_cell(row, col);
      if (this.check_if_win()) 
      {
        this.end_game(true);
      }
    }
  }

  handle_right_click(event, row, col) 
  {
    event.preventDefault();
    const cell = this.board[row][col];
    if (this.is_game_over || cell.is_open) 
    {
      return;
    }        
    cell.is_flag = !cell.is_flag;
    if (cell.is_flag) 
    {
      cell.element.classList.add('flagged');
    }else{
      cell.element.classList.remove('flagged');
    }
  }

  show_cell(row, col) 
  {
    const cell = this.board[row][col];
    if (cell.is_open || cell.is_flag)
    {
      return;
    }
    cell.is_open = true;
    cell.element.classList.remove('unopened');
    cell.element.classList.add('opened');
    if (cell.adjacent_mines > 0) {
    cell.element.textContent = cell.adjacent_mines;
    }else{
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];
      for (const [dx, dy] of directions) 
      {
        const new_row = row + dx;
        const new_col = col + dy;
        if (new_row >= 0 && new_row < this.rows && new_col >= 0 && new_col < this.cols) 
        {
          this.show_cell(new_row, new_col);
        }
      }
    }
  }

  check_if_win() 
  {
    let num_of_open_cells = 0;      
    for (let i = 0; i < this.rows; i++) 
    {
      for (let j = 0; j < this.cols; j++) 
      {
        if (!this.board[i][j].has_mine && this.board[i][j].is_open) 
        {
          num_of_open_cells++;
        }
      }
    }
    return num_of_open_cells === (this.rows * this.cols) - this.num_of_mines;
  }

  start_timer() 
  {
    this.time_start = new Date().getTime();
    this.update_timer();
  }      

  update_timer() 
  {
    if (this.is_game_over) 
    {
      curr_time = new Date().getTime();
      return;
    }
    const curr_time = new Date().getTime();
    const time_since = Math.floor((curr_time - this.time_start) / 1000);
    this.timer_element.textContent = `Time: ${time_since}s`;
    setTimeout(() => {
      this.update_timer();
    }, 1000);
  }

  end_game(is_won) 
  {
    this.is_game_over = true;
    for (let i = 0; i < this.rows; i++) 
    {
      for (let j = 0; j < this.cols; j++) 
      {
        const cell = this.board[i][j];            
        if (cell.has_mine) 
        {
          cell.element.textContent = '*';
          cell.element.classList.add('mine');
        }
        cell.element.removeEventListener('click', this.handle_left_click);
        cell.element.removeEventListener('contextmenu', this.handle_right_click);
      }
    }
    if (is_won) 
    {
      var game_outcome = document.getElementById("game_outcome");
      game_outcome.innerHTML = "You won! Congratulations!"
    }else{
      var game_outcome = document.getElementById("game_outcome");
      game_outcome.innerHTML = "You lost! Try again!"
    }
  }
}