import { useRef } from "react"

export const useTickLoop = (callback: Function, interval: number) => {
    let last = useRef<number>()
    let request = useRef<number>()

    const frameLoop: FrameRequestCallback = timestamp => {
        request.current = requestAnimationFrame(frameLoop)
        let elapsed = timestamp - last.current!;
        if(elapsed > interval) {
            callback()
            last.current = timestamp - (elapsed % interval)
        }
    }
    
    return {
        start: () => {
            request.current = requestAnimationFrame(t => {
                last.current = t
                frameLoop(t)
            })
        },
        stop: () => {
            cancelAnimationFrame(request.current!)
        }
    }
}