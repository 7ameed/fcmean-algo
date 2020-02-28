# Fuzzy C-Means Clustering 

**this is the implementation of fuzzy c-mean clustring algorism usng node.js**

## how to run

### using node.js
if you are familiar with node.js and have it installed on your machine
- just change the directory using the terminal or the command prompt to the `fcMean.js` file directory
- run the following command
  
  ```bash
    node fcMean.js
  ```
the out put will appear on shell

### using the browser
you can run the algorith using the browser by simply

- open the the browser console by typing `Ctrl+Shift+j`
- copy paste the content of the `fcMean.js` file on the console
- the output will appear in the console

------------------
**Question**

let the initial centroids c = [0.01, 2.4, 3.2]

let the dataset x = [[1, 2], [3, 4]]

calculate 2 itterations

answer :
at first itteration we have the following
```js
let x= [
//x1, x2
  [1, 2], 
//x3, x4  
  [3, 4]
]
//      c1,  c2,   c3
let c= [0.01, 2.4, 3.2]

let mue= [
// x1,x2,x3,x4
  [1, 0, 0, 0], // c1
  [0, 1, 0, 0], // c2
  [0, 0, 1, 1]  // c3
]

let m= 2
//       mue1*x1 + mue2*x2 + mue3*x3 + mue4*x4
// c1 = ---------------------------------------
//            mue1 + mue2 + mue3 + mue4
let c1= (1*1) + 0 + 0 + 0/1+0+0+0 = 1/1 = 1

// similarly
let c2= 0 + (1*2) + 0 + 0/0+1+0+0 = 2/1 = 2
let c3= 0 + 0 + (1*3) + (1*4)/0+0+1+1 = 7/2 = 3.5

```
| d   | c1(1) | c2(2) | c3(3.5) |
| --- | ----- | ----- | ------- |
| 1   | 0     | 1     | 2.5     | c1 |
| 2   | 1     | 0     | 1.5     | c2 |
| 3   | 2     | 1     | 0.5     | c3 |
| 4   | 3     | 2     | 0.5     | c3 |

calculating new mue:
```js
//              (d1-c1)^2     (d1-c1)^2     (d1-c1)^2
// newMuew11 =( --------- +   --------- +   --------- )^-1
//              (d1-c1)^2     (d1-c2)^2     (d1-c3)^2
let newMue11 = ( (1/1)     +    (1/4)    +  (1/12.25) )^-1 = 0.75
// similarly
//              (d1-c2)^2     (d1-c2)^2     (d1-c2)^2
// newMuew12 =( ---------  +  ---------  +  --------- )^-1
//              (d1-c1)^2     (d1-c2)^2     (d1-c3)^2
let newMue12 = (  (4/1)    +    (4/4)    +  (4/12.25) )^-1 = 0.18
//              (d1-c3)^2     (d1-c3)^2     (d1-c3)^2
// newMuew13 =( ---------  +  ---------  +  --------- )^-1
//              (d1-c1)^2     (d1-c2)^2     (d1-c3)^2
let newMue13 = ((12.25/1)  +  (12.25/4)  +  (12.25/12.25))^-1 = 0.03


//              (d2-c1)^2     (d2-c1)^2     (d2-c1)^2
// newMuew21 =( ---------  +  ---------  +  --------- )^-1
//              (d2-c1)^2     (d2-c2)^2     (d2-c3)^2
let newMue21 =  ((1/1)     +   (1/4)     +  (1/12.25))^-1  = 0.75
//              (d2-c2)^2     (d2-c2)^2     (d2-c2)^2
// newMuew22 =( ---------  +  ---------  +  --------- )^-1
//              (d2-c1)^2     (d2-c2)^2     (d2-c3)^2
let newMue22 =   ((4/1)    +   (4/4)     +  (4/12.25))^-1  = 0.18
//              (d2-c3)^2     (d2-c3)^2      (d2-c3)^2
// newMuew23 =( ---------  +  ---------  +  --------- )^-1
//              (d2-c1)^2     (d2-c2)^2      (d2-c3)^2
let newMue23 = ((12.25/1)  +  (12.25/4)  +  (12.25/12.25))^-1 = 0.03


//              (d3-c1)^2     (d3-c1)^2      (d3-c1)^2
// newMuew31 =( ---------   + ---------   +  --------- )^-1
//              (d3-c1)^2     (d3-c2)^2      (d3-c3)^2
let newMue31 = ((0.25/0.25) + (0.25/2.25) + (0.25/9))^-1  = 0.88
//              (d3-c2)^2      (d3-c2)^2     (d3-c2)^2
// newMuew32 =( ---------   +  ---------  +  --------- )^-1
//              (d3-c1)^2      (d3-c2)^2     (d3-c3)^2
let newMue32 = ((2.25/0.25) + (2.25/2.25) +  (2.5/9))^-1  = 0.09
//              (d3-c3)^2      (d3-c3)^2     (d3-c3)^2
// newMuew33 =( ---------   +  ---------  +  ---------)^1
//              (d3-c1)^2      (d3-c2)^2     (d3-c3)^2
let newMue33 = ((9/0.25)    +  (9/2.25)   +  (9/9))^-1 = 0.02


//              (d4-c1)^2     (d4-c1)^2      (d4-c1)^2
// newMuew41 =( ---------   + ---------   +  --------- )^-1
//              (d4-c1)^2     (d4-c2)^2      (d4-c3)^2
let newMue41 = ((0.25/0.25) + (0.25/2.25) + (0.25/9))^-1  = 0.88
//              (d4-c2)^2      (d4-c2)^2     (d4-c2)^2
// newMuew42 =( ---------   +  ---------  +  --------- )^-1
//              (d4-c1)^2      (d4-c2)^2     (d4-c3)^2
let newMue42 = ((2.25/0.25) + (2.25/2.25) +  (2.5/9))^-1  = 0.09
//              (d4-c3)^2      (d4-c3)^2    (d4-c3)^2
// newMuew43 =( ---------   +  ---------  + ---------)^1
//              (d4-c1)^2      (d4-c2)^2    (d4-c3)^2
let newMue43 = ((9/0.25)    +  (9/2.25)   +  (9/9))^-1 = 0.02

```
then we start the second itteration with the following data

```js
let x= [
//x1, x2
  [1, 2], 
//x3, x4  
  [3, 4]
]
//      c1,  c2,   c3
let c= [1, 2, 3.5]

let mue= [
//  x1,  x2, x3, x4
  [0.75, 0.75, 0.88, 0.88], // c1
  [0.18, 0.18, 0.09, 0.09], // c2
  [0.03, 0.03, 0.02, 0.02]  // c3
]

let m= 2
```

thanks :)

**Abdelhameed Muhammed**
