import { calcGCoin } from "./utils.js";
import { TxOutputTypeStr } from "./models/tx.js";
export class AccountDetail {
    constructor(blockStore) {
        this.blockStore = blockStore;
        this.m_masterAddr = "";
        this.m_blockStore = blockStore;
        this.m_accountParam = { Coin: 0, Nickname: "", PubKey: "" };
    }
    getAccountParam() {
        var _a;
        const urlParams = new URLSearchParams(window.location.search);
        const pubkey = (_a = urlParams.get("pubkey")) !== null && _a !== void 0 ? _a : "";
        return pubkey;
    }
    drawHtmlCoinList(type, params) {
        const bodyTag = document.getElementById('outputlist');
        if (bodyTag == null)
            return;
        bodyTag.innerHTML += `
            <h5>${TxOutputTypeStr[type]} List</h5>
            <div class="row">
                <div class="col-6 font-weight-bold">TxId</div>
                <div class="col-2 font-weight-bold">Coin</div>
                <div class="col-2 font-weight-bold">Master</div>
            </div>
            <div class="row">
                <div class="col division-line"></div>
            </div>
            `;
        params.forEach((param) => {
            bodyTag.innerHTML += `
            <div class="row">
                <div class="col-6 maxtext"> 
                    <a class="handcursor maxtext" onclick='ClickLoadPage("txdetail", false, "&txid=${encodeURIComponent(param.VOutPoint.TxId)}")'>
                        ${param.VOutPoint.TxId} 
                    </a>
                </div>
                <div class="col-2">${calcGCoin(parseInt(param.Vout.Value))}</div>
                <div class="col-2 maxtext" id="${param.VOutPoint.TxId}">${param.Vout.BrokerAddr}</div>
            </div>
            <div class="row">
                <div class="col division-line"></div>
            </div>
            `;
            this.m_blockStore.RequestAccount(param.Vout.BrokerAddr)
                .then((res) => {
                const tag = document.getElementById(param.VOutPoint.TxId);
                if (tag == null)
                    return;
                tag.innerHTML = res.Nickname;
            });
        });
    }
    drawHtml(param) {
        const bodyTag = document.getElementById('accountdetail');
        if (bodyTag == null)
            return;
        bodyTag.innerHTML = `
            <h5>${param.Nickname}</h5>
            <li>${param.PubKey}</li>
            <li>${calcGCoin(param.Coin)}</li>
        `;
        this.m_accountParam = param;
    }
    Run(masterAddr) {
        this.m_masterAddr = masterAddr;
        const pubkey = this.getAccountParam();
        if (pubkey == null)
            return false;
        this.m_blockStore.RequestAccount(pubkey)
            .then((param) => this.drawHtml(param))
            .then(() => {
            this.m_blockStore.RequestOutputList(1 /* TxOutputType.TxTypeCoinTransfer */, this.m_accountParam.PubKey, 0, 50)
                .then(param => this.drawHtmlCoinList(1 /* TxOutputType.TxTypeCoinTransfer */, param));
        });
        return true;
    }
    Release() {
        const bodyTag = document.getElementById('outputlist');
        if (bodyTag == null)
            return;
        bodyTag.innerHTML = '';
    }
}
//# sourceMappingURL=accountdetail.js.map