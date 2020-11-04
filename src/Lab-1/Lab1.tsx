import React, {CSSProperties, ReactComponentElement, useState} from "react";
import style from './Lab1.module.sass'

import {BinaryHeap, HeapNode} from "../Structures/BinaryHeap";

enum TaskName {
    Queue = 'Очередь',
    Heap = 'Куча',
    Sorting = 'Сортировка'
}

export function Lab1() {
    const [currentTask, changeTask] = useState<TaskName | null>(null)

    const [heap, changeHeap] = useState<BinaryHeap<number>>(new BinaryHeap())
    const [arrayString, changeArrayString] = useState<string>('')
    const [heapNewElement, changeHeapNewElement] = useState<number | null>(null)

    function addToHeap() {
        if(heapNewElement) {
            heap.add(heapNewElement, heapNewElement)
            changeHeapNewElement(null)
        }
    }
    function heapFromArray() {
        if(arrayString.length) {
            const arr = arrayString.split(',').map(v => Number(v.trim()))

            changeHeap(() => BinaryHeap.buildFromArray(arr))
            changeArrayString('')
        }
    }
    function sortArray() {
        if(arrayString.length) {
            const arr = arrayString.split(',').map(v => Number(v.trim()))

            changeArrayString(BinaryHeap.sort(arr).join(', '))
        }
    }

    let visualProgram!: ReactComponentElement<'div'>
    switch (currentTask) {
        case TaskName.Queue: {
            break
        }
        case TaskName.Heap: {
            visualProgram = (
                <div className={style.heap}>
                    <form onSubmit={event => event.preventDefault()}>
                        <label>
                            1) Введите числа через запяту:
                            <input type={'text'} value={arrayString} onChange={e => changeArrayString(e.target.value)}/>
                            <button onClick={heapFromArray}>
                                Построить кучу
                            </button>
                            <button onClick={sortArray}>
                                Сортировать
                            </button>
                        </label>
                        <label>
                            2) Добавить елемент:
                            <input type={'text'} value={heapNewElement ?? ''} onChange={e => changeHeapNewElement(+e.target.value)}/>
                            <button onClick={addToHeap}>
                                Добавить
                            </button>
                        </label>
                    </form>
                    <div className={style.heapList}>
                        {
                            heap.size() && heap.drawFirst((node, list) => {
                                return (
                                    <HeapNodeComponent
                                        key={node.priority}
                                        node={node}
                                        list={list}
                                        depth={0}
                                        type={'center'}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            )

            break
        }
        case TaskName.Sorting: {
            break
        }
    }

    return (
        <div className={style.lab1}>
            <span className={style.label}>
                Лабораторная #1
            </span>
            <div className={style.tasks}>
                {
                    Object.values(TaskName).map((taskName, index) => {
                        const active = currentTask === taskName ? style.activeTaskItem : ''

                        return (
                            <div
                                className={style.taskItem + ' ' + active}
                                key={taskName}
                                onClick={() => changeTask(taskName)}
                            >
                                {taskName}
                            </div>
                        )
                    })
                }
            </div>
            <div className={style.program}>
                {visualProgram}
            </div>
        </div>
    )
}

type THeapNodes = {
    list: BinaryHeap<number>['list'],
    node: HeapNode<number>
    depth: number
    type: 'left' | 'right' | 'center'
}
function HeapNodeComponent(props: THeapNodes) {
    const { node, list, depth, type } = props;

    const leftChild = node.getChildren(list, 'left')
    const rightChild = node.getChildren(list, 'right')

    const offset = 300
    const CSSStyle: CSSProperties = {}

    switch (type) {
        case "center": {
            CSSStyle.top = `${offset}px`
            break;
        }
        case "left": {
            CSSStyle.top = `${40/(depth / 2)}px`
            CSSStyle.left = `${-70 / (depth / 2)}px`
            break;
        }
        case "right": {
            CSSStyle.top = `${40/(depth / 2)}px`
            CSSStyle.right = `${-70 / (depth / 2)}px`
            break;
        }
    }

    return (
        <div className={style.heapListItem} style={CSSStyle}>
            <div>{node.priority}</div>
            {
                (leftChild || rightChild) &&
                <div className={style.children}>
                    {leftChild && (
                        <HeapNodeComponent
                            list={list}
                            node={leftChild}
                            depth={depth + 1}
                            type={'left'}
                        />
                    )}
                    {rightChild && (
                        <HeapNodeComponent
                            list={list}
                            node={rightChild}
                            depth={depth + 1}
                            type={'right'}
                        />
                    )}
                </div>
            }
        </div>
    )
}