const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedCell;
var disableSelect;

window.onload = function() 
{
    //Chạy game khi bấm nút bắt đầu
    id("start-btn").addEventListener ("click", startGame);
   
    for (let i = 0; i < id("number-container").children.length; i++) 
    {
      id("number-container").children[i].addEventListener("click", function()
       {
        //Nếu ta chọn
        if (!disableSelect) 
        {
          //Nếu số đã dc chọn
          if (this.classList.contains("selected"))
           {
             //Xóa lựa chọn
             this.classList.remove("selected");
         
            }   
            else 
            {
              //Bỏ chọn tất cả số
             for (let i = 0; i < 9; i++)
              {
                  id("number-container").children[i].classList.remove("selected");
              }
              //Chọn Và update biến selectNum
            this.classList.add("selected");
             selectedNum =this;   
             updateMove ();
          }
      }
    });
  }
}
  function startGame()
 {
//Tạo lựa chọn độ khó
  let board;
  if (id("diff-1").checked) board = easy[0];
  else if (id("diff-2").checked) board = medium[0];
  else board = hard[0];
  lives = 5;
  disableSelect = false;
    id("lives").textContent = "Lượt thử còn lại: 5";
      //Tạo bảng độ khó
   generateBoard(board);
   //Chỉnh thời gian
   startTimer ();

 //Hiện số cần chọn
id("number-container").classList.remove("hidden");
}


function generateBoard(board) 
 {
//Xóa bảng trc đó
 clearPrevious();
//Tăng id ô
let idCount = 0; 
//Tạo 81 ô
for (let i = 0; i < 81; i++) 
{                 
  let cell = document.createElement ("p");
  //Nếu ô k trống
  if (board.charAt(i) != "-") {
    //Đặt ô thành số đúng
    cell.textContent = board.charAt(i); 
  } else {
    //Add click event listener vào ô
    cell.addEventListener ("click", function() {
      if (!disableSelect) {
        //Nếu ô đã dc chọn
        if (this.classList.contains("selected")) {
          //Sau đó bỏ lựa chọn
            this.classList.remove("selected"); 
            selectedCell = null;
        }
          else {
          //Bỏ chọn hết tất cả ô
          for (let i = 0; i < 81; i++) {
            qsa(".cell")[i].classList.remove("selected");
          }
          cell.classList.add("selected");
          selectedCell = cell;
          updateMove();
        }
      }  
    });
  }
            
 cell.id = idCount;
  //Tăng tiến ô tiếp theo
  idCount ++;

cell.classList.add("cell");
if ((cell.id > 17 && cell.id < 27) || (cell.id > 44 & cell.id < 54))
 {
  cell.classList.add("bottomBorder");
}
if ((cell.id + 1) % 9 == 3 || (cell.id + 1) % 9 == 6) 
{
  cell.classList.add("rightBorder");
}
//Thêm ô vào bảng                                                                    
id("board").appendChild(cell);
    }
}


function updateMove() {
  // Nếu số và ô cùng dc chọn
  if (selectedCell && selectedNum) {
   // Đặt ô vs số chọn
    selectedCell.textContent = selectedNum.textContent;
    if (checkCorrect(selectedCell))
     {
      //Bỏ chọn ô
        selectedCell.classList.remove("selected");
        selectedNum.classList.remove("selected");
        selectedNum = null;
        selectedCell = null;
        //Xem bảng đã hoàn thành chưa
       if (checkDone())
        {
          endGame ();
         }
       // Nếu số ko đúng với đáp án
       } 
       else {
  //Ngắt lựa chọn trong 1 s
  disableSelect = true;
  //Làm ô thành màu đỏ
  selectedCell.classList.add("incorrect");
 

  setTimeout (function() {
   //Trừ mạng đi 1 lần
   lives --;
   //Nếu hết mạng thì end game
   if (lives === 0) 
   {
     endGame ();
    } 
     else 
       {
        //Nếu mạng chưa phải là 0 
          //Update Lại dòng Lives
         id("lives").textContent = "Lượt thử còn lại: " + lives; 
        //Cho phép chọn số và ô                              
        disableSelect = false;
      }
      selectedCell.classList.remove("incorrect");
      selectedCell.classList.remove("selected");
      selectedNum.classList.remove("selected");
      selectedCell.textContent = "";
      selectedCell = null;
      selectedNum = null;
     }, 1000);
    }
  }
}


function checkDone() 
{
  let cells = qsa(".cell");
  for (let i = 0; i < cells.length; i++)
   { 
    if (cells[i].textContent === "") return false;
   }
   return true;
}


function endGame() {
  //Dừng trò chơi và thơi gian
  disableSelect = true; 
  clearTimeout (timer);
  //Hiện thắng or thua
  if (lives === 0 || timeRemaining === 0) {
    id("lives").textContent = "Bạn thua!";
  } else {
    id("lives").textContent = "Bạn thắng!";
  }
}

function checkCorrect(cell) 
{
  //Đặt lời giải dựa theo độ khó lời giải
  let solution;
  if (id("diff-1").checked) solution = easy[1];
 else if (id("diff-2").checked) solution = medium[1];
 else solution = hard[1];
 // Nếu số của ô đúng với số đáp án
  if (solution.charAt (cell.id) === cell.textContent) return true;
  else 
  return false;                                     
}
    

function clearPrevious ()
{
 //Truy cập vào tất cả ô
 let cells = qsa(".cell"); 
 //Xóa ô
for (let i = 0; i < cells.length; i++) 
  {
    cells[i].remove();
  }
  //Xóa thời gian sau game
if (timer) clearTimeout(timer);
//Bỏ chọn số
for (let i = 0; i < id("number-container").children.length; i++)
 {
  id("number-container").children[i].classList.remove("selected");
//Xóa biến chọn
selectedCell = null;
selectedNum = null;
  }
}

function startTimer() {
   if (id("time-1").checked) timeRemaining = 180;
  else if (id("time-2").checked) timeRemaining = 300;
  else timeRemaining = 600;
   id("timer").textContent = timeConversion (timeRemaining);
   // Đặt thời gian update theo từng giây
   timer = setInterval(function() {
    timeRemaining --;
    // Nếu hết tg thì end game
    if (timeRemaining === 0) endGame ();
    id("timer").textContent = timeConversion (timeRemaining);
  }, 1000)
}
   //Chỉnh thời gian theo MM:SS
function timeConversion(time) {
  let minutes = Math.floor(time /60);
  if (minutes < 10) minutes =  "0" + minutes;
  let seconds =   time % 60;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;           
}

//Hàm hỗ trợ
function id(id) 
{
 return document.getElementById(id);
}
function qs(selector)
 {
    return document.querySelector(selector);
}
function qsa(selector)
 {
    return document.querySelectorAll(selector);
 }

    
 
