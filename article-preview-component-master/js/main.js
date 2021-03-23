document.addEventListener('DOMContentLoaded', () => {

    var width;
    window.onresize = window.onload = function () {
        width = this.innerWidth;

        if (width <= 900) {
            document.querySelector(".mobile_p").style.display = "block";
            document.querySelector(".desktop_p").style.display = "none";
            document.querySelector("#sharable").classList.remove("desktop");
            document.querySelector("#sharable").classList.add("mobile");
            document.querySelector(".mobile").style.display = "none";

            document.getElementById("shareOption_mobile_p").addEventListener('click', function () {
                document.querySelector(".mobile").style.display = "flex";
                document.querySelector(".mobile_p").style.display = "none";
            });
            document.getElementById("shareOption_mobile").addEventListener('click', function () {
                document.querySelector(".mobile").style.display = "none";
                document.querySelector(".mobile_p").style.display = "block";
            });
        }

        else {
            document.querySelector(".mobile_p").style.display = "none";
            document.querySelector(".desktop_p").style.display = "block";
            document.querySelector("#sharable").classList.remove("mobile");
            document.querySelector("#sharable").classList.add("desktop");
            document.querySelector(".desktop").style.display = "none";
            document.getElementById("shareOption_desktop").onclick =
                function () {
                    if (document.querySelector(".desktop").style.display === "none")
                        document.querySelector(".desktop").style.display = "flex";
                    else
                        document.querySelector(".desktop").style.display = "none";

                }

        }



    }
});