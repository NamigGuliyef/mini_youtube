// Videoları JSON serverdən götürmək və HTML-ə əlavə etmək üçün funksiya
function displayVideos() {
    fetch('https://minicocuk.vercel.app/scripts/video')
        .then(response => response.json())
        .then(videos => {
            const videoGallery = document.getElementById("video-gallery");
            if (!videoGallery) return;

            videoGallery.innerHTML = ""; // Mövcud məzmunu təmizlə

            videos.forEach(video => {
                const videoItem = document.createElement("div");
                videoItem.classList.add("video-item");

                // Video iframe elementi yaradın
                const videoId = new URL(video.source).searchParams.get("v");
                const embedLink = `https://www.youtube.com/embed/${videoId}`;
                const iframeElement = document.createElement("iframe");
                iframeElement.width = "100%";
                iframeElement.height = "200";
                iframeElement.src = embedLink;
                iframeElement.frameBorder = "0";
                iframeElement.allowFullscreen = true;

                // Video başlığı üçün h3 elementi yaradın
                const titleElement = document.createElement("h3");
                titleElement.innerText = video.title;

                videoItem.appendChild(iframeElement);
                videoItem.appendChild(titleElement);

                videoGallery.appendChild(videoItem);
            });
        })
        .catch(error => console.error('Error fetching videos:', error));
}

// Yeni video əlavə etmək və məlumatı JSON serverə göndərmək üçün funksiya
function addVideo(event) {
    event.preventDefault(); // Formun standart göndərilməsini dayandırır

    const title = document.getElementById('title').value;
    const youtubeLink = document.getElementById('youtube-link').value;

    // URL-dən video ID-ni çıxarmaq
    const url = new URL(youtubeLink);
    const videoId = url.searchParams.get("v");
    if (!videoId) {
        alert("Zəhmət olmasa, düzgün YouTube linki daxil edin.");
        return;
    }

    // Yeni video məlumatı
    const newVideo = { title, source: youtubeLink };

    // Yeni videonu JSON serverə POST etmək
    fetch('https://minicocuk.vercel.app/scripts/video', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVideo)
    })
        .then(response => response.json())
        .then(video => {
            // Video əlavə edildiyi üçün bildiriş mesajı
            const notification = document.getElementById('notification');
            notification.textContent = `Video "${video.title}" əlavə edildi!`;
            notification.style.display = 'block';

            // Videoları yenidən göstərmək
            displayVideos();
        })
        .catch(error => console.error('Error adding video:', error));

    // Formu sıfırlamaq
    event.target.reset();
}

// Səhifə yükləndikdə videoları göstərmək
window.addEventListener('load', displayVideos);

// // Form göndərilməsini dinləyin
// document.getElementById('upload-form').addEventListener('submit', addVideo);

console.log('test');

document.getElementById('play-music').addEventListener('click', function() {
    var music = document.getElementById('background-music');
    music.volume = 1; // Musiqi səviyyəsini tənzimləmək
    music.play().catch(function(error) {
        console.log("Musiqi səslənmədi, istifadəçi hərəkəti tələb olunur.");
    });
    console.log('test2');
    
});
