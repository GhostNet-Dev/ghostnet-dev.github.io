import { BlockScan, BlockScanRelease } from "./ghostweb.js";
const funcMap = {
    /*
    "main": null,
    "signin": null,
    "signup": null,
    "hons": null,
    "hon": null,
    */
    "blockscan": { Run: BlockScan, Release: BlockScanRelease },
};
const urlToFileMap = {
    "main": "ghostnetservice/main.html",
    "signin": "ghostnetservice/signin.html",
    "signup": "ghostnetservice/signup.html",
    "hons": "ghostnetservice/hons.html",
    "hon": "ghostnetservice/hon.html",
    "blockscan": "ghostnetservice/blocklist.html",
};
const getPageIdParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageid = urlParams.get("pageid");
    const key = (pageid == null) ? "main" : pageid;
    return key;
};
let beforPage;
window.ClickLoadPage = (key) => {
    if (getPageIdParam() == key)
        return;
    let url = urlToFileMap[key];
    let state = { 'url': window.location.href };
    let backUpBeforPage = beforPage;
    beforPage = key;
    history.pushState(state, "login", "./?pageid=" + key);
    fetch(url)
        .then(response => { return response.text(); })
        .then(data => { document.querySelector("contents").innerHTML = data; })
        .then(() => {
        const pageObj = funcMap[key];
        if (pageObj != undefined) {
            pageObj.Run(window.MasterAddr);
        }
        const beforePageObj = funcMap[backUpBeforPage];
        if (beforePageObj != undefined) {
            beforePageObj.Release();
        }
    });
    window.NavExpended();
};
let expendFlag = false;
window.NavExpended = () => {
    let view = (expendFlag == false) ? "block" : "none";
    document.querySelector("#navbarNav").style.display = view;
    document.querySelector("#navbarNavRight").style.display = view;
    expendFlag = !expendFlag;
};
window.onpopstate = function (event) {
    const key = getPageIdParam();
    includeContentHTML(window.MasterAddr);
};
const parseResponse = (nodes) => {
    let randIdx = Math.floor(Math.random() * nodes.length);
    console.log(nodes);
    return nodes[randIdx];
};
const loadNodesHtml = (node) => {
    window.MasterAddr = `http://${node.ip.Ip}:${node.ip.Port}`;
    return window.MasterAddr;
};
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
        const navbar = document.querySelector("#navbar");
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
function includeHTML(id, filename) {
    window.addEventListener('load', () => fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { document.querySelector(id).innerHTML = data; }));
}
function includeContentHTML(master) {
    let filename = urlToFileMap[getPageIdParam()];
    fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { document.querySelector("contents").innerHTML = data; })
        .then(() => {
        const pageObj = funcMap[getPageIdParam()];
        if (pageObj != undefined) {
            pageObj.Run(master);
        }
    });
}
includeHTML("navibar", "navbar.html");
includeHTML("footer", "foot.html");
//# sourceMappingURL=uiutils.js.map