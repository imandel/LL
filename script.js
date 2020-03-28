
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCT3EDBWfF7PVjI2xtBoP4ggZkBbSGWYcU",
    authDomain: "ll-art.firebaseapp.com",
    databaseURL: "https://ll-art.firebaseio.com",
    projectId: "ll-art",
    storageBucket: "ll-art.appspot.com",
    messagingSenderId: "612626647296",
    appId: "1:612626647296:web:3f162a78dd7864e3638be5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const storageService = firebase.storage();
  const storageRef = storageService.ref();
  
  document.querySelector('.file-select').addEventListener('change', handleFileUploadChange);
  document.querySelector('.file-submit').addEventListener('click', handleFileUploadSubmit);
  
  let filein = document.getElementById('filein')
  filein.onchange= (e) => readURL(e);

  let selectedFile;
  function handleFileUploadChange(e) {
  selectedFile = e.target.files[0];
  console.log(selectedFile)

}

const canvas = document.getElementById('imagecanvas');
const ctx = canvas.getContext('2d');

const annotations= document.createElement('canvas')

let canvasx = $(canvas).offset().left;
let canvasy = $(canvas).offset().top;
var last_mousex = last_mousey = 0;
var mousex = mousey = 0;
var mousedown = false;


$(canvas).on('mousedown', function(e) {
  last_mousex = parseInt(e.clientX-canvasx);
  last_mousey = parseInt(e.clientY-canvasy);
    mousedown = true;
});

$(canvas).on('mouseup', function(e) {
    mousedown = false;
});

$(canvas).on('mousemove', function(e) {
  mousex = parseInt(e.clientX - canvasx);
  mousey = parseInt(e.clientY - canvasy);
  if (mousedown) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    ctx.beginPath();
    var width = mousex - last_mousex;
    var height = mousey - last_mousey;
    ctx.rect(last_mousex, last_mousey, width, height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 10;
    ctx.stroke();
  }
  //Output
  // $('#output').html('current: ' + mousex + ', ' + mousey + '<br/>last: ' + last_mousex + ', ' + last_mousey + '<br/>mousedown: ' + mousedown);
});





let baseString;

const image = new Image(); // Using optional size for image
image.onload = drawImageActualSize; // Draw when image has loaded

// Load an image of intrinsic size 300x227 in CSS pixels

function drawImageActualSize() {
  // Use the intrinsic size of image in CSS pixels for the canvas element
  // canvas.width = 2000;
  // canvas.height = 2000;

  // Will draw the image as 300x227, ignoring the custom size of 60x45
  // given in the constructor
  canvas.height = this.height
  canvas.width = this.width
  ctx.drawImage(this, 0, 0);
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,150,75);
  baseString=canvas.toDataURL()
  console.log(canvas.getBoundingClientRect())
  // c
  // To use the custom size we'll have to specify the scale parameters 
  // using the element's width and height properties - lets draw one 
  // on top in the corner:
  // ctx.drawImage(this, 0, 0, this.width, this.height);
}



function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();
    var ctx = document.getElementById('imagecanvas').getContext('2d');
    reader.onload = function (e) {
    image.src=e.target.result
    // document.getElementById('blah').src=e.target.result
    // console.log(img.src)


      // document.getElementById('blah').src=e.target.result
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// function readURL(input) {
//   // console.log(input)
//   var reader = new FileReader();
//   window.rdr=reader
//   window.inp=input

//   if (input.files && input.files[0]) {
//     // var reader = new FileReader();
//     reader.onload = (e) => {
//       console.log("yes?")
//       document.body.appendChild(Object.assign(document.createElement('p'),{innerText: 'test'}))
//     }
//     reader.readAsDataURL(input.files[0]);
//   }
// }
                //     $('#blah')
                //         .attr('src', e.target.result);
                // };

                // reader.readAsDataURL(input.files[0]);
              
let filename='test.jpg'

// function handleFileUploadSubmit(e) {
//   const uploadTask = storageRef.child(`images/${selectedFile.name}`).put(selectedFile); //create a child directory called images, and place the file inside this directory
//   uploadTask.on('state_changed', (snapshot) => {
//   // Observe state change events such as progress, pause, and resume
//   }, (error) => {
//     // Handle unsuccessful uploads
//     console.log(error);
//   }, () => {
//      // Do something once upload is complete
//      alert('Love Letter Uploaded');
//      console.log('success');
// //      window.alert('test');
//   });
// }

function handleFileUploadSubmit(e) {
  console.log(baseString)
  storageRef.child('images/'+ filename).putString(baseString, 'data_url')
    .then(function(snapshot){
      console.log('uploaded data_url')
    })
}

// initDraw(document.getElementById('imagecanvas'));
// function initDraw(canvas) {
//     function setMousePosition(e) {
//         var ev = e || window.event; //Moz || IE
//         if (ev.pageX) { //Moz
//             mouse.x = ev.pageX + window.pageXOffset;
//             mouse.y = ev.pageY + window.pageYOffset;
//         } else if (ev.clientX) { //IE
//             mouse.x = ev.clientX + document.body.scrollLeft;
//             mouse.y = ev.clientY + document.body.scrollTop;
//         }
//     };

//     var mouse = {
//         x: 0,
//         y: 0,
//         startX: 0,
//         startY: 0
//     };
//     var element = null;

//     canvas.onmousemove = function (e) {
//         setMousePosition(e);
//         if (element !== null) {
//             element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
//             element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
//             element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
//             element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
//         }
//     }

//     canvas.onclick = function (e) {
//         if (element !== null) {
//             element = null;
//             canvas.style.cursor = "default";
//             console.log("finsihed.");
//         } else {
//             console.log("begun.");
//             mouse.startX = mouse.x;
//             mouse.startY = mouse.y;
//             element = document.createElement('div');
//             element.className = 'rectangle'
//             element.style.left = mouse.x + 'px';
//             element.style.top = mouse.y + 'px';
//             canvas.appendChild(element)
//             canvas.style.cursor = "crosshair";
//         }
//     }
// }

