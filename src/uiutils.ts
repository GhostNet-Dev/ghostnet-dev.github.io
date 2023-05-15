import { BlockScan, BlockScanRelease } from "./ghostweb.js";
type PageObj = {
    Run: (str:string) => void; 
    Release: () => void;
}
type FuncMap = { [key: string]: PageObj };
type UrlMap = { [key: string]: string; };
declare global {
    interface Window {
        ClickLoadPage: (key: string) => void;
        NavExpended: () => void;
        MasterAddr: string;
    }
}

const funcMap: FuncMap = {
    /*
    "main": null,
    "signin": null,
    "signup": null,
    "hons": null,
    "hon": null,
    */
    "blockscan": {Run: BlockScan, Release:BlockScanRelease},
};

const urlToFileMap: UrlMap = {
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
}

let beforPage: string;
window.ClickLoadPage = (key: string) => {
    if (getPageIdParam() == key) return;

    let url = urlToFileMap[key];
    let state = { 'url': window.location.href };
    let backUpBeforPage = beforPage;
    beforPage = key;

    history.pushState(state, "login", "./?pageid=" + key);
    fetch(url)
        .then(response => { return response.text(); })
        .then(data => { (document.querySelector("contents") as HTMLDivElement).innerHTML = data; })
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
    (document.querySelector("#navbarNav") as HTMLDivElement).style.display = view;
    (document.querySelector("#navbarNavRight") as HTMLDivElement).style.display = view;
    expendFlag = !expendFlag;
};

window.onpopstate = function (event) {
    const key = getPageIdParam();
    includeContentHTML(window.MasterAddr);
};

const parseResponse = (nodes: any[]) => {
    let randIdx = Math.floor(Math.random() * nodes.length);
    console.log(nodes);
    return nodes[randIdx];
};

const loadNodesHtml = (node: any) => {
    window.MasterAddr = `http://${node.ip.Ip}:${node.ip.Port}`;
    return window.MasterAddr;
};

if (location.protocol != 'http:') {
    alert("warning");
} else {
    addEventListener("load", () =>
        fetch("http://ghostnetroot.com:58080/nodes")
            .then((response) => response.json())
            .then(parseResponse)
            .then(loadNodesHtml)
            .then((url) => includeContentHTML(url))
            .then(() => {
                const navbar = document.querySelector("#navbar");
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
            }));
}

function includeHTML(id: string, filename: string) {
    window.addEventListener('load', () => fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { (document.querySelector(id) as HTMLDivElement).innerHTML = data; }));
}

function includeContentHTML(master: string) {
    let filename = urlToFileMap[getPageIdParam()];
    fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { (document.querySelector("contents") as HTMLDivElement).innerHTML = data; })
        .then(() => {
            const pageObj = funcMap[getPageIdParam()];
            if (pageObj != undefined) {
                pageObj.Run(master);
            }
        });
}

includeHTML("navibar", "navbar.html");
includeHTML("footer", "foot.html");