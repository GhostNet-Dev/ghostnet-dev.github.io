const MaxUnsignedInt = ((1 << 31) >>> 0); // unsigned int max
export class BlockStore {
    constructor() {
        this.m_minBlockId = MaxUnsignedInt;
        this.blockInfos = new Array();
        this.m_accountMap = new Map();
    }
    GetAccount(nick) {
        return this.m_accountMap.get(nick);
    }
    InsertBlockInfos(blockHeaders) {
        blockHeaders.forEach(blockInfo => {
            const idx = this.blockInfos.findIndex(x => x.Header.Id == blockInfo.Header.Id);
            if (idx == -1) {
                this.blockInfos.push(blockInfo);
            }
        });
        //this.blockInfos.push.apply(this.blockInfos, blockHeaders);
    }
    GetBlockInfo(blockId) {
        return this.blockInfos.filter(x => Number(x.Header.Id) == blockId);
    }
    GetBlockInfos() {
        return this.blockInfos;
    }
    RequestAccount(addr) {
        const encodeAddr = encodeURIComponent(addr);
        if (encodeAddr == null)
            return Promise.reject();
        const account = this.m_accountMap.get(encodeAddr);
        if (account != undefined) {
            return new Promise(account => account);
        }
        return fetch(window.MasterAddr + `/account?addr=${encodeAddr}`)
            .then((response) => response.json())
            .then((account) => {
            this.m_accountMap.set(account.Nickname, account);
            return account;
        });
    }
    RequestAccountList(start, count) {
        if (count == null)
            return Promise.reject();
        return fetch(window.MasterAddr + `/accountlist?start=${start}&cnt=${count}`)
            .then((response) => {
            return response.json();
        });
    }
    RequestScript(txId) {
        if (txId == null)
            return Promise.reject();
        return fetch(window.MasterAddr + `/script?txid=${txId}`)
            .then((response) => response.json());
    }
    RequestTx(txId) {
        return fetch(window.MasterAddr + `/tx?txid=${txId}`)
            .then((response) => response.json());
    }
    RequestOutputList(txtype, addr, start, cnt) {
        const encodeAddr = encodeURIComponent(addr);
        return fetch(window.MasterAddr + `/outputlist?addr=${encodeAddr}&types=${txtype}&start=${start}&cnt=${cnt}`)
            .then((response) => response.json());
    }
    RequestBlock(blockId) {
        return fetch(window.MasterAddr + `/blockdetail?blockid=${blockId}`)
            .then((response) => response.json());
    }
    RequestBlockList(range) {
        const promise = (range == null) ?
            fetch(window.MasterAddr + "/blocks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            }) : fetch(window.MasterAddr + "/blocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(range)
        });
        return promise.then((response) => response.json());
    }
}
//# sourceMappingURL=store.js.map