import { TxInfoParam } from "./models/param.js";
import { GhostTransaction, TxInput, TxOutput } from "./models/tx.js";
import { BlockStore } from "./store.js";

export class TxDetail {
    public constructor(private blockStore: BlockStore) { }

    drawHtmlTxBody(tx: GhostTransaction): void {
        console.log(tx);
        const bodyTag = document.getElementById('txbody');
        if (bodyTag == null) return;
        bodyTag.innerHTML = `
            <li>TxId: ${tx.TxId}</li>
            <li>Nonce: ${tx.Body.Nonce}</li>
            <li>LockTime: ${tx.Body.LockTime}</li>
        `;
    }

    drawHtmlInput(inputs: TxInput[]): void {
        const bodyTag = document.getElementById('txinput');
        if (bodyTag == null) return;
        inputs.forEach((input, idx) => {
            bodyTag.innerHTML = `
            <div class="row">
                <div class="col">
                    <li>Index: ${idx}</li>
                    <li>Previous TxId: ${input.PrevOut.TxId}</li>
                    <li>Output Index: ${input.PrevOut.TxOutIndex}</li>
                    <li>Script Size: ${input.ScriptSize}</li>
                </div>
            </div>
            `;
        })
    }

    drawHtmlOutput(outputs: TxOutput[]): void {
        const bodyTag = document.getElementById('txoutput');
        if(bodyTag == null) return ;
        outputs.forEach((output, idx) => {
            bodyTag.innerHTML = `
            <div class="row">
                <div class="col">
                    <li>Index: ${idx}</li>
                    <li>Destination: ${output.Addr}</li>
                    <li>Broker: ${output.BrokerAddr}</li>
                    <li>Output Type: ${output.Type}</li>
                    <li>Value: ${output.Value}</li>
                </div>
            </div>
            `;
        })
    }

    drawHtml(param: TxInfoParam): void {
        this.drawHtmlTxBody(param.Tx);
        this.drawHtmlInput(param.Tx.Body.Vin);
        this.drawHtmlOutput(param.Tx.Body.Vout);
    }

    getTxIdParam(): string | null {
        const urlParams = new URLSearchParams(window.location.search);
        const txId = urlParams.get("txid");
        if (txId == null) return null;
        return txId;
    }

    public Run(masterAddr: string): boolean {
        const txId = this.getTxIdParam();
        if (txId == null) return false;
        fetch(masterAddr + `/tx?txid=${txId}`)
            .then((response) => response.json())
            .then((param)=>this.drawHtml(param))
        return true;
    }

    public Release(): void { }
}