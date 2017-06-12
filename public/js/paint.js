const socket = io('http://localhost:3000');

let username;
do {
    username = prompt('Bitte Usernamen angeben:', guid());
} while(username == null || username == "");

let points = [];

// generate random color
let color = getRandomColor();
$('#colorpreview span').css('background-color', color);

socket.emit('login', {
  username,
  color
});

socket.on('setup', p => {
  points = p;
  drawAll();
});

socket.on('draw', point => {
  points.push(point);
  draw(point);
});

socket.on('users', users => {
  for(let user in users) {
    print(user + '<span style="background-color:' + users[user] + ';"></span>');
  }
});

socket.on('message', msg => {
  print(msg);
});

socket.on('changeColor', _color => {
  color = _color;
  $('#colorpreview span').css('background-color', _color);
});

$('#commandline').on('keydown', e => {
  if(e.keyCode == 13) {

    socket.emit('command', $('#commandline').val());

    $('#commandline').val('');
  }
});

function print(item) {

  const id = guid();

  setTimeout(() => {
    $('#' + id).remove();
  }, 5000)

  $('#list').append('<div class="listitem" id="' + id + '">' + item + '</div>');
}

function draw(point) {

  console.log(point);

  const p = {
    x1: Math.round(point.x1 * width - width * 0.15),
    y1: Math.round(point.y1 * height),
    x2: Math.round(point.x2 * width - width * 0.15),
    y2: Math.round(point.y2 * height)
  }

  ctx.strokeStyle = point.color;
  ctx.fillStyle = point.color;

  ctx.beginPath();
  ctx.moveTo(p.x1, p.y1);
  ctx.lineTo(p.x2, p.y2);
  ctx.stroke();
}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(let i = 0; i < points.length; i++) {
    draw(points[i]);
  }
}

function createPoint(e) {
  const p = {
    x1: e.x / width,
    y1: e.y / height,
    x2: mouse.x / width,
    y2: mouse.y / height,
    username,
    color
  }

  points.push(p);

  return p;
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
