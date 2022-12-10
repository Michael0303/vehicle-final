// FCFS & DP

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
    dp(1, 3, 2, 2, a, b);
};
test();
