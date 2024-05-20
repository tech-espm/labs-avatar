var overlay = document.getElementById('overlay');
var modal = document.getElementById('modal');
var closeButton = document.getElementById('close');

function openModal() {
    overlay.style.display = 'block';
    modal.style.display = 'block';
}

function closeModal() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
}

document.querySelector('.result-compartilhar').addEventListener('click', function(event) {
    event.preventDefault();
    openModal();
});

closeButton.addEventListener('click', function(event) {
    event.preventDefault();
    closeModal();
});

overlay.addEventListener('click', function(event) {
    if (event.target === overlay) {
        closeModal();
    }
});

function shareViaWhatsApp() {
    var imageUrl = getImageUrl('card-cd.png'); 
    var message = encodeURIComponent("Confira esta imagem: " + imageUrl); 
    var whatsappUrl = 'https://api.whatsapp.com/send?text=' + message; 
    window.open(whatsappUrl); 
}

function copyImageLink() {
    var imageUrl = getImageUrl('card-cd.png'); 
    var inputElement = document.createElement('input'); 
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('value', imageUrl);
    document.body.appendChild(inputElement);
    inputElement.select();
    document.execCommand('copy');
    document.body.removeChild(inputElement); 
}

function shareViaFacebook() {
    var imageUrl = getImageUrl('card-cd.png'); 
    var facebookUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(imageUrl);
    window.open(facebookUrl);
}

function shareViaTwitter() {
    var imageUrl = getImageUrl('card-cd.png'); 
    var twitterUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent("Confira esta imagem:") + '&url=' + encodeURIComponent(imageUrl);
    window.open(twitterUrl);
}

function shareViaLinkedIn() {
    var imageUrl = getImageUrl('card-cd.png'); 
    var linkedinUrl = 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(imageUrl);
    window.open(linkedinUrl);
}

function shareViaEmail() {
    var imageUrl = getImageUrl('card-cd.png'); 
    var emailSubject = encodeURIComponent("Confira esta imagem");
    var emailBody = encodeURIComponent("Veja esta imagem: " + imageUrl);
    var emailUrl = 'mailto:?subject=' + emailSubject + '&body=' + emailBody;
    window.open(emailUrl);
}

function getBaseUrl() {
    return window.location.origin;
}

function getImageUrl(imageName) {
    var baseUrl = getBaseUrl();
    var imagePath = '/public/img/' + imageName; 
    return baseUrl + imagePath;
}

document.querySelector('.whatsapp a').addEventListener('click', function(event) {
    event.preventDefault();
    shareViaWhatsApp();
});

document.getElementById('copy-link').addEventListener('click', function(event) {
    event.preventDefault();
    copyImageLink();
});

document.querySelector('.facebook a').addEventListener('click', function(event) {
    event.preventDefault();
    shareViaFacebook();
});

document.querySelector('.twitter a').addEventListener('click', function(event) {
    event.preventDefault();
    shareViaTwitter();
});

document.querySelector('.linkedin a').addEventListener('click', function(event) {
    event.preventDefault();
    shareViaLinkedIn();
});

document.querySelector('.email a').addEventListener('click', function(event) {
    event.preventDefault();
    shareViaEmail();
});