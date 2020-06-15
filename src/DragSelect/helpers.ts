import { useEffect, useRef } from 'react'

// eventToCellLocation(event)
// {row: 2, column: 3} ^-^
export const eventToCellLocation = (e: TouchEvent) => {
  let target
  if (e.touches) {
    const touch = e.touches[0]
    target = document.elementFromPoint(touch.clientX, touch.clientY)
  } else {
    target = e.target
    while (target.tagName !== 'TD') {
      target = target.parentNode as any
    }
  }
  return {
    row: target.parentNode.rowIndex,
    column: target.cellIndex
  }
}


/**
 * 给元素添加事件监听并在卸载时清除监听
 */

export const useEventListener = (
  eventName: string,
  handler: Function,
  element: EventTarget = window,
  option: any = false
) => {
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    const eventListener = (event: Event) => savedHandler.current(event)

    element.addEventListener(eventName, eventListener, option)

    return () => {
      element.removeEventListener(eventName, eventListener, option)
    }
  }, [eventName, element, option])
}