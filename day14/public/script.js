const tokenKey = 'blog_token';
const postsEl = document.getElementById('posts');
const authArea = document.getElementById('auth-area');
const createPostSec = document.getElementById('create-post');

function getToken() { return localStorage.getItem(tokenKey); }
function setToken(t) { t ? localStorage.setItem(tokenKey, t) : localStorage.removeItem(tokenKey); }

async function loadPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  postsEl.innerHTML = posts.map(p=>`<div class="post"><h3>${p.title}</h3><p>${p.content}</p></div>`).join('');
}

async function loadUser() {
  const token = getToken();
  if (!token) {
    authArea.innerHTML = `<button onclick="showLogin()">Login</button><button onclick="showRegister()">Register</button>`;
    createPostSec.style.display = 'none';
    return;
  }
  const res = await fetch('/api/auth/me',{headers:{Authorization:`Bearer ${token}`}});
  if (!res.ok) { setToken(null); return loadUser(); }
  const data = await res.json();
  authArea.innerHTML = `Hello, ${data.user.name} <button onclick="logout()">Logout</button>`;
  createPostSec.style.display = 'block';
}

function logout(){ setToken(null); loadUser(); }

function showLogin(){
  const email=prompt("Email"), pass=prompt("Password");
  fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:pass})})
  .then(r=>r.json()).then(d=>{ if(d.token){setToken(d.token); loadUser();} else alert(d.msg);});
}
function showRegister(){
  const name=prompt("Name"), email=prompt("Email"), pass=prompt("Password");
  fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password:pass})})
  .then(r=>r.json()).then(d=>{ if(d.token){setToken(d.token); loadUser();} else alert(d.msg);});
}

document.getElementById('create').onclick=()=>{
  const title=document.getElementById('title').value;
  const content=document.getElementById('content').value;
  fetch('/api/posts',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${getToken()}`},body:JSON.stringify({title,content})})
  .then(()=>loadPosts());
};

loadUser();
loadPosts();