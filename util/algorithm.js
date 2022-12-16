// FCFS & DP
const fcfs = (W_equal, W_plus, alpha, beta, _a, _b) => {
    const Lane = {
        Out: -1,
        A: 0,
        B: 1,
    };
    let a = [..._a, Infinity]; // manually pad Infinity at the end
    let b = [..._b, Infinity];

    let a_index = 0
    let b_index = 0

    const entering_time = {};
    entering_time[Lane.A] = [];
    entering_time[Lane.B] = [];

    let prev_entering_time = 0
    let prev_lane = Lane.Out

    while (a[a_index] !== Infinity || b[b_index] !== Infinity) {
        let a_now = a[a_index]
        let b_now = b[b_index]

        let selected_lane
        if (a_now === Infinity) {
            selected_lane = Lane.B
        } else if (b_now === Infinity) {
            selected_lane = Lane.A
        } else {
            selected_lane = (a_now <= b_now) ? Lane.A : Lane.B
        }
        let possible_entering_time = prev_entering_time + ((prev_lane === selected_lane || prev_lane === Lane.Out) ? W_equal : W_plus)
        // console.log("selected lane is:" + selected_lane.toString())
        // console.log("possible entering time is:" + possible_entering_time.toString())
        prev_entering_time = Math.max(((selected_lane === Lane.A) ? a_now : b_now), possible_entering_time)
        entering_time[selected_lane].push(prev_entering_time)
        if (selected_lane === Lane.A) {
            a_index++
            prev_lane = Lane.A
        } else {
            b_index++
            prev_lane = Lane.B
        }
    }

    return { entering_time, Lane };
}

const fcfs_multiple = (W_equal, W_plus, _carLines, laneNum) => {
    const Lane = {
        Out: -1,
    };

    let carLines = _carLines.map((line) => [...line, Infinity])
    console.log(_carLines)
    let index = Array.from({ length: laneNum }, () => 0)
    // console.log(index)

    const entering_time = {};
    for (let i = 0; i < laneNum; i++) {
        entering_time[i] = []
    }

    let prev_entering_time = 0
    let prev_lane = Lane.Out

    const checkCompleted = () => {
        for (let i = 0; i < laneNum; i++) {
            if (carLines[i][index[i]] !== Infinity) {
                return true
            }
        }
        return false
    }

    while (checkCompleted()) {

        let selected_lane = 0
        for (let i = 0; i < laneNum; i++) {
            if (carLines[i][index[i]] < carLines[selected_lane][index[selected_lane]]) {
                selected_lane = i
            }
        }
        let possible_entering_time = prev_entering_time + ((prev_lane === selected_lane || prev_lane === Lane.Out) ? W_equal : W_plus)
        prev_entering_time = Math.max(carLines[selected_lane][index[selected_lane]], possible_entering_time)
        entering_time[selected_lane].push(prev_entering_time)
        index[selected_lane]++
        prev_lane = selected_lane
    }

    return { entering_time, Lane };

}

const dp2 = (
    W_equal1,
    W_plus1,
    W_equal2,
    W_plus2,
    T_f,
    alpha,
    beta,
    gamma,
    _a,
    _b,
    _c
) => {
    const Lane = {
        Out: -1,
        A: 0,
        B: 1,
        Ca: 2,
        Cb: 3,
        AB: 4,
        C: 5,
        toList: () => [Lane.A, Lane.B, Lane.Ca, Lane.Cb],
        toMP1: (lane) => lane % 2,
        toMP2: (lane) => Math.floor(lane / 2) + 4,
    };

    // values in arr must follow the order of Lane
    const findmin = (arr) => {
        if (arr.length === 0) throw "array length equals to zero";
        let min = arr[0];
        let minIndex = 0;

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                minIndex = i;
                min = arr[i];
            }
        }
        return [min, minIndex];
    };

    let a = [0, ..._a];
    let b = [0, ..._b];
    let c = [0, ..._c];

    // {alpha+1}x{beta+1}x{2}
    let time1 = Array.from({ length: alpha + 1 }, () =>
        Array.from({ length: beta + 1 }, () => [Infinity, Infinity])
    );
    // {alpha+1}x{beta+1}x{gamma+1}x{4}
    let time2 = Array.from({ length: alpha + 1 }, () =>
        Array.from({ length: beta + 1 }, () =>
            Array.from({ length: gamma + 1 }, () =>
                Array.from({ length: 4 }, () => Infinity)
            )
        )
    );
    // {alpha+1}x{beta+1}x{2}
    let backtrack1 = Array.from({ length: alpha + 1 }, () =>
        Array.from({ length: beta + 1 }, () => [Lane.Out, Lane.Out])
    );
    // {alpha+1}x{beta+1}x{gamma+1}x{4}
    let backtrack2 = Array.from({ length: alpha + 1 }, () =>
        Array.from({ length: beta + 1 }, () =>
            Array.from({ length: gamma + 1 }, () =>
                Array.from({ length: 4 }, () => Lane.Out)
            )
        )
    );
    const print = (time2) => {
        for (let i = 0; i <= alpha; i++) {
            for (let j = 0; j <= beta; j++) {
                for (let k = 0; k <= gamma; k++) {
                    console.log(i, j, k, time2[i][j][k]);
                }
            }
        }
    };

    time1[0][0][Lane.A] = time1[0][0][Lane.B] = 0;
    time1[1][0][Lane.A] = a[1];
    time1[0][1][Lane.B] = b[1];
    backtrack1[0][0][Lane.A] = backtrack1[0][0][Lane.B] = Lane.Out;
    backtrack1[1][0][Lane.A] = backtrack1[0][1][Lane.B] = Lane.Out;

    for (let i = 2; i <= alpha; i++) {
        time1[i][0][Lane.A] = Math.max(
            a[i],
            time1[i - 1][0][Lane.A] + W_equal1
        );
        backtrack1[i][0][Lane.A] = Lane.A;
    }
    for (let j = 2; j <= beta; j++) {
        time1[0][j][Lane.B] = Math.max(
            b[j],
            time1[0][j - 1][Lane.B] + W_equal1
        );
        backtrack1[0][j][Lane.B] = Lane.B;
    }
    for (let i = 1; i <= alpha; i++) {
        for (let j = 1; j <= beta; j++) {
            let AA = Math.max(a[i], time1[i - 1][j][Lane.A] + W_equal1);
            let AB = Math.max(a[i], time1[i - 1][j][Lane.B] + W_plus1);
            let BA = Math.max(b[i], time1[i][j - 1][Lane.A] + W_plus1);
            let BB = Math.max(b[i], time1[i][j - 1][Lane.B] + W_equal1);
            time1[i][j][Lane.A] = Math.min(AA, AB);
            backtrack1[i][j][Lane.A] =
                time1[i][j][Lane.A] == AA ? Lane.A : Lane.B;
            time1[i][j][Lane.B] = Math.min(BA, BB);
            backtrack1[i][j][Lane.B] =
                time1[i][j][Lane.B] == BA ? Lane.A : Lane.B;
        }
    }
    const entering_time1 = {};
    entering_time1[Lane.A] = [];
    entering_time1[Lane.B] = [];
    let lane =
        time1[alpha][beta][Lane.A] < time1[alpha][beta][Lane.B]
            ? Lane.A
            : Lane.B;
    let i = alpha,
        j = beta;
    let last_lane;
    while (lane != Lane.Out) {
        last_lane = lane;
        entering_time1[lane].push(time1[i][j][lane]);
        lane = backtrack1[i][j][lane];
        if (last_lane === Lane.A) i--;
        else j--;
    }
    entering_time1[Lane.A].reverse();
    entering_time1[Lane.B].reverse();

    for (let i = 1; i <= alpha; i++)
        for (let j = 1; j <= beta; j++) console.log(i, j, backtrack1[i][j]);

    for (let i = 0; i <= alpha; i++) {
        for (let j = 0; j <= beta; j++) {
            for (let k = 0; k <= gamma; k++) {
                if (i + j + k === 0) {
                    Lane.toList().map((lane) => {
                        time2[i][j][k][lane] = 0;
                        backtrack2[i][j][k][lane] = Lane.Out;
                    });
                    continue;
                }
                if (i > 0) {
                    // AA, AB, ACa, ACb
                    const ALanes = Lane.toList().map((lane) => {
                        // lane: the lane where the last vehicle comes from
                        let mp1Lane = Lane.toMP1(lane);
                        let mp2Lane = Lane.toMP2(lane);
                        let W_1 = mp1Lane === Lane.A ? W_equal1 : W_plus1;
                        let W_2 =
                            mp2Lane === Lane.toMP2(Lane.A) ? W_equal2 : W_plus2;
                        return Math.max(
                            Math.max(a[i], time1[i - 1][j][mp1Lane] + W_1) +
                            T_f,
                            time2[i - 1][j][k][lane] + W_2
                        );
                    });
                    [time2[i][j][k][Lane.A], backtrack2[i][j][k][Lane.A]] =
                        findmin(ALanes);
                    if (i == 1 && !j && !k)
                        backtrack2[i][j][k][Lane.A] = Lane.Out;
                }
                if (j > 0) {
                    // BA, BB, BCa, BCb
                    const BLanes = Lane.toList().map((lane) => {
                        let mp1Lane = Lane.toMP1(lane);
                        let mp2Lane = Lane.toMP2(lane);
                        let W_1 = mp1Lane === Lane.B ? W_equal1 : W_plus1;
                        let W_2 =
                            mp2Lane === Lane.toMP2(Lane.B) ? W_equal2 : W_plus2;
                        return Math.max(
                            Math.max(b[i], time1[i][j - 1][mp1Lane] + W_1) +
                            T_f,
                            time2[i][j - 1][k][lane] + W_2
                        );
                    });
                    [time2[i][j][k][Lane.B], backtrack2[i][j][k][Lane.B]] =
                        findmin(BLanes);
                    if (j == 1 && !i && !k)
                        backtrack2[i][j][k][Lane.B] = Lane.Out;
                }
                if (k > 0) {
                    // Ca
                    let CaA = Math.max(
                        c[k],
                        time2[i][j][k - 1][Lane.A] + W_plus2
                    );
                    let CaCa = Math.max(
                        c[k],
                        time2[i][j][k - 1][Lane.Ca] + W_equal2
                    );
                    time2[i][j][k][Lane.Ca] = Math.min(CaA, CaCa);
                    backtrack2[i][j][k][Lane.Ca] =
                        CaA < CaCa ? Lane.A : Lane.Ca;
                    // Cb
                    let CbB = Math.max(
                        c[k],
                        time2[i][j][k - 1][Lane.B] + W_plus2
                    );
                    let CbCb = Math.max(
                        c[k],
                        time2[i][j][k - 1][Lane.Cb] + W_equal2
                    );
                    time2[i][j][k][Lane.Cb] = Math.min(CbB, CbCb);
                    backtrack2[i][j][k][Lane.Cb] =
                        CbB < CbCb ? Lane.B : Lane.Cb;
                    if (k == 1 && !i && !j) {
                        [Lane.Ca, Lane.Cb].forEach(
                            (cc) => (backtrack2[i][j][k][cc] = Lane.Out)
                        );
                    }
                }
            }
        }
    }

    const entering_time2 = {};
    Lane.toList().forEach((lane) => {
        entering_time2[lane] = [];
    });
    lane = findmin(time2[alpha][beta][gamma])[1]; // findmin return min, minIndex
    i = alpha
    j = beta
    let k = gamma
    while (lane != Lane.Out) {
        last_lane = lane;
        entering_time2[lane].push(time2[i][j][k][lane]);
        lane = backtrack2[i][j][k][lane];
        if (last_lane === Lane.A) i--;
        else if (last_lane === Lane.B) j--;
        else k--;
    }
    Lane.toList().map((lane) => entering_time2[lane].reverse());
    entering_time2[Lane.Ca] = [
        ...entering_time2[Lane.Ca],
        ...entering_time2[Lane.Cb],
    ].sort();
    entering_time2[Lane.Cb] = [];
    return { entering_time1, entering_time2, Lane };
    // print(backtrack2);
    // return scheduled entering time to the first and second merge points
};

const dp_multiple = (W_equal, W_plus, carLines, laneNum) => {
    const Lane = { Out: -1 };
    let padLines = carLines.map((line) => [0, ...line]);
    let carCounts = carLines.map((line) => line.length);

    const Iter = function (carCounts) {
        this.carCounts = carCounts;
        this.indices = this.carCounts.map(() => 0);
        this.isEnd = false;
        this.next = () => {
            let i = this.indices.length - 1;
            this.indices[i]++;
            while (this.indices[i] > this.carCounts[i] && i >= 0) {
                this.indices[i] = 0;
                i--;
                i >= 0 && this.indices[i]++;
            }
            if (i < 0) this.isEnd = true;
        };
        this.get = () => JSON.parse(JSON.stringify(this.indices));
        this.end = () => this.isEnd;
    };

    // array access by array
    // sizes: for example 5x5x4x3 array -> sizes: [5, 5, 4, 3]
    const AArray = function (sizes, value) {
        this.arr = value ? value : 0;
        for (let i = sizes.length - 1; i >= 0; i--) {
            this.arr = Array.from({ length: sizes[i] }, () =>
                structuredClone(this.arr)
            );
        }
        this.get = (indices) => {
            // return by reference
            let ret = this.arr;
            indices.forEach((ind) => {
                ret = ret[ind];
            });
            return ret;
        };
    };

    const findmin = (arr) => {
        if (arr.length === 0) throw "array length equals to zero";
        let min = arr[0];
        let minIndex = 0;

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                minIndex = i;
                min = arr[i];
            }
        }
        return [min, minIndex];
    };

    const laneList = (laneNum) => {
        return [...Array(laneNum)].map((_, lane) => lane);
    };

    let time = new AArray(
        [...carCounts.map((count) => count + 1), laneNum],
        Infinity
    );

    let backtrack = new AArray(
        [...carCounts.map((count) => count + 1), laneNum],
        Lane.Out
    );

    for (let iter = new Iter(carCounts); !iter.end(); iter.next()) {
        let indices = iter.get();
        if (indices.every((ind) => ind === 0)) {
            [...Array(laneNum)].forEach((_, lane) => {
                time.get(indices)[lane] = 0;
                backtrack.get(indices)[lane] = Lane.Out;
            });
            continue;
        }
        // time comes from each lane
        indices.forEach((ind, thisLane) => {
            if (ind == 0) return;
            const newIndices = JSON.parse(JSON.stringify(indices));
            newIndices[thisLane]--;
            const laneTimes = [...Array(laneNum)].map((_, prevLane) => {
                const W = prevLane === thisLane ? W_equal : W_plus;
                // in dp2: AA => max(a[i], time1[i-1][j][Lane.A])
                return Math.max(
                    padLines[thisLane][ind],
                    time.get(newIndices)[prevLane] + W
                );
            });
            const [min, minIndex] = findmin(laneTimes);
            // time.get(indices)[thisLane] = Math.min(...laneTimes);
            time.get(indices)[thisLane] = min;
            backtrack.get(indices)[thisLane] = minIndex;
            // sum of all indices == 1 -> other indices are 0 and this index is 1
            if (indices.reduce((prev, curr) => prev + curr) == 1)
                backtrack.get(indices)[thisLane] = Lane.Out;
        });
    }
    const entering_time = {};
    laneList(laneNum).forEach((lane) => {
        entering_time[lane] = [];
    });
    let lane = findmin(time.get(carCounts))[1];
    let indices = structuredClone(carCounts);
    let last_lane;
    while (lane != Lane.Out) {
        last_lane = lane;
        entering_time[lane].push(time.get(indices)[lane]);
        lane = backtrack.get(indices)[lane];
        indices[last_lane]--;
    }
    laneList(laneNum).forEach((lane) => entering_time[lane].reverse());
    // console.log(entering_time);
    return { entering_time };
};

// return entering time for both a_i and b_j
const dp = (W_equal, W_plus, alpha, beta, _a, _b) => {
    const Lane = {
        Out: -1,
        A: 0,
        B: 1,
    };
    let a = [0, ..._a]; // manually pad at index 0 here
    let b = [0, ..._b];

    const print = (array) => {
        for (let i = 0; i <= alpha; i++) {
            console.log(
                array[i]
                    .map((ele) => `{${ele[Lane.A]},${ele[Lane.B]}}`)
                    .join("      ")
            );
        }
    };

    // create a {alpha+1} x {beta+1} x {2} array
    let time = Array.from({ length: alpha + 1 }, () =>
        Array.from({ length: beta + 1 }, () => [Infinity, Infinity])
    );
    let backtrack = Array.from({ length: alpha + 1 }, () =>
        Array.from({ length: beta + 1 }, () => [Lane.Out, Lane.Out])
    );

    time[0][0][Lane.A] = time[0][0][Lane.B] = 0;
    time[1][0][Lane.A] = a[1];
    time[0][1][Lane.B] = b[1];
    backtrack[0][0][Lane.A] = backtrack[0][0][Lane.B] = Lane.Out;
    backtrack[1][0][Lane.A] = backtrack[0][1][Lane.B] = Lane.Out;

    for (let i = 2; i <= alpha; i++) {
        time[i][0][Lane.A] = Math.max(a[i], time[i - 1][0][Lane.A] + W_equal);
        backtrack[i][0][Lane.A] = Lane.A;
    }
    for (let j = 2; j <= beta; j++) {
        time[0][j][Lane.B] = Math.max(b[j], time[0][j - 1][Lane.B] + W_equal);
        backtrack[0][j][Lane.B] = Lane.B;
    }

    for (let i = 1; i <= alpha; i++) {
        for (let j = 1; j <= beta; j++) {
            let AA = Math.max(a[i], time[i - 1][j][Lane.A] + W_equal);
            let AB = Math.max(a[i], time[i - 1][j][Lane.B] + W_plus);
            let BA = Math.max(b[i], time[i][j - 1][Lane.A] + W_plus);
            let BB = Math.max(b[i], time[i][j - 1][Lane.B] + W_equal);
            time[i][j][Lane.A] = Math.min(AA, AB);
            backtrack[i][j][Lane.A] =
                time[i][j][Lane.A] == AA ? Lane.A : Lane.B;
            time[i][j][Lane.B] = Math.min(BA, BB);
            backtrack[i][j][Lane.B] =
                time[i][j][Lane.B] == BA ? Lane.A : Lane.B;
        }
    }
    const entering_time = {};
    entering_time[Lane.A] = [];
    entering_time[Lane.B] = [];
    let lane =
        time[alpha][beta][Lane.A] < time[alpha][beta][Lane.B] ? Lane.A : Lane.B;
    let i = alpha,
        j = beta;
    let last_lane;
    while (lane != Lane.Out) {
        last_lane = lane;
        entering_time[lane].push(time[i][j][lane]);
        lane = backtrack[i][j][lane];
        if (last_lane === Lane.A) i--;
        else j--;
    }
    entering_time[Lane.A].reverse();
    entering_time[Lane.B].reverse();
    return { entering_time, Lane };
};

const test = () => {
    let a = [1, 3, 4, 6];
    let b = [2, 4, 5, 9];
    let carLines = [a, b, [5, 6, 7]];
    // console.log(dp(1, 3, 2, 2, a, b));
    // console.log(fcfs(1, 3, 2, 2, a, b));
    // console.log(fcfs_multiple(1, 3, carLines, 3))
    dp_multiple(1, 3, carLines, 3);
};
const test2 = () => {
    let a = [1, 3];
    let b = [2, 4];
    let c = [10, 12];
    dp2(1, 3, 1, 3, 4, 2, 2, 2, a, b, c);
};
// test();
// test2();

export { fcfs, fcfs_multiple, dp, dp2, dp_multiple }
