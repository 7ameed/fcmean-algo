var fcMean = function () {

    /**
     * helper method to calculate the euclidian distance
     * @param {Array} vec1 
     * @param {Array} vec2 
     */
    function euclidianDistance(vec1, vec2) {
        var N = vec1.length;
        var d = 0;
        for (var i = 0; i < N; i++)
            d += Math.pow(vec1[i] - vec2[i], 2)
        d = Math.sqrt(d);
        return d;
    }

    /**
     * 
     * @param {Array} vec1
     * @param {Array} vec2
     */
    function addVectors(vec1, vec2) {
        var N = vec1.length;
        var vec = new Array(N);
        for (var i = 0; i < N; i++)
            vec[i] = vec1[i] + vec2[i];
        return vec;
    }

    function multiplyVectorByValue(value, vec) {
        var N = vec.length;
        var v = new Array(N);
        for (var i = 0; i < N; i++)
            v[i] = value * vec[i];
        return v;
    }

    /**
     * helper method used to generate random vector
     * based on the number of clusters `k` and the dataset `vectors`
     * @param {Number} k 
     * @param {Array<Array>} vectors 
     */
    function getRandomVectors(k, vectors) {
		/*  Returns a array of k distinct vectors randomly selected from a the input array of vectors
			Returns null if k > n or if there are less than k distinct objects in vectors */

        var n = vectors.length;
        if (k > n)
            return null;

        var selected_vectors = new Array(k);
        var selected_indices = new Array(k);

        var tested_indices = new Object;
        var tested = 0;
        var selected = 0;
        var i, vector, select;
        while (selected < k) {
            if (tested == n)
                return null;

            var random_index = Math.floor(Math.random() * (n));
            if (random_index in tested_indices)
                continue;

            tested_indices[random_index] = 1;
            tested++;
            vector = vectors[random_index];
            select = true;
            for (i = 0; i < selected; i++) {
                if (vector.compare(selected_vectors[i])) {
                    select = false;
                    break;
                }
            }
            if (select) {
                selected_vectors[selected] = vector;
                selected_indices[selected] = random_index;
                selected++;
            }
        }
        return { 'vectors': selected_vectors, 'indices': selected_indices };
    }

    /**
     * the fuzzy c-mean clustering algorism
     * @param {Number} k
     * @param {Array<Array>} vectors
     * @param {Number} threshold 
     * @param {Number} fuzziness defults to `2`
     * @param {Number} fc_means_max_itterations defaults to `100`
     */
    function fcmeans(k, vectors, threshold, fuzziness = 2, fc_means_max_itterations = 100) {
        var membershipMatrix = new Matrix(vectors.length, k);
        var repeat = true;
        var numberOfItrs = 0;

        var centroids = null;

        var i, j, l, tmp, norm, max, diff;
        while (repeat) {
            // initialize or update centroids
            if (centroids == null) {
                tmp = getRandomVectors(k, vectors);
                if (tmp == null)
                    return null;
                else
                    centroids = tmp.vectors;

            } else {
                for (j = 0; j < k; j++) {
                    centroids[j] = [];
                    norm = 0;
                    for (i = 0; i < membershipMatrix.rows; i++) {
                        norm += Math.pow(membershipMatrix.mtx[i][j], fuzziness);
                        tmp = multiplyVectorByValue(Math.pow(membershipMatrix.mtx[i][j], fuzziness), vectors[i]);

                        if (i == 0)
                            centroids[j] = tmp;
                        else
                            centroids[j] = addVectors(centroids[j], tmp);
                    }
                    if (norm > 0)
                        centroids[j] = multiplyVectorByValue(1 / norm, centroids[j]);


                }

            }

            // update the degree of membership of each vector
            previousMembershipMatrix = membershipMatrix.copy();
            for (i = 0; i < membershipMatrix.rows; i++) {
                for (j = 0; j < k; j++) {
                    membershipMatrix.mtx[i][j] = 0;
                    for (l = 0; l < k; l++) {
                        if (euclidianDistance(vectors[i], centroids[l]) == 0)
                            tmp = 0;
                        else
                            tmp = euclidianDistance(vectors[i], centroids[j]) / euclidianDistance(vectors[i], centroids[l]);
                        tmp = Math.pow(tmp, 2 / (fuzziness - 1));
                        membershipMatrix.mtx[i][j] += tmp;
                    }
                    if (membershipMatrix.mtx[i][j] > 0)
                        membershipMatrix.mtx[i][j] = 1 / membershipMatrix.mtx[i][j];
                }
            }

            // check convergence
            max = -1;
            diff;
            for (i = 0; i < membershipMatrix.rows; i++)
                for (j = 0; j < membershipMatrix.cols; j++) {
                    diff = Math.abs(membershipMatrix.mtx[i][j] - previousMembershipMatrix.mtx[i][j]);
                    if (diff > max)
                        max = diff;
                }

            // diffrence is less than
            if (max < threshold)
                repeat = false;

            numberOfItrs++;

            // check nb of iters
            if (numberOfItrs > fc_means_max_itterations)
                repeat = false;
        }
        return { centroids, membershipMatrix, numberOfItrs: numberOfItrs - 1, diff: max };

    }

    // Matrix class
    function Matrix(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.mtx = new Array(rows);
        this.toString = function () {
            var lines = [];
            for (var i = 0; i < this.rows; i++)
                lines.push(this.mtx[i].join("\t"));
            return lines.join("\n");
        }
        this.copy = function () {
            var duplicate = new fcMean.Matrix(this.rows, this.cols);
            for (var i = 0; i < this.rows; i++)
                duplicate.mtx[i] = this.mtx[i].slice(0);
            return duplicate;
        }

        for (var i = 0; i < rows; i++) {
            var row = new Array(cols);
            for (var j = 0; j < cols; j++)
                row[j] = 0;
            this.mtx[i] = row;
        }
    }

    return {
        Matrix: Matrix,
        start: fcmeans
    }
}();

//
Array.prototype.compare = function (testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) {
            if (!this[i].compare(testArr[i])) return false;
        }
        if (this[i] !== testArr[i]) return false;
    }
    return true;
}

// run
var k = 2; // number of clusters
var vectors = [[1, 3], [1.5, 3.2], [1.3, 2.8], [3, 1]]; // dataset
var threshold = 0.0000000000005;

// optional paramters
// var fuzziness= 2
// var maxItterations= 100
var result = fcMean.start(
    k,
    vectors,
    threshold,
    //fuzziness,
    //maxItterations
);

// for logging purpose
console.log(JSON.stringify(result, null, 2));