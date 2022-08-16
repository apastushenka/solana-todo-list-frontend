import * as borsh from "@project-serum/borsh";
import * as web3 from "@solana/web3.js";
import { TODO_PROGRAM_ID } from "./constants";

const addTodoSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("message")
]);

const addTodoInstructionData = (message: string): Buffer => {
    const buffer = Buffer.alloc(1000);
    addTodoSchema.encode({ variant: 0x1, message }, buffer);

    return buffer.subarray(0, addTodoSchema.getSpan(buffer));
};

const initTodoList = (
    initializer: web3.PublicKey,
    counter: web3.PublicKey
): web3.TransactionInstruction => {
    return new web3.TransactionInstruction({
        keys: [
            {
                pubkey: initializer,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: counter,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: web3.SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
        ],
        programId: new web3.PublicKey(TODO_PROGRAM_ID),
        data: Buffer.from([0x0]),
    });
};

const addTodo = (
    initializer: web3.PublicKey,
    counter: web3.PublicKey,
    todo: web3.PublicKey,
    message: string
): web3.TransactionInstruction => {
    return new web3.TransactionInstruction({
        keys: [
            {
                pubkey: initializer,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: counter,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: todo,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: web3.SystemProgram.programId,
                isSigner: false,
                isWritable: false,
            },
        ],
        programId: new web3.PublicKey(TODO_PROGRAM_ID),
        data: addTodoInstructionData(message),
    });
};

export { initTodoList, addTodo };
