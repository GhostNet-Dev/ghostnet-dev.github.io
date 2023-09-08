import { BlockInfo } from "./blockinfo.js";
import { TxInfo } from "./txinfo.js";
import { BlockStore } from "./store.js";
import { TxDetail } from "./txdetail.js";
import { GWSMain } from "./gwsmain.js";
import { AccountDetail } from "./accountdetail.js";
import { Hons } from "./hons/hons.js";
import { Hon } from "./hons/hon.js";
import { Signup } from "./hons/signup.js";
import { Signin } from "./hons/signin.js";
import { GhostWebUser } from "./models/param.js";

const blockStore = new BlockStore();

interface IPage {
    Run(str: string): boolean; 
    Release(): void;
}

type FuncMap = { [key: string]: IPage };
type UrlMap = { [key: string]: string; };
declare global {
    interface Window {
        ClickLoadPage: (key: string, from: boolean, ...arg: string[]) => void;
        NavExpended: () => void;
        MasterAddr: string;
        MasterNode: GhostWebUser;
    }
}

const funcMap: FuncMap = {
    "signin": new Signin(blockStore),
    "signup": new Signup(blockStore),
    "hon": new Hon(blockStore),
    "hons": new Hons(blockStore),
    "main": new GWSMain(blockStore),
    "txdetail": new TxDetail(blockStore),
    "blockdetail": new TxInfo(blockStore),
    "blockscan": new BlockInfo(blockStore),
    "accountdetail": new AccountDetail(blockStore),
};

const urlToFileMap: UrlMap = {
    "main": "ghostnetservice/main.html",
    "signin": "hons/signin.html",
    "signup": "hons/signup.html",
    "hons": "hons/hons.html",
    "hon": "hons/hon.html",
    "txdetail": "ghostnetservice/txdetail.html",
    "blockdetail": "ghostnetservice/blockdetail.html",
    "blockscan": "ghostnetservice/blocklist.html",
    "accountdetail":"ghostnetservice/accountdetail.html",
};

const getPageIdParam = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageid = urlParams.get("pageid");
    const key = (pageid == null) ? "main" : pageid;
    if (beforPage == undefined) beforPage = key;
    return key;
}

let beforPage: string;
window.ClickLoadPage = (key: string, fromEvent: boolean, ...args: string[]) => {
    //if (getPageIdParam() == key) return;

    const url = urlToFileMap[key];
    const state = { 
        'url': window.location.href,
        'key': key,
        'fromEvent': fromEvent,
        'args': args
    };
    console.log(`page change : ${beforPage} ==> ${key}`)
    const backUpBeforPage = beforPage;
    beforPage = key;

    history.pushState(state, "login", "./?pageid=" + key + args);
    fetch(url)
        .then(response => { return response.text(); })
        .then(data => { (document.querySelector("contents") as HTMLDivElement).innerHTML = data; })
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
    console.log(fromEvent)
};
let expendFlag = false;
window.NavExpended = () => {
    let view = (expendFlag == false) ? "block" : "none";
    (document.querySelector("#navbarNav") as HTMLDivElement).style.display = view;
    (document.querySelector("#navbarNavRight") as HTMLDivElement).style.display = view;
    expendFlag = !expendFlag;
};

window.onpopstate = (event) => {
    //window.ClickLoadPage(event.state['key'], event.state['fromEvent'], event.state['args'])
    includeContentHTML(window.MasterAddr);
};

const parseResponse = (nodes: GhostWebUser[]) => {
    let randIdx = Math.floor(Math.random() * nodes.length);
    console.log(nodes);
    return nodes[randIdx];
};

const loadNodesHtml = (node: GhostWebUser) => {
    window.MasterNode = node;
    window.MasterAddr = `http://${node.User.ip.Ip}:${node.User.ip.Port}`;
    return window.MasterAddr;
};
const includeHTML = (id: string, filename: string) => {
    window.addEventListener('load', () => fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { (document.querySelector(id) as HTMLDivElement).innerHTML = data; }));
}

const includeContentHTML = (master: string) => {
    const key = getPageIdParam();
    const filename = urlToFileMap[key];
    const backUpBeforPage = beforPage;
    beforPage = key;
    fetch(filename)
        .then(response => { return response.text(); })
        .then(data => { (document.querySelector("contents") as HTMLDivElement).innerHTML = data; })
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
}

export { includeContentHTML, includeHTML, loadNodesHtml, parseResponse }