import { BlockInfo } from "./blockinfo.js";
import { TxInfo } from "./txinfo.js";
import { BlockStore } from "./store.js";
import { TxDetail } from "./txdetail.js";
import { GWSMain } from "./gwsmain.js";
import { AccountDetail } from "./accountdetail.js";
import { WebAppStore } from "./webappstore.js";
import { Diffusion } from "./diffusion/diffusion.js";
import { Socket } from "./libs/socket.js";
import { HonDetail } from "./hons/hondetail.js";
import { Hons } from "./hons/hons.js";
import { Hon } from "./hons/hon.js";
import { NewHon } from "./hons/newhon.js";
import { Signup } from "./hons/signup.js";
import { Signin } from "./hons/signin.js";
import { Session } from "./hons/session.js";
import { UploadHon } from "./hons/uploadhon.js";
const blockStore = new BlockStore();
const session = new Session();
const hons = new Hons(blockStore, session);
const funcMap = {
    "signin": new Signin(blockStore, session),
    "signup": new Signup(blockStore, session),
    "hon": new Hon(blockStore, session),
    "hons": hons,
    "hondetail": new HonDetail(blockStore, session),
    "newhon": new NewHon(blockStore, session),
    "uploadhon": new UploadHon(blockStore, session),
    "main": new GWSMain(blockStore, hons),
    "txdetail": new TxDetail(blockStore),
    "blockdetail": new TxInfo(blockStore),
    "blockscan": new BlockInfo(blockStore),
    "accountdetail": new AccountDetail(blockStore),
    "webappstore": new WebAppStore(blockStore),
    "diffusion": new Diffusion(blockStore, new Socket),
};
const urlToFileMap = {
    "main": "ghostnetservice/main.html",
    "nft": "ghostnetservice/warning.html",
    "prompt": "ghostnetservice/warning.html",
    "download": "ghostnetservice/download.html",
    "download_win": "ghostnetservice/download_win.html",
    "webappstore": "ghostnetservice/webappstore.html",
    "service": "ghostnetservice/service.html",
    "doc": "ghostnetservice/doc.html",
    "diffusion": "diffusion/diffusion.html",
    "signin": "hons/signin.html",
    "signup": "hons/signup.html",
    "hons": "hons/hons.html",
    "hon": "hons/hon.html",
    "hondetail": "hons/hondetail.html",
    "newhon": "hons/newhon.html",
    "uploadhon": "hons/uploadhon.html",
    "txdetail": "ghostnetservice/txdetail.html",
    "blockdetail": "ghostnetservice/blockdetail.html",
    "blockscan": "ghostnetservice/blocklist.html",
    "accountdetail": "ghostnetservice/accountdetail.html",
};
const getPageIdParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageid = urlParams.get("pageid");
    const key = (pageid == null) ? "main" : pageid;
    if (beforPage == undefined)
        beforPage = key;
    return key;
};
let beforPage;
window.ClickLoadPage = (key, fromEvent, ...args) => {
    //if (getPageIdParam() == key) return;
    session.DrawHtmlSessionInfo();
    const url = urlToFileMap[key];
    const state = {
        'url': window.location.href,
        'key': key,
        'fromEvent': fromEvent,
        'args': args
    };
    console.log(`page change : ${beforPage} ==> ${key}`);
    const backUpBeforPage = beforPage;
    beforPage = key;
    history.pushState(state, "login", "./?pageid=" + key + args);
    fetch(url)
        .then(response => { return response.text(); })
        .then(data => { document.querySelector("contents").innerHTML = data; })
        .then(() => {
        const beforePageObj = funcMap[backUpBeforPage];
        if (beforePageObj != undefined) {
            beforePageObj.Release();
        }
        const pageObj = funcMap[key];
        if (pageObj != undefined) {
            pageObj.Run(window.MasterAddr);
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
window.onpopstate = (event) => {
    //window.ClickLoadPage(event.state['key'], event.state['fromEvent'], event.state['args'])
    includeContentHTML(window.MasterAddr);
};
const parseResponse = (nodes) => {
    let randIdx = Math.floor(Math.random() * nodes.length);
    window.NodeCount = nodes.length;
    console.log(nodes);
    return nodes[randIdx];
};
const loadNodesHtml = (node) => {
    window.MasterNode = node;
    window.MasterAddr = `http://${node.User.ip.Ip}:${node.User.ip.Port}`;
    window.MasterWsAddr = `ws://${node.User.ip.Ip}:${node.User.ip.Port}`;
    return window.MasterAddr;
};
const includeHTML = (id, filename) => {
    window.addEventListener('load', () => fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { document.querySelector(id).innerHTML = data; }));
};
const includeContentHTML = (master) => {
    session.DrawHtmlSessionInfo();
    const key = getPageIdParam();
    const filename = urlToFileMap[key];
    const backUpBeforPage = beforPage;
    beforPage = key;
    fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { document.querySelector("contents").innerHTML = data; })
        .then(() => {
        const beforePageObj = funcMap[backUpBeforPage];
        if (beforePageObj != undefined) {
            beforePageObj.Release();
        }
        const pageObj = funcMap[key];
        if (pageObj != undefined) {
            pageObj.Run(master);
        }
    });
};
export { includeContentHTML, includeHTML, loadNodesHtml, parseResponse };
//# sourceMappingURL=ghostweb.js.map