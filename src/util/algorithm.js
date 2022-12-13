// FCFS & DP

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
    (i = alpha), (j = beta), (k = gamma);
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
    let a = [1, 3];
    let b = [2, 4];
    console.log(dp(1, 3, 2, 2, a, b));
};
const test2 = () => {
    let a = [1, 3];
    let b = [2, 4];
    let c = [10, 12];
    dp2(1, 3, 1, 3, 4, 2, 2, 2, a, b, c);
};
test2();
