import { renderPath } from './operators/renderPath'
import { parsePoints } from './operators/parsePoints'
import { reversePath } from './operators/reversePath'
import { IPathElement } from './types'
import { getPath } from './getPath'

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
