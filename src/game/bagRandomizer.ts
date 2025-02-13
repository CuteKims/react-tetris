import { TetrominoType } from "../game/consts/tetrominos";

export type BagRandomizerType = '7-bag' | '14-bag' | '7+1-bag' | '7+2-bag' | {'7+x-bag': number} | 'classic'

// FIXME: Redux Style guide says not to put non-serializable values in state...

/**
 * 包随机器类。
 * 
 * 简单来讲：一种代替纯随机发送四连方块的随机器，以避免玩家长时间无法得到想要的方块或连续得到相同方块。
 * 
 * http://tetriswiki.cn/p/包随机器
 * 
 * 该类没有内部状态（纯函数形式），所以可与Redux配合使用。
 * 
 * @example
 * let bag = BagRandomizer.initialize("7-bag")
 * let [nextPiece, newBag] = bag.next()
 * let preview = newBag.getPreview() // 获取后5个预览
 */
// export class BagRandomizer {
//     private readonly pieces: TetrominoType[];
//     private readonly nextPieces: TetrominoType[];
//     private readonly type: BagRandomizerType;

//     constructor(type: BagRandomizerType) {
//         this.pieces = [];
//         this.nextPieces = [];
//         this.type = type;
//     }

//     private static generateBag(type: BagRandomizerType): TetrominoType[] {
//         let bag: TetrominoType[] = [];
//         switch (type) {
//             case '7-bag':
//                 bag = Object.values(TetrominoType).sort(() => Math.random() - 0.5)
//                 break
//             case '14-bag':
//                 for (let i = 0; i < 2; i++) {
//                     bag.concat(Object.values(TetrominoType).sort(() => Math.random() - 0.5))
//                 }
//                 break
//             case '7+1-bag':
//                 bag = Object.values(TetrominoType).sort(() => Math.random() - 0.5)
//                 bag.push(Object.values(TetrominoType)[Math.round(Math.random() * 6)])
//                 break
//             case '7+2-bag':
//                 bag = Object.values(TetrominoType).sort(() => Math.random() - 0.5)
//                 for (let i = 0; i < 2; i++) {
//                     bag.push(Object.values(TetrominoType)[Math.round(Math.random() * 6)])
//                 }
//                 break
//             case 'classic':
//                 for (let i = 0; i < 7; i++) {
//                     bag.push(Object.values(TetrominoType)[Math.round(Math.random() * 6)])
//                 }
//                 break
//             default:
//                 if (typeof type === 'object') {
//                     bag = Object.values(TetrominoType).sort(() => Math.random() - 0.5)
//                     for (let i = 0; i < type["7+x-bag"]; i++) {
//                         bag.push(Object.values(TetrominoType)[Math.round(Math.random() * 6)])
//                     }
//                 }
//         }
//         return bag
//     }

//     public getPreview(): TetrominoType[] {
//         const result: TetrominoType[] = [];
        
//         let count = 5

//         // First get pieces from current bag (in reverse order since we pop from the end)
//         for (let i = 0; i < Math.min(count, this.pieces.length); i++) {
//             result.push(this.pieces[this.pieces.length - 1 - i]);
//         }
        
//         // If we still need more pieces, get them from the next bag
//         if (result.length < count) {
//             const remainingCount = count - result.length;
//             for (let i = 0; i < Math.min(remainingCount, this.nextPieces.length); i++) {
//                 result.push(this.nextPieces[this.nextPieces.length - 1 - i]);
//             }
//         }

//         return result;
//     }
    
//     public next(): [TetrominoType, BagRandomizer] {
//         if (this.pieces.length === 0) {
//             return [
//                 this.nextPieces[this.nextPieces.length - 1],
//                 new BagRandomizer(this.type)
//                     .withPieces(this.nextPieces.slice(0, -1))
//                     .withNextPieces(BagRandomizer.generateBag(this.type))
//             ];
//         }

//         return [
//             this.pieces[this.pieces.length - 1],
//             new BagRandomizer(this.type)
//                 .withPieces(this.pieces.slice(0, -1))
//                 .withNextPieces(this.nextPieces)
//         ];
//     }

//     private withPieces(pieces: TetrominoType[]): BagRandomizer {
//         this.pieces.push(...pieces);
//         return this;
//     }

//     private withNextPieces(pieces: TetrominoType[]): BagRandomizer {
//         this.nextPieces.push(...pieces);
//         return this;
//     }

//     public static initialize(type?: BagRandomizerType): BagRandomizer {
//         type = type ?? '7-bag'
//         return new BagRandomizer(type)
//             .withPieces(BagRandomizer.generateBag(type))
//             .withNextPieces(BagRandomizer.generateBag(type));
//     }
// }

export class BagRandomizer {
    private pieces: TetrominoType[]
    private nextPieces: TetrominoType[]
    private type: BagRandomizerType

    constructor(type: BagRandomizerType) {
        this.type = type
        this.pieces = BagRandomizer.generateBag(type)
        this.nextPieces = BagRandomizer.generateBag(type)
    }

    public getNext(): TetrominoType {
        if (this.pieces.length === 0) {
            this.pieces = this.nextPieces.slice(0, -1)
            this.nextPieces = BagRandomizer.generateBag(this.type)
            return this.nextPieces[this.nextPieces.length - 1]
        }

        return this.pieces.splice(-1, 1)[0]
    }

    get preview(): TetrominoType[] {
        let result: TetrominoType[] = [];
        let count = 5

        // First get pieces from current bag (in reverse order since we pop from the end)
        for (let i = 0; i < Math.min(count, this.pieces.length); i++) {
            result.push(this.pieces[this.pieces.length - 1 - i]);
        }
        
        // If we still need more pieces, get them from the next bag
        if (result.length < count) {
            const remainingCount = count - result.length;
            for (let i = 0; i < Math.min(remainingCount, this.nextPieces.length); i++) {
                result.push(this.nextPieces[this.nextPieces.length - 1 - i]);
            }
        }

        return result;
    }

    private static generateBag(type: BagRandomizerType): TetrominoType[] {
        let bag: TetrominoType[] = [];
        switch (type) {
            case '7-bag':
                bag = Object.values(TetrominoType).sort(() => Math.random() - 0.5)
                break
            case '14-bag':
                for (let i = 0; i < 2; i++) {
                    bag.concat(Object.values(TetrominoType).sort(() => Math.random() - 0.5))
                }
                break
            case '7+1-bag':
                bag = Object.values(TetrominoType).sort(() => Math.random() - 0.5)
                bag.push(Object.values(TetrominoType)[Math.round(Math.random() * 6)])
                break
            case '7+2-bag':
                bag = Object.values(TetrominoType).sort(() => Math.random() - 0.5)
                for (let i = 0; i < 2; i++) {
                    bag.push(Object.values(TetrominoType)[Math.round(Math.random() * 6)])
                }
                break
            case 'classic':
                for (let i = 0; i < 7; i++) {
                    bag.push(Object.values(TetrominoType)[Math.round(Math.random() * 6)])
                }
                break
            default:
                if (typeof type === 'object') {
                    bag = Object.values(TetrominoType).sort(() => Math.random() - 0.5)
                    for (let i = 0; i < type["7+x-bag"]; i++) {
                        bag.push(Object.values(TetrominoType)[Math.round(Math.random() * 6)])
                    }
                }
        }
        return bag
    }
}