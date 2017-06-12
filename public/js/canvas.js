const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width * 0.7;
canvas.height = height * 0.5;

// change dimensions of canvas when window is resized
window.onresize = () => {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * 0.7;
  canvas.height = height * 0.5;

  drawAll();
}

ctx.lineWidth = 4;
ctx.lineCap = 'round';

const mouse = {
  drawing: false,
  x: 0,
  y: 0
}

canvas.addEventListener('mousedown', e => {
  e.preventDefault();

  mouse.drawing = true;
  mouse.x = e.x;
  mouse.y = e.y;

  const point = createPoint(e);

  socket.emit('draw', point);

  draw(point);
}, false);

canvas.addEventListener('mousemove', e => {
  e.preventDefault();

  if(mouse.drawing) {

    const point = createPoint(e);

    draw(point);

    mouse.x = e.x;
    mouse.y = e.y;

    socket.emit('draw', point);

  }

}, false);

canvas.addEventListener('mouseup', e => {
  e.preventDefault();

  if(mouse.drawing)
    mouse.drawing = false;

}, false);

canvas.addEventListener('mouseout', e => {
  e.preventDefault();

  if(mouse.drawing)
    mouse.drawing = false;

}, false);
