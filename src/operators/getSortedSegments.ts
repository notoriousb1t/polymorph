import { FloatArray } from '../types';
import { perimeterPoints } from './perimeterPoints';

interface ISortContext {
    points: FloatArray;
    perimeter: number;
}

export function getSortedSegments(pathSegments: FloatArray[]): FloatArray[] {
    return pathSegments
        .map((points: FloatArray) => ({ 
            points, 
            perimeter: perimeterPoints(points) 
        }))
        .sort((a: ISortContext, b: ISortContext) => b.perimeter - a.perimeter)
        .map((a: ISortContext) => a.points);
}
