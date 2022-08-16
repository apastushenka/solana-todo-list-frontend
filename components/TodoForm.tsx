import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import BN from 'bn.js';
import { FC } from 'react';
import { TodoCounter } from '../models/TodoCounter';
import { TODO_PROGRAM_ID } from '../utils/constants';
import * as instruction from '../utils/instruction';

import styles from '../styles/Home.module.css';

export const TodoForm: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleSubmit = (event: any) => {
        event.preventDefault()
        addTodo(event.target.message.value)
    }

    const addTodo = async (message: string) => {
        if (!connection || !publicKey) {
            return
        }

        const [pdaCounter] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer()],
            new web3.PublicKey(TODO_PROGRAM_ID)
        )
        const counterData = await connection.getAccountInfo(pdaCounter);

        let todoIndex = 0
        const transaction = new web3.Transaction()
        if (counterData) {
            const counter = TodoCounter.deserialize(counterData.data)
            if (!counter) {
                return
            }
            todoIndex = counter.count
        } else {
            transaction.add(instruction.initTodoList(publicKey, pdaCounter))
        }

        const [pdaTodo] = await web3.PublicKey.findProgramAddress(
            [publicKey.toBuffer(), new BN(todoIndex).toArrayLike(Buffer, 'be', 8)],
            new web3.PublicKey(TODO_PROGRAM_ID)
        )
        transaction.add(instruction.addTodo(publicKey, pdaCounter, pdaTodo, message))

        try {
            let txid = await sendTransaction(transaction, connection)
            console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=custom&customUrl=http://localhost:8899`)
        }
        catch (e) {
            alert(JSON.stringify(e))
        }
    }

    return (
        <div>
            {
                publicKey ?
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input id='message' className={styles.formField} type='text' required></input>
                        <button className={styles.formButton} type='submit'>Add ToDo</button>
                    </form> :
                    <span>Connect Your Wallet</span>
            }
        </div>
    )
}
