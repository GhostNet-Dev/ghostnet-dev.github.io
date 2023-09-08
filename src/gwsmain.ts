import { elapsedTime, calcGCoin } from "./utils.js";
import { AccountParam, BlockInfoParam } from "./models/param.js";
import { BlockStore } from "./store.js";

const MaxInfoViewCnt = 5;

export class GWSMain {
    m_blockInfos: BlockInfoParam[];
    m_blockStore: BlockStore;
    m_maxBlockId: number;
    m_curGetherTx: number;
    public constructor(private blockStore: BlockStore) {
        this.m_blockStore = blockStore;
        this.m_maxBlockId = 0;
        this.m_curGetherTx = 0;
        this.m_blockInfos = new Array<BlockInfoParam>();

    }

    init() {
        this.m_maxBlockId = 0;
        this.m_curGetherTx = 0;
        this.m_blockInfos = new Array<BlockInfoParam>();
    }

    drawHtmlAccountList(accounts: AccountParam[]) {
        const bodyTag = document.getElementById('accountlist');
        if (bodyTag == null) return
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

    drawHtmlLatestEarnMaster() {
        const bodyTag = document.getElementById('latesttx');
        if (bodyTag == null) return
        bodyTag.innerHTML = `
            <div class="row division-line">
                <div class="col font-weight-bold">Latest Tx Master</div>
            </div>
        `;
        this.m_blockInfos.forEach(blockInfo => {
            const blockId = parseInt(blockInfo.Header.Id);
            this.m_blockStore.RequestBlock(blockId)
                .then(block => {
                    block.Alice.forEach(tx => {
                        this.m_blockStore.RequestAccount(tx.Body.Vout[0].Addr)
                            .then(accountParam => {
                                bodyTag.innerHTML += `
            <div class="row division-line">
                <div class="col-1">${blockInfo.Header.Id}</div>
                <div class="col-4 maxtext">${accountParam.Nickname} master</div>
                <div class="col-3 maxtext">${calcGCoin(accountParam.Coin)} GCoin</div>
                <div class="col-3 maxtext">${calcGCoin(parseInt(tx.Body.Vout[0].Value))}</div>
            </div>
                            `;
                            })
                    })
                })
        })

    }

    blockInfoGether(blockInfoParam: BlockInfoParam) {
        const txCnt = parseInt(blockInfoParam.Header.AliceCount);
        if (this.m_curGetherTx > MaxInfoViewCnt) return;
        this.m_curGetherTx += txCnt;
        this.m_blockInfos.push(blockInfoParam);
    }

    drawHtmlLatestBlock(blockInfoParams: BlockInfoParam[]) {
        const bodyTag = document.getElementById('latestblocks');
        if (bodyTag == null) return
        bodyTag.innerHTML = `
            <div class="row division-line">
                <div class="col font-weight-bold">Latest Blocks</div>
            </div>
        `;
        blockInfoParams.slice(0, 5).forEach(blockInfo => {
            this.blockInfoGether(blockInfo);
            const blockId = parseInt(blockInfo.Header.Id);
            this.m_maxBlockId = (blockId > this.m_maxBlockId) ? this.m_maxBlockId = blockId : this.m_maxBlockId;
            bodyTag.innerHTML += `
            <div class="row division-line">
                <div class="col-1">${blockInfo.Header.Id}</div>
                <div class="col-3 maxtext">${elapsedTime(Number(blockInfo.Header.TimeStamp) * 1000)}</div>
                <div class="col-2 maxtext">${blockInfo.Header.TransactionCount} txns</div>
                <div class="col-3 maxtext">${blockInfo.Header.AliceCount} masters</div>
                <div class="col-3 maxtex" id="bminer${blockInfo.Header.Id}">unknown</div>
            </div>
            `;
            const pubKey = blockInfo.Header.BlockSignature.PubKey;
            this.m_blockStore.RequestAccount(pubKey)
                .then((res) => {
                    const tag = document.getElementById('bminer' + blockInfo.Header.Id);
                    if (tag == null) return;
                    tag.innerHTML = res.Nickname;
                });
        });
        bodyTag.innerHTML += `
        <div class="row">
            <div class="col text-center">View All Blocks</div>
        </div>`;
    }
    drawHtml(blockInfoParam: BlockInfoParam[]) {
        this.drawHtmlLatestBlock(blockInfoParam);
        this.drawHtmlLatestEarnMaster();
    }
    drawHtmlConnectMaster() {
        const bodyTag = document.getElementById('connect');
        if (bodyTag == null) return;
        console.log(window.MasterNode);
        bodyTag.innerHTML = `<b>Connected Master</b> - ${window.MasterNode.User.Nickname}`;
    }
    public Run(masterAddr: string): boolean {
        this.init();

        this.drawHtmlConnectMaster();
        this.m_blockStore.RequestAccountList(0, 20)
            .then((param) => this.drawHtmlAccountList(param));
        this.m_blockStore.RequestBlockList(null)
            .then(param => this.drawHtml(param))
        return true;
    }
    public Release(): void { }
}
