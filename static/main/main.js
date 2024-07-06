const songName = document.getElementById('nome-musica')
const bandName = document.getElementById('nome-banda')
const imgMusica = document.getElementById('capa-musica')
const musica = document.getElementById('musica')
const playIcon = document.getElementById('play-icon')
const progressBar = document.getElementById('current-progress')
const progressContainer = document.getElementById('progress-container')
const embaralha = document.getElementById('embaralha')
const repetir = document.getElementById('repetir')
const songTime = document.getElementById('song-time')
const totalTime = document.getElementById('total-time')
const likeIcon = document.getElementById('like-icon')


const pauseButton = 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5';
const playButton = 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z';

const like = 'M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314'
const nolike = 'm8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15'

const startDirBase = "{% static '"
const endDirBase = "' %}"

let playlist = []
let songPlaying = 0

initialize();

let sortedPlaylist = []

let musicIsPlaying = false
let isShuffle = false
let loop = false

function play_pause(){

    if (musicIsPlaying == false) {
        musicIsPlaying = true
        musica.play()
        playIcon.setAttribute('d', pauseButton)
    }
    else {
        musicIsPlaying = false
        musica.pause()
        playIcon.setAttribute('d', playButton)
    }
}

function updateSong(){
    songName.innerText = sortedPlaylist[songPlaying].Nome
    bandName.innerText = sortedPlaylist[songPlaying].Banda
    imgMusica.src = sortedPlaylist[songPlaying].DirCapa
    musica.src = sortedPlaylist[songPlaying].DirMusica

    if (sortedPlaylist[songPlaying].Liked == false){
        likeIcon.setAttribute('d', nolike)
        likeIcon.removeAttribute('fill-rule')
        likeIcon.classList.remove('activate')
    }
    else{
        likeIcon.setAttribute('d', like)
        likeIcon.setAttribute('fill-rule', 'evenodd')
        likeIcon.classList.add('activate')
    }

}


function nextSong(){

    let numMusicas = sortedPlaylist.length - 1

    if (songPlaying == numMusicas) {

        songPlaying = 0
    }
    else {
        songPlaying += 1
    }

    updateSong()

    if (musicIsPlaying == true){
        musica.play()
    }
}

function previousSong(){

    let numMusicas = sortedPlaylist.length - 1

    if (songPlaying == 0) {

        songPlaying = numMusicas
    }
    else {
        songPlaying -= 1
    }
    updateSong()

    if (musicIsPlaying == true){
        musica.play()
    }

}

function updateProgressBar(){

    const barWidth = (musica.currentTime / musica.duration) * 100
    progressBar.style.setProperty('--progress', `${barWidth}%`)
    songTime.innerText = toHHMMSS(musica.currentTime)


    if (loop == true && musica.currentTime == musica.duration){
        musica.currentTime = 0
        musica.play()
    }
    else if (loop == false && musica.currentTime == musica.duration){

        nextSong()
        musica.play()
    }
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;

    const barWidth = (clickPosition / width) * musica.duration;

    musica.currentTime = barWidth;
}

function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length
    let currentIndex = size - 1
    while(currentIndex > 0){
        let rand = Math.floor(Math.random() * size)
        let aux = preShuffleArray[currentIndex]
        preShuffleArray[currentIndex] = preShuffleArray[rand]
        preShuffleArray[rand] = aux
        currentIndex -= 1
    }
}

function embaralharPlaylist(){
    if (isShuffle == false){
        isShuffle = true
        shuffleArray(sortedPlaylist)
        embaralha.classList.add('activate')
    }
    else {
        isShuffle = false
        sortedPlaylist = [...playlist]
        embaralha.classList.remove('activate')
    }
}

function musicLoop(){
    if (loop == false){
        loop = true
        repetir.classList.add('activate')
    }
    else{
        loop = false
        repetir.classList.remove('activate')
    }

}

function toHHMMSS(num){
    let hours = Math.floor(num / 3600)
    let min = Math.floor((num - hours * 3600) / 60)
    let sec = Math.floor(num - hours * 3600 - min * 60)
    
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}



function setDurationSong(){
    totalTime.innerText = toHHMMSS(musica.duration)
}

function likeSong(){
    if (sortedPlaylist[songPlaying].Liked == false){
        sortedPlaylist[songPlaying].Liked = true
        likeIcon.setAttribute('d', like)
        likeIcon.setAttribute('fill-rule', 'evenodd')
        likeIcon.classList.add('activate')
    }
    else{
        sortedPlaylist[songPlaying].Liked = false
        likeIcon.setAttribute('d', nolike)
        likeIcon.removeAttribute('fill-rule')
        likeIcon.classList.remove('activate')
    }
}

async function loadSongs() {
    try {
        const response = await fetch('/static/data/musicas.json')
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error)
    }
}

async function initialize() {

    playlist = await loadSongs()
    if (playlist && playlist.length > 0) {
        const firstSong = playlist[0]
        songName.innerText = firstSong.Nome
        bandName.innerText = firstSong.Banda
        imgMusica.src = firstSong.DirCapa
        musica.src = firstSong.DirMusica
        sortedPlaylist = [...playlist]
    }
}

progressContainer.addEventListener('click',jumpTo)

musica.addEventListener('loadedmetadata', setDurationSong)