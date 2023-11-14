import { includeContentHTML, includeHTML, parseResponse, loadNodesHtml } from "./ghostweb.js";

const tag = document.getElementById("contents");
if (tag != null) {
    if (location.protocol != 'http:') {
        tag.innerHTML = `
            <div class="card">
                <div class="card-header"> 
                    https 를 지원하지 않습니다. 
                </div>
                <div class="card-body">
                    <a href="http://ghostwebservice.com"> <strong class="me-auto">ghostwebservice.com</strong> </a>
                </div>
            </div>
        `;
    } else {
        addEventListener("load", () =>
            fetch("http://ghostnetroot.com:58080/nodes")
                .then((response) => response.json())
                .then(parseResponse)
                .then(loadNodesHtml)
                .then((url) => includeContentHTML(url))
                .then(() => {
                    const navbar = document.querySelector("navbar");
                    const navbarHeight = navbar?.getBoundingClientRect().height || 40;
                    addEventListener("scroll", () => {
                        if (window.scrollY > navbarHeight) {
                            navbar?.classList.remove("navbar-dark");
                            navbar?.classList.remove("bg-dark");
                            navbar?.classList.add("navbar-transition");
                        } else {
                            navbar?.classList.remove("navbar-transition");
                            navbar?.classList.add("navbar-dark");
                            navbar?.classList.add("bg-dark");
                        }
                    })
                })
                .catch(() => {
                    tag.innerHTML = `
            <div class="card">
                <div class="card-header"> 
                Network Down
                </div>
                <div class="card-body">
                    사용가능한 Node가 존재하지 않습니다. 
                </div>
            </div>
        `;
                }));
    }
}


includeHTML("header", "navbar.html");
includeHTML("footer", "foot.html");