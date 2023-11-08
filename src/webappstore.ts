import { BlockStore } from "./store.js";

export class WebAppStore {
    public constructor(private blockStore: BlockStore) {
    }

    public Run(masterAddr: string): boolean {
        return true;
    }

    public Release(): void { }
}