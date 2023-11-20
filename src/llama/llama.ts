import { BlockStore } from "../store.js";
import { Channel } from "../models/com.js";

export class Llama {
    m_blockStore: BlockStore;
    m_ipc: Channel;
    public constructor(private blockStore: BlockStore, ipc: Channel) {
        this.m_blockStore = blockStore;
        this.m_ipc = ipc;

        ipc.RegisterMsgHandler('generateLlamaLog', (log: string) => {
            const printTag = document.getElementById("log") as HTMLDivElement;
            printTag.innerHTML += `
                ${log}
            `;
        });

        ipc.RegisterMsgHandler('reply_generateLlama', (filename: string) => {
            const printTag = document.getElementById("printImg") as HTMLDivElement;
            printTag.innerHTML += `
            End
            `;
        });
    }
    generateText() {
        const promptTag = document.getElementById("prompt") as HTMLInputElement;
        const prompt = promptTag.value.toLowerCase();
        const printTag = document.getElementById("printImg") as HTMLDivElement;
        printTag.innerHTML = `
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden"></span>
            </div>
        `;
        this.m_ipc.SendMsg("llama", prompt);
        printTag.innerHTML = ``

    }

    public Run(masterAddr: string): boolean {
        if (!this.m_ipc.IsOpen()) this.m_ipc.OpenChannel(window.MasterWsAddr + "/ws")
        const btn = document.getElementById("generateBtn") as HTMLButtonElement
        btn.onclick = () => this.generateText();

        return true;
    }

    public Release(): void { }

}