// Lightweight 3D particle field + interactive depth effects.
const canvas = document.getElementById("bg");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, .1, 100);
camera.position.z = 7;
const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const geo = new THREE.BufferGeometry();
const count = 900;
const pos = new Float32Array(count * 3);
for(let i=0;i<count;i++){
  pos[i*3] = (Math.random()-.5)*15;
  pos[i*3+1] = (Math.random()-.5)*10;
  pos[i*3+2] = (Math.random()-.5)*8;
}
geo.setAttribute("position", new THREE.BufferAttribute(pos,3));
const mat = new THREE.PointsMaterial({size:.018, transparent:true, opacity:.35, color:0x111111});
const particles = new THREE.Points(geo,mat);
scene.add(particles);

let mx=0,my=0;
addEventListener("pointermove",e=>{
  mx=(e.clientX/innerWidth-.5)*2;
  my=(e.clientY/innerHeight-.5)*2;
});
function animate(){
  particles.rotation.y += .0007;
  particles.rotation.x += .00025;
  camera.position.x += (mx*.18-camera.position.x)*.02;
  camera.position.y += (-my*.12-camera.position.y)*.02;
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
animate();

addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});

const progress=document.getElementById("progress");
addEventListener("scroll",()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(scrollY/max*100)+"%";
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal, .project-card, .info-card, .edu-card, .timeline").forEach(el=>observer.observe(el));

document.querySelectorAll(".tilt").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateZ(5px)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

const photo=document.getElementById("photoCard");
if(photo){
  photo.addEventListener("pointermove",e=>{
    const r=photo.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    photo.style.transform=`perspective(900px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`;
  });
  photo.addEventListener("pointerleave",()=>photo.style.transform="");
}
