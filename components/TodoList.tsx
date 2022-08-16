import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { TodoCounter } from '../models/TodoCounter'
import { TODO_PROGRAM_ID } from '../utils/constants'
import { Todo } from './Todo'

export const TodoList = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [count, setCount] = useState(0);

    useEffect(() => {
        const handleAccount = (account: web3.AccountInfo<Buffer> | null) => {
            let counter = TodoCounter.deserialize(account?.data)
            setCount(counter?.count ?? 0)
        }

        if (publicKey) {
            let [pdaCounter] = web3.PublicKey.findProgramAddressSync(
                [publicKey.toBuffer()],
                new web3.PublicKey(TODO_PROGRAM_ID)
            )

            connection.getAccountInfo(pdaCounter)
                .then(handleAccount)

            const id = connection.onAccountChange(pdaCounter, handleAccount)

            return () => {
                connection.removeAccountChangeListener(id)
            }
        } else {
            setCount(0)
        }
    }, [connection, publicKey])

    const todos = []
    for (let i = 0; i < count; i++) {
        todos.push(<Todo key={i} index={i}></Todo>)
    }

    return (
        <div>{todos}</div>
    )
}
