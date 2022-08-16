import * as borsh from '@project-serum/borsh'

export class TodoCounter {
    count: number;

    constructor(count: number) {
        this.count = count;
    }

    static borshSchema = borsh.struct([
        borsh.str('discriminator'),
        borsh.bool('is_initialized'),
        borsh.u64('count'),
    ])

    static deserialize(buffer?: Buffer): TodoCounter | null {
        if (!buffer) {
            return null
        }

        try {
            const { count } = this.borshSchema.decode(buffer)
            return new TodoCounter(count)
        }
        catch (e) {
            console.log('Deserialization error:', e)
            return null
        }
    }
}