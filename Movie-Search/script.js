//TMDB 

const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&language=tr&'+API_KEY;
const searchURL = BASE_URL + '/search/movie?language=tr&'+API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Aksiyon"
    },
    {
      "id": 12,
      "name": "Macera"
    },
    {
      "id": 16,
      "name": "Animasyon"
    },
    {
      "id": 35,
      "name": "Komedi"
    },
    {
      "id": 80,
      "name": "Suç"
    },
    {
      "id": 99,
      "name": "Belgesel"
    },
    {
      "id": 18,
      "name": "Dram"
    },
    {
      "id": 10751,
      "name": "Aile"
    },
    {
      "id": 14,
      "name": "Fantastik"
    },
    {
      "id": 36,
      "name": "Tarih"
    },
    {
      "id": 27,
      "name": "Korku"
    },
    {
      "id": 10402,
      "name": "Müzik"
    },
    {
      "id": 9648,
      "name": "Gizem"
    },
    {
      "id": 10749,
      "name": "Romantik"
    },
    {
      "id": 878,
      "name": "Bilim Kurgu"
    },
    {
      "id": 10770,
      "name": "TV Filmi"
    },
    {
      "id": 53,
      "name": "Gerilim"
    },
    {
      "id": 10752,
      "name": "Savaş"
    },
    {
      "id": 37,
      "name": "Vahşi Batı"
    }
  ]


const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Seçimleri Temizle x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    
}

getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }

            tagsEl.scrollIntoView({behavior : 'smooth'})

        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
       
    })

}


function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        var trimmedOverview = overview.substring(0, 500);
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>İçerik</h3>
                ${trimmedOverview}
                <br/> 
                <button class="know-more" id="${id}">Hemen izle</button
            </div>
        
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id)
          openNav(movie)
        })
    })
}

const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
  function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(res => res.json()).then(videoData => {
      console.log(videoData);
      if(videoData){
        document.getElementById("myNav").style.width = "100%";
        if(videoData.results.length = 1){
          var embed = [];
          var dots = [];
          videoData.results.forEach((video, idx) => {
            let {name, key, site} = video

            if(site == 'YouTube'){
                
              embed.push(`
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            
            `)

            dots.push(`
            <span class="dot">Trailer</span>
          `)
            }
             // Modify the URL to the film site to match your needs
             let filmSiteURL = `https://www.fullhdfilmizlesene.pw/arama/${movie.title}`;

             // Embed the film site in an iframe
             embed.push(`
               <iframe width="960" height="515" src="${filmSiteURL}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
             `)

             dots.push(`
               <span class="dot">FullHdFilmizlesene</span>
             `)
           }
          )
          
          var content = `
          <h1 class="no-results">${movie.original_title}</h1>
          <br/>
          
          ${embed.join('')}
          <br/>

          <div class="dots">${dots.join('')}</div>
          
          `
          overlayContent.innerHTML = content;
          activeSlide=0;
          showVideos();
        }else{
          overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }
      }
    })
  }

/* Close when someone clicks on the "x" symbol inside the overlay */

function closeNav() {

  // overlay'i kapat
  document.getElementById("myNav").style.width = "0%";
  document.getElementById("overlay-content").innerHTML = "";

}


var activeSlide = 0;
var totalVideos = 0;

function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');

  totalVideos = embedClasses.length; 
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')

    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show')
    }
  })

  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })
}

const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click', () => {
  if(activeSlide > 0){
    activeSlide--;
  }else{
    activeSlide = totalVideos -1;
  }

  showVideos()
})

rightArrow.addEventListener('click', () => {
  if(activeSlide < (totalVideos -1)){
    activeSlide++;
  }else{
    activeSlide = 0;
  }
  showVideos()
})


function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})

prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})

next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}