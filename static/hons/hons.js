import { elapsedTime } from "../utils.js";
const HonsTxId = "dcRfHIj75kpsGhu/fZq/8LrnQDIF4qIJbJJz3YM4XiA=";
const HonTxId = "gWKlQ+lzus3I/m/K9qGm4VICaBr9byPTyL83E+ef4gA=";
export class Hons {
    constructor(blockStore, session) {
        this.blockStore = blockStore;
        this.session = session;
        this.m_masterAddr = "";
        this.m_session = session;
        this.m_blockStore = blockStore;
    }
    warningMsg(msg) {
        console.log(msg);
        const info = document.getElementById("information");
        if (info == null)
            return;
        info.innerHTML = msg;
    }
    honsResult(ret) {
        if ("json" in ret) {
            const keys = JSON.parse(ret.json);
            console.log(keys);
            return keys;
        }
        else {
            this.warningMsg("Loading 실패");
        }
        return [];
    }
    drawHtmlHon(ret) {
        const feeds = document.getElementById("feeds");
        if (feeds == null)
            return;
        feeds.innerHTML += `
        <br>
            <div class="card">
                <div class="card-header"> 
                    <strong class="me-auto">${ret.Id}</strong>
                    <small> ${elapsedTime(Number(ret.Time))}</small>
                </div>
                <div class="card-body">
                    ${ret.Content}
                </div>
            </div>
        `;
        console.log(ret);
    }
    RequestHon(keys, callback) {
        const addr = this.m_masterAddr + "/glambda?txid=" + encodeURIComponent(HonTxId);
        keys.forEach((key) => {
            fetch(addr, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    Table: "feeds",
                    key: atob(key),
                })
            })
                .then((response) => response.json())
                .then((result) => callback(result));
        });
    }
    RequestHons(n, callback) {
        this.m_masterAddr = window.MasterAddr;
        const masterAddr = this.m_masterAddr;
        const user = this.m_session.GetHonUser();
        const addr = masterAddr + "/glambda?txid=" + encodeURIComponent(HonsTxId);
        fetch(addr, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Table: "feeds",
                Start: 0,
                Count: n,
            })
        })
            .then((response) => response.json())
            .then((result) => this.honsResult(result))
            .then((keys) => this.RequestHon(keys, callback))
            .catch(() => { this.warningMsg("Server에 문제가 생긴듯 합니다;;"); });
    }
    GetHons(n, callback) {
        this.RequestHons(n, callback);
    }
    Run(masterAddr) {
        this.m_masterAddr = masterAddr;
        this.RequestHons(5, this.drawHtmlHon);
        return true;
    }
    Release() {
        const feeds = document.getElementById("feeds");
        if (feeds == null)
            return;
        feeds.innerHTML = ``;
    }
}
//# sourceMappingURL=hons.js.map