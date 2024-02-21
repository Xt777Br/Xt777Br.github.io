var GitRows = require("gitrows");

const searchBar = document.getElementById("search-bar");
const subCount = document.getElementById("subCount");
const ytlast = document.getElementById("ytlastvideo");
const ytOthers = document.getElementById("ytothersvideos");
const projects = document.getElementById("projects");

searchBar.lastElementChild.onfocus = function () {searchBar.className = "focus";};
searchBar.lastElementChild.onblur = function () {searchBar.className = "";};

function roundNum(n = "") {
  n = "10002"
  let numLetters = ["", "K"]
  let home = (n.length - n.length % 3)/3
  let num = parseInt(n)
  if(num < 1000){
    return n
  }else {
    return n
  }
}

function projectLoad(project = {}){
  let projectDiv = document.createElement("div");
  projectDiv.innerHTML = `<img src="${project["cover"]}"/>
  <h1>${project["title"]}</h1>
  <p>${project["desc"]}</p>`
  projects.appendChild(projectDiv);
}

fetch(
  "https://api.rss2json.com/v1/api.json?rss_url=" +
    encodeURIComponent(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UComfiHHjNGz5qQFsS4pVe7A",
    ),
)
  .then((response) => response.json())
  .then((data) => {
    ytlast.src =
      "https://youtube.com/embed/" +
      data["items"][0]["guid"].replace("yt:video:", "");
    for (let video of data["items"]) {
      let vdId = video["guid"].replace("yt:video:", "");
      ytOthers.innerHTML += ` <img class="${
        video == data["items"][0] ? "ytacvd" : ""
      }" id="${vdId}" src="https://img.youtube.com/vi/${vdId}/mqdefault.jpg" onclick="if(this.className =='') {document.getElementById('ytlastvideo').src='https://youtube.com/embed/'+this.id}; document.getElementsByClassName('ytacvd')[0].className = ''; this.className='ytacvd';"/>`;
    }
  })
  .catch(console.error);

fetch(
  `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UComfiHHjNGz5qQFsS4pVe7A&key=AIzaSyDCAyjrAObnWGGCOsAi1CVi26BnbZFZhG8`,
)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    subCount.innerHTML = `${data["items"][0].statistics.subscriberCount} Inscritos`;
  })
  .catch(console.error);

const gitrows = new GitRows({'strict':true});

var posts = []

async function getPosts() {
  let pages = await gitrows.get("@github/xt777br/xtwebsite/data.json")
  for(let i = 0; i < pages["posts_length"]; i++){
    let post = await gitrows.get(`@github/xt777br/xtwebsite/posts/${i+1}.json`)
    posts.push(post)
    projectLoad(post)
  }

}

getPosts()

