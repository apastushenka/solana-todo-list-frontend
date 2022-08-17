import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
import BN from 'bn.js'
import { useEffect, useState } from 'react'
import { Todo } from '../models/Todo'
import { TODO_PROGRAM_ID } from '../utils/constants'

export const TodoItem = ({ index }: { index: number }) => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [todo, setTodo] = useState<Todo | null>(null);

    useEffect(() => {
        const handleAccount = (account: web3.AccountInfo<Buffer> | null) => {
            setTodo(Todo.deserialize(account?.data))
        }

        if (publicKey) {
            const [pdaTodo] = web3.PublicKey.findProgramAddressSync(
                [publicKey.toBuffer(), new BN(index).toArrayLike(Buffer, 'be', 8)],
                new web3.PublicKey(TODO_PROGRAM_ID)
            )

            connection.getAccountInfo(pdaTodo)
                .then(handleAccount)

            const id = connection.onAccountChange(pdaTodo, handleAccount)

            return () => {
                connection.removeAccountChangeListener(id)
            }
        } else {
            setTodo(null)
        }
    }, [connection, publicKey, index])

    return (
        <div> {todo && todo.message}</div>
    )
}