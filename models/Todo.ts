import * as borsh from '@project-serum/borsh'

export class Todo {
    message: string;
    completed: boolean;

    constructor(message: string, completed: boolean) {
        this.message = message;
        this.completed = completed;
    }

    static borshSchema = borsh.struct([
        borsh.str('discriminator'),
        borsh.bool('is_initialized'),
        borsh.u64('index'),
        borsh.str('message'),
        borsh.bool('is_completed'),
    ])

    static deserialize(buffer?: Buffer): Todo | null {
        if (!buffer) {
            return null
        }

        try {
            const { index, message, is_completed } = this.borshSchema.decode(buffer)
            return new Todo(message, is_completed)
        }
        catch (e) {
            console.log('Deserialization error:', e)
            return null
        }
    }
}