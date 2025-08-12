fetch('data.json')
    .then(response => response.json())
    .then(data => {
        var bg_img = document.getElementById('bg-img');
        src = "../img/bg/"+data.data.bg.src
        bg_img.style.setProperty('--src',`url(${src})`);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });