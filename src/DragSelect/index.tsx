import React, { useState, MouseEvent, useRef, FC } from 'react'
import clone from 'clone'
import { eventToCellLocation, useEventListener } from './helpers'

interface DragSelectProps {
  value: boolean[][]
  onChange: (val: boolean[][]) => void
}

const DragSelect: FC<DragSelectProps> = props => {
  const [selectionStarted, setSelectionStarted] = useState(false)
  const [startRow, setStartRow] = useState(0)
  const [startColumn, setStartColumn] = useState(0)
  const [endRow, setEndRow] = useState(0)
  const [endColumn, setEndColumn] = useState(0)
  const [addMode, setAddMode] = useState(false)
  const { value, onChange } = props

  // events
  const handleTouchEndWindow = (e: MouseEvent<HTMLElement>) => {
    const isLeftClick = e.button === 0
    const isTouch = e.type !== 'mousedown'
    if (selectionStarted && (isLeftClick || isTouch)) {
      const target = clone(value)
      const minRow = Math.min(startRow, endRow)
      const maxRow = Math.max(startRow, endRow)
      for (let row = minRow; row <= maxRow; row++) {
        const minColumn = Math.min(startColumn, endColumn)
        const maxColumn = Math.max(startColumn, endColumn)
        for (let column = minColumn; column <= maxColumn; column++) {
          target[row][column] = addMode
        }
      }
      setSelectionStarted(false)
      onChange(target)
    }
  }

  const handleTouchStartCell = (e: MouseEvent<HTMLElement>) => {
    const isLeftClick = e.button === 0
    const isTouch = e.type !== 'mousedown'
    if (!selectionStarted && (isLeftClick || isTouch)) {
      e.preventDefault()
      const { row, column } = eventToCellLocation(e)
      setSelectionStarted(true)
      setStartRow(row)
      setStartColumn(column)
      setEndRow(row)
      setEndColumn(column)
      setAddMode(!value[row][column])
    }
  }

  const handleTouchMoveCell = (e: any) => {
    if (selectionStarted) {
      e.preventDefault()
      const { row, column } = eventToCellLocation(e)
      if (endRow !== row || endColumn !== column) {
        setEndRow(row)
        setEndColumn(column)
      }
    }
  }

  const isCellBeingSelected = (row: number, column: number) => {
    const minRow = Math.min(startRow, endRow)
    const maxRow = Math.max(startRow, endRow)
    const minColumn = Math.min(startColumn, endColumn)
    const maxColumn = Math.max(startColumn, endColumn)
    return selectionStarted && row >= minRow && row <= maxRow && column >= minColumn && column <= maxColumn
  }

  // use-hooks
  useEventListener('mouseup', handleTouchEndWindow)
  useEventListener('touchend', handleTouchEndWindow)

  const renderRows = () =>
    React.Children.map(props.children, (tr: any, i) => {
      return (
        <tr key={i} {...tr.props}>
          {React.Children.map(tr.props.children, (cell, j) => (
            <Cell
              key={`${j}_CELL`}
              onTouchStart={handleTouchStartCell}
              onTouchMove={handleTouchMoveCell}
              selected={props.value[i][j]}
              {...cell.props}
              selecting={isCellBeingSelected(i, j) ? 1 : 0}
            >
              {cell.props.children}
            </Cell>
          ))}
        </tr>
      )
    })

  return (
    <table className='table-drag-select'>
      <tbody>{renderRows()}</tbody>
    </table>
  )
}

// Cell Components
const Cell = (props: any) => {
  const tdRef = useRef()
  let { className = '', disabled, selecting, selected, onTouchStart, onTouchMove } = props
  if (disabled) {
    className += ' cell-disabled'
  } else {
    className += ' cell-enabled'
    if (selected) {
      className += ' cell-selected'
    }
    if (selecting) {
      className += ' cell-being-selected'
    }
  }

  const handleTouchStart = (e: MouseEvent<HTMLElement>) => {
    if (!disabled) {
      onTouchStart(e)
    }
  }

  const handleTouchMove = (e: MouseEvent<HTMLElement>) => {
    if (!disabled) {
      onTouchMove(e)
    }
  }

  // use-hooks
  useEventListener('touchstart', handleTouchStart, tdRef.current, {
    passive: false
  })
  useEventListener('touchend', handleTouchMove, tdRef.current, {
    passive: false
  })
  return (
    <td ref={tdRef} className={className} onMouseDown={handleTouchStart} onMouseMove={handleTouchMove} {...props}>
      {props.children || <span>&nbsp;</span>}
    </td>
  )
}

export default DragSelect
