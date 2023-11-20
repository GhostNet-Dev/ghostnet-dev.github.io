export class Llama {
    constructor(blockStore, ipc) {
        this.blockStore = blockStore;
        this.m_blockStore = blockStore;
        this.m_ipc = ipc;
        ipc.RegisterMsgHandler('generateLlamaLog', (log) => {
            const logTag = document.getElementById("log");
            logTag.innerHTML += `
                ${log}
            `;
        });
        ipc.RegisterMsgHandler('reply_generateLlama', (filename) => {
            const printTag = document.getElementById("printImg");
            printTag.innerHTML = `
            End
            `;
        });
    }
    generateText() {
        const promptTag = document.getElementById("prompt");
        const prompt = promptTag.value.toLowerCase();
        const printTag = document.getElementById("printImg");
        printTag.innerHTML = `
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden"></span>
            </div>
        `;
        const model = "ggml-model-q4_0.gguf";
        const length = "512";
        this.m_ipc.SendMsg("llama", prompt, model, length);
        const logTag = document.getElementById("log");
        logTag.innerHTML = ``;
    }
    Run(masterAddr) {
        if (!this.m_ipc.IsOpen())
            this.m_ipc.OpenChannel(window.MasterWsAddr + "/ws");
        const btn = document.getElementById("generateBtn");
        btn.onclick = () => this.generateText();
        return true;
    }
    Release() { }
}
//# sourceMappingURL=llama.js.map