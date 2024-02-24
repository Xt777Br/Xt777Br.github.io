var GitRows = require("gitrows");
var Showdown = require("showdown");

//Document Elements and Events
const searchBar = document.getElementById("search-bar");searchBar.lastElementChild.onfocus=()=>{searchBar.className="focus";};searchBar.lastElementChild.onblur=()=>setTimeout(()=>{searchBar.className="";searchResults.className = "";}, 100);searchBar.lastElementChild.onkeydown=()=>{setTimeout(searchPost, 100);};
const searchResults = document.getElementById("search-results");
const content = document.getElementById("content");
const postContent = document.createElement("div"); postContent.id="post-content";
var postsShow = document.getElementById("postsShow");

//Variables
const gitrows = new GitRows({'strict':true});
var showdown = new Showdown.Converter({"tables": true});
var urlParams = new URLSearchParams(window.location.search);
var posts = [];
var posts_length = 0;
var pages = 1;
var currentPage = urlParams.get("page") || 1;
var post = urlParams.get("post");

console.log(post);

//Functions
async function getPosts() {
  let git = await gitrows.get("@github/xt777br/data/data.json");
  let postsInPage = 1;
  posts = git["posts_names"];
  posts_length = posts.length;
  if(!post) {
    if(posts_length > 2) pages += Math.ceil((posts_length-2)/3);
    if(currentPage > pages) window.location.href = `/?page=${pages}`;
    document.getElementById("page-number").innerHTML = currentPage;
    if(currentPage!=1){
      let page_previous = document.getElementById("page-previous")
      page_previous.style.opacity = "1";
      page_previous.onclick = ()=>{window.location.href = `?page=${currentPage-1}`};
    }
    if(currentPage!=pages){
      let page_next = document.getElementById("page-next")
      page_next.style.opacity = "1";
      page_next.onclick = ()=>{window.location.href = `?page=${currentPage+1}`};
    }

    for(let i = 1 + (currentPage>1?(2+3*(pages-2)):0); i <= (currentPage>1?(posts_length>2+pages*3 ? 2+pages*3 : posts_length):2); i++){
      let post = await gitrows.get(`@github/xt777br/data/posts/${i}.json`);
      postLoad(post, postsInPage);
      postsInPage++;
    }
    Array.from(document.getElementsByClassName("postLoading")).forEach(element => {
      //remove elment from html
      element.remove();
    });
  }else {
    let i = posts.indexOf(post.replace("_", " "))+1;
    let p = await gitrows.get(`@github/xt777br/data/posts/${i}.json`);
    content.innerHTML= p ? "" : `<span class="material-symbols-outlined" style="font-size: 100px; padding: 0px 10px 0px;">
    travel_explore
    </span><h1>Post não existente</h1>`;
    postLoadHTML(p);
  }
}

function postLoad(post = {}, i){
  let postDiv = document.getElementById(`postDiv${i}`);
  postDiv.innerHTML = `<img src="${post["cover"]}"/><h1>${post["title"]}</h1><p>${post["desc"]}</p>`;
  postDiv.onclick = ()=>{window.location.href = `/?post=${post["title"].replace(" ", "_")}`};
  postDiv.className = "";
}

function searchPost() {
  if (searchBar.lastElementChild.value.length == 0) {
    searchResults.className = "";
    return;
  }

  searchResults.innerHTML = ``
  for(let i = 0; i < posts_length; i++){
    if(posts[i].toLowerCase().includes(searchBar.lastElementChild.value.toLowerCase())){
      searchResults.innerHTML += `<p onclick="window.location.href = '/?post=${posts[i]}'">${posts[i]}</p>`
      searchResults.className = "show";
    }
  }
  if(searchResults.innerHTML == ``){
    searchResults.innerHTML = `<p>Nenhum resultado encontrado</p>`
    searchResults.className = "show";
  }
}

function postLoadHTML(p = {}){
  let html = showdown.makeHtml(atob(p["md64"])).toString();
  html=html.replace(/<table>/g, '<div class="table"> <table>').replace(/<\/table>/g, '</table></div>');
  postContent.innerHTML = `<img src="${p["cover"]}"/><h1 class="title">${p["title"]}</h1><p>${p["desc"]}</p><p class="details">Publicado por ${p["author"]} em ${p["date"]}</p>${html}</div>`;
  content.appendChild(postContent);
  content.innerHTML += "<p>xt777br @ 2024</p>";
}


if(currentPage==1 && !post){
  document.getElementById("pages").innerHTML = `<p id="page-previous">&lt;&lt; Pagina Anterior</p><p id="page-number">1</p><p id="page-next"> Próxima Página &gt;&gt;</p>`;

  content.innerHTML = `<div id="youtube"><div id="youtube-channel" onclick="window.open('https://www.youtube.com/@xt777br', '_blank');"><img id="youtube-channel-icon" src="./icons/youtube.png"/><h1>Youtube</h1><p id="subCount">N/A Inscritos</p></div><div id="youtube-videos"><iframe id="ytlastvideo" src="https://www.youtube.com/@xt777br"></iframe><div id="ytothersvideos"></div></div></div><h1 class="title">Projetos e Updates</h1><div id="postsShow"></div><div id="pages"><p id="page-previous">&#60;&#60; Pagina Anterior</p><p id="page-number"></p><p id="page-next"> Próxima Página &#62;&#62;</p></div><p>xt777br @ 2024</p>`;
  let subCount = document.getElementById("subCount");
  let ytlast = document.getElementById("ytlastvideo");
  let ytOthers = document.getElementById("ytothersvideos");
  postsShow = document.getElementById("postsShow");
  postsShow.innerHTML = `<div id="postDiv1" class="postLoading"><center></center><h1><span>AAAAA AAAAAA</span></h1><p><span>AAAAA AAAAAA AAAAAAAAAA AAAAAAA AAAAAA</span></p></div><div id="postDiv2" class="postLoading"><center></center><h1><span>AAAAA AAAAAA</span></h1><p><span>AAAAA AAAAAA AAAAAAAAAA AAAAAAA AAAAAA</span></p></div>`;

  fetch("https://api.rss2json.com/v1/api.json?rss_url="+encodeURIComponent("https://www.youtube.com/feeds/videos.xml?channel_id=UComfiHHjNGz5qQFsS4pVe7A")).then((response) => response.json()).then((data)=>{ytlast.src="https://youtube.com/embed/" +data["items"][0]["guid"].replace("yt:video:", "");for (let video of data["items"]) {let vdId = video["guid"].replace("yt:video:", "");ytOthers.innerHTML+=` <img class="${video==data["items"][0]?"ytacvd":""}" id="${vdId}" src="https://img.youtube.com/vi/${vdId}/mqdefault.jpg" onclick="if(this.className ==''){document.getElementById('ytlastvideo').src='https://youtube.com/embed/'+this.id}; document.getElementsByClassName('ytacvd')[0].className = ''; this.className='ytacvd';"/>`;}}).catch(console.error);
  fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UComfiHHjNGz5qQFsS4pVe7A&key=AIzaSyDCAyjrAObnWGGCOsAi1CVi26BnbZFZhG8`).then((response) => {return response.json();}).then((data)=>{subCount.innerHTML=`${data["items"][0].statistics.subscriberCount} Inscritos`;}).catch(console.error);
} else if(!post) {
  document.getElementById("pages").innerHTML = `<p id="page-previous">&lt;&lt; Pagina Anterior</p><p id="page-number">1</p><p id="page-next"> Próxima Página &gt;&gt;</p>`;
  postsShow.innerHTML = `<div id="postDiv1" class="postLoading"><center></center><h1><span>AAAAA AAAAAA</span></h1><p><span>AAAAA AAAAAA AAAAAAAAAA AAAAAAA AAAAAA</span></p></div><div id="postDiv2" class="postLoading"><center></center><h1><span>AAAAA AAAAAA</span></h1><p><span>AAAAA AAAAAA AAAAAAAAAA AAAAAAA AAAAAA</span></p></div><div id="postDiv3" class="postLoading"><center></center><h1><span>AAAAA AAAAAA</span></h1><p><span>AAAAA AAAAAA AAAAAAAAAA AAAAAAA AAAAAA</span></p></div>`;
} else {

}

getPosts()
