import _ from 'lodash'
/**
 *    Vertex i:
 *      - the left child has index "2*i+1"
 *      - the right child has index "2*i+2"
 * */
// TODO need to rewrite
export class BinaryHeap<TType> {
    private list: Array<HeapNode<TType>> = []

    public size() {
        return this.list.length
    }

    public add(value: TType, priority: number) {
        if(this.list.findIndex(node => node.priority === priority) >= 0) return

        const node = new HeapNode<TType>(value, priority)
        this.list.push(node)

        let lastNodeIndex = this.size() - 1
        let parentIndex = (lastNodeIndex - 1) / 2

        let parent = this.list[parentIndex]
        while (lastNodeIndex > 0 && parent?.priority < node.priority) {
            this.swap(lastNodeIndex, parentIndex)

            lastNodeIndex = parentIndex
            parentIndex = (lastNodeIndex - 1) / 2
            parent = this.list[parentIndex]
        }

        return node
    }

    /* heapify = sort */
    public heapify(vertex: number) {
        let leftChildIndex;
        let rightChildIndex;
        let largestChildIndex;

        while (true) {
            leftChildIndex = 2 * vertex + 1
            rightChildIndex = 2 * vertex + 2
            largestChildIndex = vertex

            if(leftChildIndex < this.size()) {
                const [leftChild, largestChild] = this.getByIndex(leftChildIndex, largestChildIndex)

                if(leftChild.priority > largestChild.priority) {
                    largestChildIndex = leftChildIndex;
                }
            }

            if(rightChildIndex < this.size()) {
                const [rightChild, largestChild] = this.getByIndex(rightChildIndex, largestChildIndex)

                if(rightChild.priority > largestChild.priority) {
                    largestChildIndex = rightChildIndex;
                }
            }

            if(largestChildIndex === vertex) break

            this.swap(vertex, largestChildIndex)
            vertex = largestChildIndex
        }

        return this
    }

    public remove(priority: number) {
        if(priority >= this.size()) {
            throw new Error(`oversize priority`)
        }
        if(this.size() === 0) {
            throw new Error(`heep is empty`)
        }

        const index = this.list.findIndex(node => node.priority === priority)
        this.list = this.list.slice(0, index).concat(this.list.slice(index + 1))

        let i = this.size()
        while (i >= index) {
            this.heapify(i--)
        }

        return this
    }

    public draw(cb: (node: HeapNode<TType>, list: BinaryHeap<TType>['list']) => any) {
        return this.list.map(node => cb(node, this.list))
    }

    public drawFirst(cb: (node: HeapNode<TType>, list: BinaryHeap<TType>['list']) => any) {
        return cb(this.list[0], this.list)
    }

    private removeMax() {
        const max = this.list[0]

        this.list[0] = this.list.pop()!

        return max
    }

    private setList(array: Array<HeapNode<TType>>) {
      this.list = array
      return this
    }

    private getByIndex(...indexes: Array<number>) {
        return indexes.map(index => this.list[index])
    }

    private swap(firstNodeIndex: number, secondNodeIndex: number) {
        const temp = this.list[firstNodeIndex];
        this.list[firstNodeIndex] = this.list[secondNodeIndex];
        this.list[secondNodeIndex] = temp;
    }

    public static buildFromArray(array: Array<number>): BinaryHeap<number> {
        const nodes = _.uniq(array).map(value => new HeapNode<number>(value, value))

        const heap = new BinaryHeap<number>().setList(nodes)

        let i = heap.size()
        while (i >= 0) {
            heap.heapify(i--)
        }

        return heap
    }

    public static sort(array: Array<number>) {
        const heap = this.buildFromArray(array);
        const result = []

        let i = heap.size() - 1
        while (i >= 0) {
            result[i--] = heap.removeMax()
            heap.heapify(0)
        }

        return result.map(res => res.value)
    }
}

export class HeapNode<TValue> {
    public value: TValue
    public priority: number

    constructor(value: TValue, priority: number) {
        this.value = value
        this.priority = priority
    }

    public getChildren(list: BinaryHeap<TValue>['list'], type: 'left' | 'right') {
        const index = list.findIndex(node => node.priority === this.priority)
        if(index === list.length - 1) {
            return null
        }

        const childIndex = type === 'left' ?  (2 * index + 1) : (2 * index + 2)
        return list[childIndex] ?? null
    }
}
