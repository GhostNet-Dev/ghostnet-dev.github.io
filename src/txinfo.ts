import { GhostNetBlock } from "./models/block.js";
import { GhostTransaction } from "./models/tx.js";
import { BlockStore } from "./store.js";
type DataContext = { Title: string, Content: string };

export class TxInfo {
    public constructor(private blockStore: BlockStore) { }
    makeInfos(block: GhostNetBlock): DataContext[] {
        return [
            { Title: "Block Id", Content: block.Header.Id },
            { Title: "Version", Content: block.Header.Version },
            { Title: "Prev Block Hash", Content: block.Header.PreviousBlockHeaderHash },
            { Title: "Merkle Root", Content: block.Header.MerkleRoot },
            { Title: "Data Block Hash", Content: block.Header.DataBlockHeaderHash },
            { Title: "Date", Content: block.Header.TimeStamp },
            { Title: "Base Coin Tx Number", Content: block.Header.AliceCount },
            { Title: "Tx Number", Content: block.Header.AliceCount },
            { Title: "Block Miner", Content: block.Header.BlockSignature.PubKey },
        ];
    }
    drawHtmlTxInfo(tx: GhostTransaction): HTMLDivElement {
        const rows = document.createElement('div');
        rows.setAttribute('class', 'row');
        const divTxId = document.createElement('div');
        divTxId.setAttribute('class', 'col');
        const link = document.createElement('a');
        link.setAttribute('onclick', `ClickLoadPage("txdetail", false, "&txid=${tx.TxId}")`);
        link.innerHTML = tx.TxId;
        divTxId.appendChild(link);
        const divInputCnt = document.createElement('div');
        divInputCnt.setAttribute('class', 'col');
        divInputCnt.innerHTML = tx.Body.InputCounter;
        const divOutputCnt = document.createElement('div');
        divOutputCnt.setAttribute('class', 'col');
        divOutputCnt.innerHTML = tx.Body.OutputCounter;
        rows.appendChild(divTxId);
        rows.appendChild(divInputCnt);
        rows.appendChild(divOutputCnt);
        return rows;
    }

    drawHtml(txinfos: DataContext[]): void {
        const blockDetailTag = document.getElementById('blockdetail');
        txinfos.forEach((data) => {
            const rows = document.createElement('div');
            rows.setAttribute('class', 'row');
            const divTitle = document.createElement('div');
            divTitle.setAttribute('class', 'col-4');
            divTitle.innerHTML = data.Title;
            const divContent = document.createElement('div');
            divContent.setAttribute('class', 'col-8');
            divContent.innerHTML = data.Content;
            rows.appendChild(divTitle);
            rows.appendChild(divContent);
            blockDetailTag?.appendChild(rows)
        })
    }

    drawHtmlTxList(block: GhostNetBlock) {
        const txListTag = document.getElementById('txlist');
        block.Alice.forEach((tx)=> {
            txListTag?.appendChild(this.drawHtmlTxInfo(tx));
        });
        block.Transaction.forEach((tx)=> {
            txListTag?.appendChild(this.drawHtmlTxInfo(tx));
        });
    }

    getBlockIdParam(): number | null {
        const urlParams = new URLSearchParams(window.location.search);
        const blockId = urlParams.get("blockid");
        if (blockId == null) return null;
        return Number(blockId);
    }
    public Run(masterAddr: string): boolean {
        const blockId = this.getBlockIdParam();
        if (blockId == null || blockId < 1) return false;

        fetch(masterAddr + `/blockdetail?blockid=${blockId}`)
            .then((response) => response.json())
            .then((list) => {
                this.drawHtml(this.makeInfos(list));
                this.drawHtmlTxList(list);
            });
        return true;
    }
    public Release(): void { }
}