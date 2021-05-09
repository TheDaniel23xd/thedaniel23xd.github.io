var button = document.getElementById('button');
var buttontext = document.getElementById('button-text');

button.onclick = function() {
    buttontext.innerHTML="Thanks";
    button.classList.add("active");
}
