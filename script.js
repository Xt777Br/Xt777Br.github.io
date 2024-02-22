var GitRows = require("gitrows");

//Document Elements and Events
const searchBar = document.getElementById("search-bar");searchBar.lastElementChild.onfocus=()=>{searchBar.className="focus";};searchBar.lastElementChild.onblur=()=>{searchBar.className="";searchResults.className = "";};searchBar.lastElementChild.onkeydown=()=>{setTimeout(searchPost, 100);};
const searchResults = document.getElementById("search-results");
const content = document.getElementById("content");
var projects = document.getElementById("projects");


//Variables
const gitrows = new GitRows({'strict':true});
var posts = [];
var posts_length = 0;
var pages = 1;
var currentPage = new URLSearchParams(window.location.search).get("page") || 1; 
//Functions
async function getPosts() {
  let git = await gitrows.get("@github/xt777br/data/data.json");
  posts = git["posts_names"];
  posts_length = posts.length;
  if(posts_length > 2) pages += Math.ceil((posts_length-2)/5);
  if(currentPage > pages) window.location.href = `/?page=${pages}`;
  document.getElementById("page-number").innerHTML = currentPage;
  if(currentPage!=1){
    let page_previous = document.getElementById("page-previous")
    page_previous.style.opacity = "1";
    page_previous.onclick = ()=>{window.location.href = `/?page=${currentPage-1}`};
  }
  if(currentPage!=pages){
    let page_next = document.getElementById("page-next")
    page_next.style.opacity = "1";
    page_next.onclick = ()=>{window.location.href = `/?page=${currentPage+1}`};
  }

  for(let i = 1 + (currentPage>1?(2+5*(pages-2)):0); i <= (currentPage>1?(posts_length>2+pages*5 ? 2+pages*5 : posts_length):2); i++){
    let post = await gitrows.get(`@github/xt777br/data/posts/${i}.json`);
    postLoad(post);
    console.log(post);
  }
}

function searchPost() {
  if (searchBar.lastElementChild.value.length == 0) {
    searchResults.className = "";
    return;
  }
  console.log(searchBar.lastElementChild.value);
  searchResults.innerHTML = ``
  for(let i = 0; i < posts_length; i++){
    if(posts[i].toLowerCase().includes(searchBar.lastElementChild.value.toLowerCase())){
      searchResults.innerHTML += `<p>${posts[i]}</p>`
      searchResults.className = "show";
    }
  }
  if(searchResults.innerHTML == ``){
    searchResults.innerHTML = `<p>Nenhum resultado encontrado</p>`
    searchResults.className = "show";
  }
}

function postLoad(project = {}){
  let projectDiv = document.createElement("div");
  projectDiv.innerHTML = `<img src="${project["cover"]}"/>
  <h1>${project["title"]}</h1>
  <p>${project["desc"]}</p>`
  projects.appendChild(projectDiv);
}


if(currentPage==1){
  content.innerHTML = `<div id="youtube"><div id="youtube-channel" onclick="window.open('https://www.youtube.com/@xt777br', '_blank');"><img id="youtube-channel-icon" src="./icons/youtube.png"/><h1>Youtube</h1><p id="subCount">N/A Inscritos</p></div><div id="youtube-videos"><iframe id="ytlastvideo" src="https://www.youtube.com/@xt777br"></iframe><div id="ytothersvideos"></div></div></div><h1 class="title">Projetos e Updates</h1><div id="projects"></div><div id="pages"><p id="page-previous">&#60;&#60; Pagina Anterior</p><p id="page-number"></p><p id="page-next"> Próxima Página &#62;&#62;</p></div><p>xt777br @ 2024</p>`;
  let subCount = document.getElementById("subCount");
  let ytlast = document.getElementById("ytlastvideo");
  let ytOthers = document.getElementById("ytothersvideos");
  projects = document.getElementById("projects");
  fetch("https://api.rss2json.com/v1/api.json?rss_url="+encodeURIComponent("https://www.youtube.com/feeds/videos.xml?channel_id=UComfiHHjNGz5qQFsS4pVe7A")).then((response) => response.json()).then((data)=>{ytlast.src="https://youtube.com/embed/" +data["items"][0]["guid"].replace("yt:video:", "");for (let video of data["items"]) {let vdId = video["guid"].replace("yt:video:", "");ytOthers.innerHTML+=` <img class="${video==data["items"][0]?"ytacvd":""}" id="${vdId}" src="https://img.youtube.com/vi/${vdId}/mqdefault.jpg" onclick="if(this.className ==''){document.getElementById('ytlastvideo').src='https://youtube.com/embed/'+this.id}; document.getElementsByClassName('ytacvd')[0].className = ''; this.className='ytacvd';"/>`;}}).catch(console.error);
  fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UComfiHHjNGz5qQFsS4pVe7A&key=AIzaSyDCAyjrAObnWGGCOsAi1CVi26BnbZFZhG8`).then((response) => {return response.json();}).then((data)=>{subCount.innerHTML=`${data["items"][0].statistics.subscriberCount} Inscritos`;}).catch(console.error);
}
getPosts()