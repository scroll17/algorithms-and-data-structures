export class DoublyList<TType> {
    private length: number = 0
    private head: Node<TType> | null = null
    private tail: Node<TType> | null = null

    public size() {
        return this.length
    }

    public addToHead(value: TType) {
        const node = new Node<TType>(value)

        if(this.length) {
            this.head!.prevNode = node
            node.nextNode = this.head
            this.head = node
        } else {
            this.head = node
            this.tail = node
        }

        this.length++
        return node
    }

    public add(value: TType) {
        const node = new Node<TType>(value)

        if(this.length) {
            this.tail!.nextNode = node
            node.prevNode = this.tail
            this.tail = node
        } else {
            this.head = node
            this.tail = node
        }

        this.length++
        return node
    }

    public addAfter(value: TType, position: number) {
        this.checkCorrectPosition(position)

        const node = new Node<TType>(value)
        const currentNode = this.find(position)

        if(position === this.length) {
            node.prevNode = currentNode
            node.nextNode = null

            this.tail = node
        } else {
            node.prevNode = currentNode
            node.nextNode = currentNode!.nextNode

            currentNode!.nextNode!.prevNode = node
        }

        currentNode!.nextNode = node

        this.length++
        return node
    }

    public find(position: number) {
        try {
            this.checkCorrectPosition(position)

            let currentNode = this.head
            let count = 1
            while (count++ < position) {
                currentNode = currentNode!.nextNode
            }

            return currentNode
        } catch (err) {
            return null
        }
    }

    public remove(position: number) {
        this.checkCorrectPosition(position)

        const head = this.head
        switch (position) {
            case 1: {
                this.head = head!.nextNode

                if(this.head) {
                    this.head.prevNode = null
                } else {
                    this.tail = null
                }

                break;
            }
            case this.length: {
                this.tail = this.tail!.prevNode
                this.tail!.nextNode = null

                break;
            }
            default: {
                const currentNode = this.find(position) as Required<Node<TType>>

                const next = currentNode.nextNode
                const prev = currentNode.prevNode

                next!.prevNode = prev
                prev!.nextNode = next

                break;
            }
        }

        this.length--
    }

    public draw<TReturn = any>(order: 'asc' | 'desc', cb: (value: Node<TType>) => TReturn): Array<TReturn> {
        const result: Array<TReturn> = []

        if(order === "asc") {
            let currentNode = this.head

            if(currentNode) {
                while (currentNode) {
                    result.push(cb(currentNode))
                    currentNode = currentNode.nextNode
                }
            }
        } else {
            let currentNode = this.tail

            if(currentNode) {
                while (currentNode) {
                    result.push(cb(currentNode))
                    currentNode = currentNode.prevNode
                }
            }
        }

        return result
    }

    private checkCorrectPosition(position: number) {
        const listIsEmpty = this.length === 0
        const isNegativePosition = position < 0
        const positionExceedsLength = position > this.length;

        [listIsEmpty, isNegativePosition, positionExceedsLength].forEach(predicate => {
            if(predicate) {
                throw new Error('Invalid input position or list is empty.')
            }
        })
    }
}

type TConstructorNode<TValue> = {
    prevNode?: Node<TValue> | null
    nextNode?: Node<TValue> | null
}
class Node<TValue> {
    public readonly value: TValue
    public prevNode: Node<TValue> | null
    public nextNode: Node<TValue> | null

    constructor(value: TValue, { prevNode = null, nextNode = null}: TConstructorNode<TValue> = {}) {
        this.value = value

        this.prevNode = prevNode
        this.nextNode = nextNode
    }
}
