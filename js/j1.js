
import { songs } from "./songs_data.js";
import { all_artist } from "./songs_data.js";
import { all_artist_photo } from "./songs_data.js";


let pause=document.querySelector(".pauseplay");
let statuspause=0; //paued
let prev="";
let ad="";
let token=0;
let selected_div="";
let player_style=document.querySelector(".player-deco");
player_style.style.scale=0.5;

let durt;
const seek = document.getElementById("seek");
let liked_button=document.querySelector(".player-like");

let current_panel_flag=0;
let song_in_liked;
let liked_song_array=[];

let info_about_panel=document.querySelector(".info-about-panel");

// <=============================================all audio====================================>
    let like_sound=new Audio("./songs/Notification/like.mp3");
    let forw_back_sound=new Audio("./songs/Notification/forw-back.mp3"); 
    let pause_sound=new Audio("./songs/Notification/pause.mp3"); 
    let song_select_sound=new Audio("./songs/Notification/song-select.mp3"); 
    let click_sound=new Audio("./songs/Notification/click.mp3");



// <================================================ artist-button-click ========================================================>
let artist_button = document.querySelector(".artists-button");
let artist_panel  = document.querySelector(".artist-panel");

function activate() {
    artist_button.style.backgroundColor = "white";
    artist_button.style.color = "rgb(61, 61, 61)";
    artist_panel.style.display = "block";
}

function deactivate() {
    artist_button.style.backgroundColor = "rgb(61, 61, 61)";
    artist_button.style.color = "white";
    artist_panel.style.display = "none";
}

artist_button.addEventListener("mouseenter", activate);
artist_panel.addEventListener("mouseenter", activate);

artist_button.addEventListener("mouseleave", deactivate);
artist_panel.addEventListener("mouseleave", deactivate);



// <============================================for song duration=========================================>
function know_duration(src, callback) {
    let audio = new Audio(src);
    audio.addEventListener("loadedmetadata", () => {
        let sec = Math.floor(audio.duration);
        let min = Math.floor(sec / 60);
        sec = sec % 60;

        sec = sec < 10 ? "0" + sec : sec;
        min = min < 10 ? "0" + min : min;

        callback(`${min}:${sec}`);
    });
}


let number_of_total_songs = songs.length;
for (let i = 0; i < number_of_total_songs; i++) {
    maketemplate(i+1, songs[i].s_name, songs[i].s_artist, songs[i].s_image, "--:--",songs[i].liked_flag,i,songs[i].played);
    know_duration(songs[i].s_src, (dur) => {
        songs[i].duration = dur; 
        durt=dur;
        document.querySelectorAll(".duration")[i].innerText = dur;
    });
    
}


// <=============================================change the player and song-panel when we select song =================================================>

let like_button_of_selected_song;

function change_them(s){
            do_all_normal(prev);

            if(current_panel_flag===0){
                player_panel.querySelector(".song_cover .song_image_src").src = songs[token-1].s_image;
                player_panel.querySelector(".song_name1 .song_name1_1").innerText =songs[token-1].s_name;
                player_panel.querySelector(".song_name1 .song_artist1_1").innerText = songs[token-1].s_artist;
                
                if(songs[token-1].liked_flag===0){
                    liked_button.innerHTML =`<i class="fa-regular fa-heart" style="color:#46ce6e;"></i>`;
                }
                else{
                    liked_button.innerHTML =`<i class="fa-solid fa-heart" style="color:#46ce6e;"></i>`;
                }
                bg_color_select.style.backgroundImage=songs[token-1].bg_color;
                player_style.style.backgroundImage=songs[token-1].player_style;
                songs[token-1].played+=1;
                
                s.querySelector(".most-played").innerHTML=`<i class="fa-solid fa-chart-simple chart" style="color:#46ce6e;"></i> ${songs[token-1].played}`;
                ad=new Audio(songs[token-1].s_src);
                if(!ad.play()){
                    ad.play();
                }
                visualizer();
            }
            else{

                player_panel.querySelector(".song_cover .song_image_src").src = songs[song_in_liked-1].s_image;
                player_panel.querySelector(".song_name1 .song_name1_1").innerText =songs[song_in_liked-1].s_name;
                player_panel.querySelector(".song_name1 .song_artist1_1").innerText = songs[song_in_liked-1].s_artist;
                if(songs[song_in_liked-1].liked_flag===0){
                    liked_button.innerHTML =`<i class="fa-regular fa-heart" style="color:#46ce6e;"></i>`;
                }
                else{
                    liked_button.innerHTML =`<i class="fa-solid fa-heart" style="color:#46ce6e;"></i>`;
                }
                bg_color_select.style.backgroundImage=songs[song_in_liked-1].bg_color;
                player_style.style.backgroundImage=songs[song_in_liked-1].player_style;
                songs[song_in_liked-1].played+=1;

                
                s.querySelector(".most-played").innerHTML=`<i class="fa-solid fa-chart-simple chart" style="color:#46ce6e;"></i> ${songs[song_in_liked-1].played}`;
                
                ad=new Audio(songs[song_in_liked-1].s_src);
                if(!ad.play()){
                    ad.play();
                }
                visualizer();

            }
            
            
            pause.innerHTML=`<i class="fa-solid fa-pause" style="color: #ffffff; font-size:37px;"></i>`;
            statuspause=0;
            like_button_of_selected_song=s;
            s.style.scale=1.03;
            s.style.backgroundColor="rgba(50, 50, 50, 1)";
            s.querySelector(".duration").style.color="#20db72";
            s.querySelector(".song_info_space .name_of_song").style.color = "#20db72";
            player_panel.querySelector(".song-controler2 .time_stamp .end").innerText = durt;
            prev=ad;
            player_style.style.scale=1;
            setupDurationControls()
}  


// <-----------------------------------------------song-panel_template--------------------------------------------->


    function maketemplate(sr_no, album, artist, image_src, dur, flag, arrayIndex,played) {
    const template = document.querySelector("#song_template");
    const clone = template.content.cloneNode(true);

    // Fill template data
    clone.querySelector(".serial_no").innerText = sr_no;
    clone.querySelector(".name_of_song").innerText = album;
    clone.querySelector(".name_of_artist").innerText = artist;
    clone.querySelector(".song_image_src").src = image_src;
    clone.querySelector(".most-played").innerHTML = `<i class="fa-solid fa-chart-simple chart" style="color:#46ce6e;"></i> ${played}`;

    clone.querySelector(".liked").innerHTML =
        flag === 1
            ? `<i class="fa-solid fa-heart" style="color:#46ce6e;"></i>`
            : `<i class="fa-regular fa-heart" style="color:#46ce6e;"></i>`;

    // Duration element safely stored
    const durationEl = clone.querySelector(".duration");
    durationEl.innerText = dur;

    // Append FIRST so element exists in DOM
    document.querySelector(".songs-panel").appendChild(clone);

    // ---- SAFETY CHECK ----
    if (!songs[arrayIndex]) {
        console.warn("Invalid arrayIndex:", arrayIndex);
        return;
    }

    // Load duration safely
    know_duration(songs[arrayIndex].s_src, (realDur) => {
        // Duration element may be removed (panel switched)
        if (durationEl) durationEl.innerText = realDur;
        songs[arrayIndex].duration = realDur;
    });
}
// <======================================artist-panel-template========================================>
    for(let i=0;i<all_artist.length;i++){
        make_artist_template(i);
    }
    
    
    function make_artist_template(index) {
        const template = document.querySelector("#artist_template");
        const clone = template.content.cloneNode(true);
        clone.querySelector(".artist-name-in-panel").innerText = all_artist[index];
        clone.querySelector(".song_image_src_artist").src = all_artist_photo[index];
        document.querySelector(".artist-panel").appendChild(clone);
    }

    // <========================================= select artistt===========================================>
let all_artist_div=document.querySelectorAll(".artist");
console.log(all_artist_div);
all_artist_div.forEach((a)=>{
  
  a.addEventListener("click",()=>{
    click_sound.play();
    current_panel_flag=-1;
    coloured_button();
    info_about_panel.innerText=`Selected Artist All Songs`;
    artist_panel.style.display=`none`;
    const panel = document.querySelector(".songs-panel");
    panel.innerHTML = "";
    let selected_artist = a.querySelector(".artist-name-in-panel").innerText;

    let index=0;
    for (let i = 0; i < number_of_total_songs; i++) {
        if(songs[i].s_artist===selected_artist){
            maketemplate(i+1, songs[i].s_name, songs[i].s_artist, songs[i].s_image, "--:--",songs[i].liked_flag,i,songs[i].played);
            let currentIndex = index;
            know_duration(songs[i].s_src, (dur) => {
                songs[i].duration = dur; 
                durt=dur;
                document.querySelectorAll(".duration")[currentIndex].innerText = dur;
            });
            index++;
        }
        
    }
    
    attach_selected_songs();
    highlight_selected_song();
  })
})


// <------------------------------------------pause-play-button------------------------------------------>


pause.addEventListener("click",()=>{
    if(statuspause==0){
        pause_sound.play();
        pause.innerHTML=`<i class="fa-solid fa-play" style="color: #ffffff; font-size:37px;"></i>`;
        ad.pause();
        statuspause=1;
        player_style.style.scale=0.5;
    }
    else{ 
        pause_sound.play();
        pause.innerHTML=`<i class="fa-solid fa-pause" style="color: #ffffff; font-size:37px;"></i>`;
        ad.play();
        statuspause=0;
        player_style.style.scale=1;

    }
})

// <---------------------------------------------------song-selector--------------------------------------->

let player_panel=document.querySelector(".player");
let bg_color_select=document.querySelector("body");
let selected_song;

function attach_selected_songs(){
    selected_song=document.querySelectorAll(".songs");
    selected_song.forEach((s)=>{
        s.addEventListener("mouseover",()=>{
            s.style.scale=`1.03`;
        }) 
        s.addEventListener("mouseout",()=>{
            if(s!=selected_div){
                s.style.scale=`1`;
            }  
        })    
        s.addEventListener("click",()=>{
            song_select_sound.play();
            if(s!=selected_div){
                do_all_normal(prev);
                s.style.scale=`1.03`;
                token=s.querySelector(".serial_no").innerText;
                song_in_liked=token;
                selected_div=s;
                change_them(selected_div);
            }
            
                

        })
})

}
attach_selected_songs();




// <=============================================forward-backword button js====================================================>
let forward=document.querySelector("#forward");

    forward.addEventListener('click',()=>{
     forw_back_sound.play();
    if(current_panel_flag===0 || current_panel_flag===-1){
            if(token===number_of_total_songs){
               token=1  ;
            }
            else{
                token++;
            }
    }
    else{
        let index=liked_song_array.indexOf(song_in_liked);
        if(index===liked_song_array.length-1){
            song_in_liked=liked_song_array[0];
        }
        else{
           index++;
           song_in_liked=liked_song_array[index];
        }
        
    }
    selected_div=selected_div.nextElementSibling || selected_song[0];
    change_them(selected_div);

    })  
    let backward=document.querySelector("#backward");
    backward.addEventListener('click',()=>{
        forw_back_sound.play();
        if(current_panel_flag===0 || current_panel_flag==-1){
             if(token===1){
                token=14;
             }
             else{
                token--;
             }
        }
        else{
             let index=liked_song_array.indexOf(song_in_liked);
                if(index===0){
                    song_in_liked=liked_song_array[liked_song_array.length-1];
                }
                else{
                index--;
                song_in_liked=liked_song_array[index];
                }
        }
        selected_div=selected_div.previousElementSibling || selected_song[selected_song.length-1];
        change_them(selected_div);

    }) 

// <======================================================normal the whole songs panel==================================>
function do_all_normal(ad){
    if(ad!=""){
        ad.pause();
    }
    selected_song.forEach((s)=>{
       s.style.scale=`1`;
       s.style.backgroundColor="rgb(41, 41, 41)";
       s.querySelector(".song_info_space .name_of_song").style.color = "#ffffffff";
       s.querySelector(".duration").style.color="#ffffffff";
       seek.style.background =`linear-gradient(90deg, #00ff99 0%, #444 0%)`;
       
    })

}

// <===================================================== to load all songs in songs panel =====================================>

function load_all_songs(){
    const panel = document.querySelector(".songs-panel");
    panel.innerHTML = "";  // remove old content
    for (let i = 0; i < number_of_total_songs; i++) {
    
    maketemplate(i+1, songs[i].s_name, songs[i].s_artist, songs[i].s_image, "--:--",songs[i].liked_flag,i,songs[i].played);
    
}
attach_selected_songs();

}
// <==================================================liked song and all songs button colouring================>
 let button_liked=document.querySelector(".liked-panel-button");
let button_all_songs=document.querySelector(".all-songs-panel-button");
function coloured_button(){
    if(current_panel_flag===0){
        button_liked.style.boxShadow=`none`;
        button_liked.innerHTML=`<i class="fa-regular fa-heart" style="color: #ffffff;"></i>`;
        button_all_songs.style.backgroundColor=`#46ce6e`;
        button_all_songs.style.color=`#212020`;
        button_liked.style.backgroundImage=`linear-gradient(to right, rgb(93, 35, 93),rgb(146, 80, 150))`;
    }
    else if (current_panel_flag===1){
        button_all_songs.style.backgroundColor=`rgb(61, 61, 61)`;
        button_liked.style.boxShadow=`0 0 3px rgb(174, 53, 174)`;
        button_all_songs.style.color=`white`;
        button_liked.innerHTML=`<i class="fa-solid fa-heart" style="color: #ffffff;"></i>`;
        button_liked.style.backgroundImage=`linear-gradient(to right, rgba(83, 24, 83, 1),rgba(145, 14, 152, 1))`;
        
    }
    else{
        button_liked.style.boxShadow=`none`;
        button_liked.innerHTML=`<i class="fa-regular fa-heart" style="color: #ffffff;"></i>`;
        button_all_songs.style.color=`white`;
        button_all_songs.style.backgroundColor=`rgb(61, 61, 61)`;
        artist_button.style.backgroundColor = `#46ce6e`; 
        artist_button.style.color=`rgb(61, 61, 61)`; 
        button_liked.style.backgroundImage=`linear-gradient(to right, rgb(93, 35, 93),rgb(146, 80, 150))`;

    }
} 
console.log(current_panel_flag);
coloured_button();   

// <===================================================== to load liked songs in songs panel =====================================>
function load_liked_songs() {
    const panel = document.querySelector(".songs-panel");
    panel.innerHTML = "";

    let display_number = 1; // numbering for liked list

    for (let i = 0; i < number_of_total_songs; i++) {
        if (songs[i].liked_flag === 1) {

            maketemplate( i+1,songs[i].s_name, songs[i].s_artist,songs[i].s_image,"--:--",songs[i].liked_flag,i,songs[i].played);

            display_number++;
        }
    }

    attach_selected_songs();
}


// <-----------------------------------------------highlight song in liked panel--------------------------------------------->
function highlight_selected_song() {
    if (!token) return; // no song selected yet

    let songs_list = document.querySelectorAll(".songs");

    songs_list.forEach(s => {
        if (s.querySelector(".serial_no").innerText == token) {

            s.style.scale = 1.03;
            s.style.backgroundColor = "rgba(50, 50, 50, 1)";
            s.querySelector(".duration").style.color = "#20db72";
            s.querySelector(".song_info_space .name_of_song").style.color = "#20db72";

            selected_div = s; // update new reference
        }
    });
}


// <-----------------------------------------------liked-button--------------------------------------------->


let liked_notifi=document.querySelector(".liked-notification");
liked_button.addEventListener("click", () => {
  let song = songs[token - 1];

  like_sound.play();
  if (songs[token - 1].liked_flag===0) {
    button_liked.style.scale='1.4';
    button_liked.innerHTML=`<i class="fa-solid fa-heart" style="color: #ffffff;"></i>`;
    button_liked.style.backgroundImage=`linear-gradient(to right, rgba(83, 24, 83, 1),rgba(145, 14, 152, 1))`;
    setTimeout(()=>{
        button_liked.style.scale='1';
        button_liked.innerHTML=`<i class="fa-regular fa-heart" style="color: #ffffff;"></i>`;
        button_liked.style.backgroundImage=`linear-gradient(to right, rgb(93, 35, 93),rgb(146, 80, 150))`;

    },1000);
    liked_button.innerHTML = `<i class="fa-solid fa-heart" style="color:#46ce6e;"></i>`;
    song.liked_flag = 1;

    like_button_of_selected_song.querySelector(".liked").innerHTML =`<i class="fa-solid fa-heart" style="color:#46ce6e;"></i>`;
    if(current_panel_flag===1){
        load_liked_songs();
        highlight_selected_song();
    }
    // for liked notifcation 
    liked_notifi.innerHTML=`Added in Liked Songs <i class="fa-solid fa-circle-check " style="color:#46ce6e; margin-left:10px;"></i>`;
    liked_notifi.style.display='block';
    liked_notifi.style.opacity=1;
    
    setTimeout(() => {
    liked_notifi.style.opacity = 0;  // fade OUT
    setTimeout(() => {
        liked_notifi.style.display = 'none';
    }, 1000); // matches CSS transition
   }, 4000);
   
   // to store data for liked song in array
   liked_song_array.push(token);
   liked_song_array.sort((a, b) => a - b);
   
   song_in_liked=token;
    
  } else {
    liked_button.innerHTML = `<i class="fa-regular fa-heart" style="color:#4a7d5a;"></i>`;
    song.liked_flag = 0;
    like_button_of_selected_song.querySelector(".liked").innerHTML =`<i class="fa-regular fa-heart" style="color:#46ce6e;"></i>`;
    if(current_panel_flag===1){
        load_liked_songs();
    }
    button_liked.style.scale='1.4';
    
    button_liked.style.backgroundImage=`linear-gradient(to right, rgba(83, 24, 83, 1),rgba(145, 14, 152, 1))`;
    liked_notifi.innerHTML=`Removed from Liked Songs <i class="fa-solid fa-circle-check " style="color:#46ce6e; margin-left:10px;"></i>`;
    setTimeout(()=>{
        button_liked.style.scale='1';
        
        button_liked.style.backgroundImage=`linear-gradient(to right, rgb(93, 35, 93),rgb(146, 80, 150))`;

    },1000);
    liked_notifi.style.display='block';
    liked_notifi.style.opacity=1;
    setTimeout(() => {
    liked_notifi.style.opacity = 0;  // fade OUT
    setTimeout(() => {
        liked_notifi.style.display = 'none';
    }, 1000); // matches CSS transition
   }, 4000);
   like_sound.play();
   let index=liked_song_array.indexOf(token);
   liked_song_array.splice(index,1);
   liked_song_array.sort();
   


  }
});




// <=============================================to change from liked to all songs panel vive versa=================================================>


let liked_panel=document.querySelector(".liked-panel-button");


liked_panel.addEventListener("click",()=>{
    like_sound.play();
    info_about_panel.innerText=`Liked Songs`;
    current_panel_flag=1;
    load_liked_songs();
    highlight_selected_song();
    coloured_button();   
    
    
})

let all_songs_panel=document.querySelector(".all-songs-panel-button");
all_songs_panel.addEventListener("click",()=>{
    info_about_panel.innerText=`All Songs`;
    current_panel_flag=0;
    load_all_songs();
    highlight_selected_song();
    coloured_button(); 
      
    
})

// <===============================================visulaizer===============================================>

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let audioCtx, analyser, source, bufferLength, dataArray;
 function visualizer(){

    
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(ad);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "#131212ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 4.5;
    let x = 0;

    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#1db739ff");
        gradient.addColorStop(0.5, "#2fa97aff");
        gradient.addColorStop(1, "#135337ff");
    if (!window.smooth) window.smooth = new Array(bufferLength).fill(0);

    for (let i = 0; i < bufferLength; i+=2) {
       window.smooth[i] = window.smooth[i] * 0.8 + dataArray[i] * 0.2;
       const barHeight = window.smooth[i] * 0.4;
       ctx.lineCap = "round";
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
}

}  




// ===================== SONG DURATION CONTROL =======================

// Elements
const start_t = document.querySelector(".song-controler2 .start");
const end_t = document.querySelector(".song-controler2 .end");


// Format time (example: 75 → 1:15)
function formatTime(sec) {
    sec = Math.floor(sec);
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
}
// Update values when song changes
function setupDurationControls() {
    if (!ad) return;

    // When metadata loads → duration is known
    ad.onloadedmetadata = () => {
        seek.max = ad.duration;
        end_t.innerText = formatTime(ad.duration);
    };

    // Update slider + current time while song plays
    ad.ontimeupdate = () => {
        seek.value = ad.currentTime;
        start_t.innerText = formatTime(ad.currentTime);

        if(ad.currentTime==ad.duration){
            if(token==number_of_total_songs){
                token=0;
            }
            token++;
            selected_div = selected_div.nextElementSibling || selected_div.parentElement.firstElementChild;
            change_them(selected_div);

        }
        let percent = (seek.value / seek.max) * 100;
  
       // left part color (#00ff99), right part color (#444)
       seek.style.background =
       `linear-gradient(90deg, #00ff99 ${percent}%, #444 ${percent}%)`;
    };

    // When user DRAGS slider → song jumps to that position
    seek.oninput = () => {
        ad.currentTime = seek.value;
        start_t.innerText = formatTime(seek.value);
        
    };
}

seek.addEventListener("input", function () {
  let percent = (seek.value / seek.max) * 100;
  
  // left part color (#00ff99), right part color (#444)
  seek.style.background =
    `linear-gradient(90deg, #00ff99 ${percent}%, #444 ${percent}%)`;
});








