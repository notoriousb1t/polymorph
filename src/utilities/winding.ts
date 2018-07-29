export function winding(arr: Float32Array): number { 
    let sum = 0
    let x1 = arr[0], y1 = arr[1];
    for (let i = 2; i < arr.length; i += 6) { 
       sum += (-x1 + (x1 = arr[i + 4])) * (y1 + (y1 = arr[i + 5]));
    } 
    return +(sum > 0) - +(sum < 0);
 }
