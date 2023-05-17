import { BlockInfo } from "./blockinfo.js";
import { TxInfo } from "./txinfo.js";
import { BlockStore } from "./store.js";
import { TxDetail } from "./txdetail.js";
const blockStore = new BlockStore();
const funcMap = {
    /*
    "main": null,
    "signin": null,
    "signup": null,
    "hons": null,
    "hon": null,
    */
    "txdetail": new TxDetail(blockStore),
    "blockdetail": new TxInfo(blockStore),
    "blockscan": new BlockInfo(blockStore),
};
const urlToFileMap = {
    "main": "ghostnetservice/main.html",
    "signin": "ghostnetservice/signin.html",
    "signup": "ghostnetservice/signup.html",
    "hons": "ghostnetservice/hons.html",
    "hon": "ghostnetservice/hon.html",
    "txdetail": "ghostnetservice/txdetail.html",
    "blockdetail": "ghostnetservice/blockdetail.html",
    "blockscan": "ghostnetservice/blocklist.html",
};
const getPageIdParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageid = urlParams.get("pageid");
    const key = (pageid == null) ? "main" : pageid;
    return key;
};
let beforPage;
window.ClickLoadPage = (key, fromEvent, ...arg) => {
    if (getPageIdParam() == key)
        return;
    let url = urlToFileMap[key];
    let state = { 'url': window.location.href };
    let backUpBeforPage = beforPage;
    beforPage = key;
    history.pushState(state, "login", "./?pageid=" + key + arg);
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
    if (fromEvent) {
        window.NavExpended();
    }
    console.log(fromEvent);
};
let expendFlag = false;
window.NavExpended = () => {
    let view = (expendFlag == false) ? "block" : "none";
    document.querySelector("#navbarNav").style.display = view;
    document.querySelector("#navbarNavRight").style.display = view;
    expendFlag = !expendFlag;
};
window.onpopstate = function (event) {
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
const includeHTML = (id, filename) => {
    window.addEventListener('load', () => fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { document.querySelector(id).innerHTML = data; }));
};
const includeContentHTML = (master) => {
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
};
export { includeContentHTML, includeHTML, loadNodesHtml, parseResponse };
//# sourceMappingURL=ghostweb.js.map