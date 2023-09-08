//export type TxOutputType = typeof TxOutputType[keyof typeof TxOutputType];
export const TxOutputTypeStr = {
    [0 /* TxOutputType.None */]: "None",
    [1 /* TxOutputType.TxTypeCoinTransfer */]: "Coin",
    [2 /* TxOutputType.TxTypeDataStore */]: "Data",
    [3 /* TxOutputType.TxTypeFSRoot */]: "Account",
    [4 /* TxOutputType.TxTypeContract */]: "Contract",
    [6 /* TxOutputType.TxTypeScript */]: "Script",
    [7 /* TxOutputType.TxTypeScriptStore */]: "Data from Script",
};
//# sourceMappingURL=tx.js.map