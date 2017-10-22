import { IPathElement } from './types'
import { renderPath } from './operators/render-path'
import { parsePoints } from './operators/parse-path'
import { getPath } from './get-path'
import { reversePath } from './operators/reverse-path'

export function reverse(path: string | IPathElement): string {
    return renderPath(
        // get and parse path
        parsePoints(getPath(path))
            // reverse subpath
            .map(reversePath)
            // reverse array of subpath
            .reverse()
    )
}
