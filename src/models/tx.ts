const TxOutputType = {
    None: 0,
    TxTypeConinTransfer: 1,
    TxTypeDataStore: 2,
    TxTypeFSRoot: 3,
    TxTypeContract: 4
} as const;
export type TxOutputType = typeof TxOutputType[keyof typeof TxOutputType];


export type TxOutPoint = {
    TxId: string,
    TxOutIndex: string,
}

export type TxInput = {
    PrevOut: TxOutPoint,
    Sequence: string,
    ScriptSize: string,
    ScriptSig: string
}

export type TxOutput = {
    Addr: string,
    BrokerAddr: string,
    Type: TxOutputType,
    Value: string,
    ScriptSize: string,
    ScriptPubKey: string,
    ScriptExSize: string,
    ScriptEx: string
}

export type TxBody = {
    InputCounter: string,
    Vin: TxInput[],
    OutputCounter: string,
    Vout: TxOutput[],
    Nonce: string,
    LockTime: string,
}

export type GhostTransaction = {
    TxId: string,
    Body: TxBody,
}

export type GhostDataTransaction = {
    TxId: string,
    LogicalAddress: string,
    DataSize: string,
    Data: string
}