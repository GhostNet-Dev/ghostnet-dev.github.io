import { BlockInfo } from "./blockinfo.js";
import { TxInfo } from "./txinfo.js";
import { BlockStore } from "./store.js";

const blockStore = new BlockStore();

interface IPage {
    Run(str: string): boolean; 
    Release(): void;
}

type FuncMap = { [key: string]: IPage };
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
    "blockdetail": new TxInfo(blockStore),
    "blockscan": new BlockInfo(blockStore),
};

const urlToFileMap: UrlMap = {
    "main": "ghostnetservice/main.html",
    "signin": "ghostnetservice/signin.html",
    "signup": "ghostnetservice/signup.html",
    "hons": "ghostnetservice/hons.html",
    "hon": "ghostnetservice/hon.html",
    "blockdetail": "ghostnetservice/blockdetail.html",
    "blockscan": "ghostnetservice/blocklist.html",
};

const getPageIdParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageid = urlParams.get("pageid");
    const key = (pageid == null) ? "main" : pageid;
    return key;
}

let beforPage: string;
window.ClickLoadPage = (key: string, ...arg: string[]) => {
    if (getPageIdParam() == key) return;

    let url = urlToFileMap[key];
    let state = { 'url': window.location.href };
    let backUpBeforPage = beforPage;
    beforPage = key;

    history.pushState(state, "login", "./?pageid=" + key + arg);
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
const includeHTML = (id: string, filename: string) => {
    window.addEventListener('load', () => fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { (document.querySelector(id) as HTMLDivElement).innerHTML = data; }));
}

const includeContentHTML = (master: string) => {
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

export { includeContentHTML, includeHTML, loadNodesHtml, parseResponse }