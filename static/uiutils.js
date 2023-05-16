import { includeContentHTML, includeHTML, parseResponse, loadNodesHtml } from "./ghostweb.js";
if (location.protocol != 'http:') {
    alert("warning");
}
else {
    addEventListener("load", () => fetch("http://ghostnetroot.com:58080/nodes")
        .then((response) => response.json())
        .then(parseResponse)
        .then(loadNodesHtml)
        .then((url) => includeContentHTML(url))
        .then(() => {
        const navbar = document.querySelector("navbar");
        const navbarHeight = (navbar === null || navbar === void 0 ? void 0 : navbar.getBoundingClientRect().height) || 40;
        addEventListener("scroll", () => {
            if (window.scrollY > navbarHeight) {
                navbar === null || navbar === void 0 ? void 0 : navbar.classList.remove("navbar-dark");
                navbar === null || navbar === void 0 ? void 0 : navbar.classList.remove("bg-dark");
                navbar === null || navbar === void 0 ? void 0 : navbar.classList.add("navbar-transition");
            }
            else {
                navbar === null || navbar === void 0 ? void 0 : navbar.classList.remove("navbar-transition");
                navbar === null || navbar === void 0 ? void 0 : navbar.classList.add("navbar-dark");
                navbar === null || navbar === void 0 ? void 0 : navbar.classList.add("bg-dark");
            }
        });
    }));
}
includeHTML("header", "navbar.html");
includeHTML("footer", "foot.html");
//# sourceMappingURL=uiutils.js.map