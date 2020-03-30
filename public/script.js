
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

const pages= document.getElementById('pages')




let i =0;
function drawImageActualSize() {
  ++i;
  const page = Object.assign(document.createElement('div'), {id: 'page-'+i, className: 'page'})
  const canvasContainer = Object.assign(document.createElement('div'), {className: 'canvas-container'})
  const canvas = Object.assign(document.createElement('canvas'), {id: 'imagecanvas-'+i, className: 'image-canvas', height: this.height, width: this.width})
  const annotations = Object.assign(document.createElement('canvas'), {id: 'annotation-canvas-'+i, className: 'annotation-canvas', height: this.height, width: this.width})
  
  canvasContainer.appendChild(canvas);
  canvasContainer.appendChild(annotations);
  page.appendChild(canvasContainer);
  pages.appendChild(page);
  pages.appendChild(document.createElement('br'));
  const ctx = canvas.getContext('2d');
  const annotation_ctx = annotations.getContext('2d');
  
  annotations.onmousedown = canvasMouseDown;
  annotations.onmouseup = canvasMouseUp;
  annotations.onmousemove = canvasMouseMove;

  annotations.ontouchstart = handleStart;
  annotations.ontouchend = handleEnd;
  annotations.ontouchmove = handleMove;

  ctx.drawImage(this, 0, 0);
}

function readURL(input) {
  if (input.files && input.files[0]) {
    const files = input.files;
    Array.from(files).forEach((file) =>{
      const reader = new FileReader();
      const image = new Image();
      image.onload = drawImageActualSize
      reader.onload = (e) =>{
        image.src=e.target.result
      };
      reader.readAsDataURL(file);
    })
  }
}

function handleFileUploadSubmit(e) {
  const baseString=[...document.querySelectorAll(".image-canvas")].map(n => n.toDataURL())
  const fileBase=  Date.now()+'.jpg';
  const progressBar = document.getElementById('progress');
  const sent = document.getElementById('pageNo');

  sent.innerText= '0/' +baseString.length;
  progressBar.parentElement.style.display= "block";
  progressBar.parentElement.style.top= "0px";
  

  baseString.forEach((base, i)=>{
    var uploadTask = storageRef.child('images/'+i+'_'+fileBase).putString(base, 'data_url')
    uploadTask.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is '+ progress + "% done")
      progressBar.value=progress
      switch(snapshot.state){
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      console.log(error)
    }, function(){
      console.log('upload success')
      ++i
      sent.innerText= ' '+i+'/' +baseString.length;
      if(i===baseString.length){
        document.getElementById('upload').innerText='Upload Success!'
        setTimeout(()=> {location.reload(true)}, 1000)
      }
    })
    //   .then(function(snapshot){
    //     console.log('uploaded file '+i)
    //     ++sent;
    //     console.log(sent);
    //   })
    // if (sent===baseString.length){
    //   console.log('here')
    //   alert("love letter uploaded")
    // }

  })
}

let canvasx;// = $(canvas).offset().left;
let canvasy;// = $(canvas).offset().top;

var last_mousex = last_mousey = 0;
var mousex = mousey = 0;
var mousedown = false;

function canvasMouseDown(e){
  var BB=this.getBoundingClientRect();
  canvasx=BB.left;
  canvasy=BB.top;
  last_mousex =  Math.round( (e.clientX-canvasx) * (this.width / this.offsetWidth) );//parseInt(e.clientX-canvasx);
  last_mousey = Math.round( (e.clientY-canvasy) * (this.height / this.offsetHeight) );//parseInt(e.clientY-canvasy);
  mousedown = true;
}

function canvasMouseUp(e){
   mousedown = false;
   let imagecanvas_ctx= $(this).prev('.image-canvas')[0].getContext('2d')
   imagecanvas_ctx.drawImage(this, 0, 0);

}

function canvasMouseMove(e){
  mousex = Math.round( (e.clientX-canvasx) * (this.width / this.offsetWidth) );//parseInt(e.clientX - canvasx);
  mousey = Math.round( (e.clientY-canvasy) * (this.height / this.offsetHeight) );//parseInt(e.clientY - canvasy);
  let ctx = this.getContext('2d');
  if (mousedown) {
    ctx.clearRect(0, 0, this.width, this.height); //clear canvas
    ctx.beginPath();
    var width = mousex - last_mousex;
    var height = mousey - last_mousey;
    ctx.fillRect(last_mousex, last_mousey, width, height);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}

// document.addEventListener("touchmove", handleMove, false);

function handleStart(e) {
  e.preventDefault();
  if(e.touches.length===1){
    console.log(e.touches[0].clientX)
    var BB=this.getBoundingClientRect();
    canvasx=BB.left;
    canvasy=BB.top;
    last_mousex =  Math.round( (e.touches[0].clientX-canvasx) * (this.width / this.offsetWidth) );//parseInt(e.clientX-canvasx);
    last_mousey = Math.round( (e.touches[0].clientY-canvasy) * (this.height / this.offsetHeight) );//parseInt(e.clientY-canvasy);
    mousedown = true;
  }
}

function handleEnd(e){
  e.preventDefault();
    mousedown = false;
    let imagecanvas_ctx= $(this).prev('.image-canvas')[0].getContext('2d')
    imagecanvas_ctx.drawImage(this, 0, 0);
  
}

function handleMove(e){
  e.preventDefault()
  if(e.touches.length===1){
    mousex = Math.round( (e.touches[0].clientX-canvasx) * (this.width / this.offsetWidth) );//parseInt(e.clientX - canvasx);
    mousey = Math.round( (e.touches[0].clientY-canvasy) * (this.height / this.offsetHeight) );//parseInt(e.clientY - canvasy);
    let ctx = this.getContext('2d');
    if (mousedown) {
      ctx.clearRect(0, 0, this.width, this.height); //clear canvas
      ctx.beginPath();
      var width = mousex - last_mousex;
      var height = mousey - last_mousey;
      ctx.fillRect(last_mousex, last_mousey, width, height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  }
}
