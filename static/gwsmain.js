import { elapsedTime, calcGCoin } from "./utils.js";
const MaxInfoViewCnt = 5;
export class GWSMain {
    constructor(blockStore, hons) {
        this.blockStore = blockStore;
        this.m_blockStore = blockStore;
        this.m_hons = hons;
        this.m_maxBlockId = 0;
        this.m_curGetherTx = 0;
        this.m_blockInfos = new Array();
    }
    init() {
        this.m_maxBlockId = 0;
        this.m_curGetherTx = 0;
        this.m_blockInfos = new Array();
    }
    drawHtmlAccountList(accounts) {
        const bodyTag = document.getElementById('accountlist');
        if (bodyTag == null)
            return;
        bodyTag.innerHTML = '<b>Latest Master Nodes</b>';
        accounts.forEach(account => {
            bodyTag.innerHTML += `
                &nbsp;&nbsp;
                ${account.Nickname}&nbsp;&nbsp;<b>${calcGCoin(account.Coin)}</b>
                &nbsp;&nbsp;
            `;
        });
        bodyTag.innerHTML += ``;
    }
    excuteDrawHtmlLatestEarnMaster(results) {
        if (results.length != 5)
            return;
        const bodyTag = document.getElementById('latesttx');
        if (bodyTag == null)
            return;
        bodyTag.innerHTML = `<div class="container py-0 my-0">`;
        results.forEach((ret, idx) => {
            const line = (idx < 4) ? `<div class="row p-1"> 
            <div class="col"><hr class="py-0 my-0"/></div> </div>` : "";
            bodyTag.innerHTML += `
            <div class="row p-0 m-1">
                <div class="col-1 align-middle"><span class="material-symbols-outlined"> 
                toll </span>
                </div>
                <div class="col maxtext">${ret.TxId}</div>
                <div class="col font-weight-bold text-success">+ ${calcGCoin(ret.AddCoin)}</div>
                <div class="col text-right">${ret.Nickname} master<br>
                    ${calcGCoin(ret.TotalCoin)} GCoin</div>
            </div>${line}
                            `;
        });
    }
    drawHtmlLatestEarnMaster() {
        const results = new Array();
        this.m_blockInfos.forEach((blockInfo, idx) => {
            const blockId = parseInt(blockInfo.Header.Id);
            this.m_blockStore.RequestBlock(blockId)
                .then(block => {
                block.Alice.forEach(tx => {
                    this.m_blockStore.RequestAccount(tx.Body.Vout[0].Addr)
                        .then(accountParam => {
                        results.push({ Id: blockInfo.Header.Id,
                            TxId: tx.TxId,
                            AddCoin: parseInt(tx.Body.Vout[0].Value),
                            Nickname: accountParam.Nickname,
                            TotalCoin: accountParam.Coin
                        });
                    }).then(() => this.excuteDrawHtmlLatestEarnMaster(results));
                });
            });
        });
    }
    blockInfoGether(blockInfoParam) {
        const txCnt = parseInt(blockInfoParam.Header.AliceCount);
        if (this.m_curGetherTx > MaxInfoViewCnt)
            return;
        this.m_curGetherTx += txCnt;
        this.m_blockInfos.push(blockInfoParam);
    }
    drawHtmlLatestBlock(blockInfoParams) {
        const bodyTag = document.getElementById('latestblocks');
        if (bodyTag == null)
            return;
        bodyTag.innerHTML = `<div class="container py-0 my-0">`;
        blockInfoParams.slice(0, 5).forEach((blockInfo, idx) => {
            this.blockInfoGether(blockInfo);
            const blockId = parseInt(blockInfo.Header.Id);
            const line = (idx < 4) ? `<div class="row p-1"> 
            <div class="col"><hr class="py-0 my-0"/></div> </div>` : "";
            this.m_maxBlockId = (blockId > this.m_maxBlockId) ? this.m_maxBlockId = blockId : this.m_maxBlockId;
            bodyTag.innerHTML += `
            <div class="row m-1">
                <div class="col-1 align-middle"><span class="material-symbols-outlined"> stack </span>
                </div>
                 <div class="col">${blockInfo.Header.Id}<br><small>${elapsedTime(Number(blockInfo.Header.TimeStamp) * 1000)}</small>
                </div>
                <div class="col">
                    <span>${blockInfo.Header.TransactionCount} txns</span><br>
                    <span>${blockInfo.Header.AliceCount} masters</span>
                </div>
                <div class="col text-right">
                    <span id="bminer${blockInfo.Header.Id}">unknown</span>
                </div>
            </div>
            ${line}
            `;
            bodyTag.innerHTML += `</div>`;
            const pubKey = blockInfo.Header.BlockSignature.PubKey;
            this.m_blockStore.RequestAccount(pubKey)
                .then((res) => {
                const tag = document.getElementById('bminer' + blockInfo.Header.Id);
                if (tag == null)
                    return;
                tag.innerHTML = res.Nickname;
            });
        });
    }
    drawHtml(blockInfoParam) {
        this.drawHtmlLatestBlock(blockInfoParam);
        this.drawHtmlLatestEarnMaster();
    }
    drawHtmlConnectMaster() {
        const bodyTag = document.getElementById('connect');
        if (bodyTag == null)
            return;
        console.log(window.MasterNode);
        bodyTag.innerHTML = `<b>Connected Master</b> - ${window.MasterNode.User.Nickname}`;
    }
    drawHtmlNewHons() {
        const bodyTag = document.getElementById('newhon');
        if (bodyTag == null)
            return;
        this.m_hons.GetHons(5, (hon) => {
            bodyTag.innerHTML += `
                    <span class="border rounded m-2">
                    <span class="material-symbols-outlined"> person </span>
                    <a href="javascript:void(0)" onclick="ClickLoadPage('hondetail', false, '&email=${hon.Email}')">
                    <strong class="me-auto">
                    ${hon.Id}
                   </strong> </a>
                    <small> ${elapsedTime(Number(hon.Time))}</small>
                    - ${hon.Content}</span>
                        `;
        });
    }
    Run(masterAddr) {
        this.init();
        this.drawHtmlConnectMaster();
        this.m_blockStore.RequestAccountList(0, 20)
            .then((param) => this.drawHtmlAccountList(param));
        this.m_blockStore.RequestBlockList(0, 5)
            .then(param => this.drawHtml(param));
        this.drawHtmlNewHons();
        return true;
    }
    Release() { }
}
//# sourceMappingURL=gwsmain.js.map