// FCFS & DP

// return entering time for both a_i and b_j
// temporally pad the input a, b at index 0; need to be fixed later
const dp = (W_equal, W_plus, alpha, beta, a, b) => {
    const Lane = {
        A: 0,
        B: 1,
    };

    const print = (array) => {
        for (let k = 0; k <= alpha; k++) {
            for (let j = 0; j <= beta; j++) {
                console.log(k, j, array[k][j][Lane.A], array[k][j][Lane.B]);
            }
        }
    };

    // create a {alpha+1} x {beta+1} x {2} array
    let time = Array.from({ length: alpha + 1 }, () =>
        Array.from({ length: beta + 1 }, () => [Infinity, Infinity])
    );

    time[0][0][Lane.A] = time[0][0][Lane.B] = 0;
    time[1][0][Lane.A] = a[1];
    time[0][1][Lane.B] = b[1];

    for (let i = 2; i <= alpha; i++) {
        time[i][0][Lane.A] = Math.max(a[i], time[i - 1][0][Lane.A] + W_equal);
    }
    for (let j = 2; j <= beta; j++) {
        time[0][j][Lane.B] = Math.max(b[j], time[0][j - 1][Lane.B] + W_equal);
    }

    for (let i = 1; i <= alpha; i++) {
        for (let j = 1; j <= beta; j++) {
            let AA = Math.max(a[i], time[i - 1][j][Lane.A] + W_equal);
            let AB = Math.max(a[i], time[i - 1][j][Lane.B] + W_plus);
            let BA = Math.max(b[i], time[i][j - 1][Lane.A] + W_plus);
            let BB = Math.max(b[i], time[i][j - 1][Lane.A] + W_equal);
            time[i][j][Lane.A] = Math.min(AA, AB);
            time[i][j][Lane.B] = Math.min(BA, BB);
        }
    }
    console.log(Math.min(time[alpha][beta][Lane.A], time[alpha][beta][Lane.B]));
};

const test = () => {
    let a = [0, 1, 3]; // pad at index 0 here
    let b = [0, 2, 4]; // pad at index 0 here
    dp(1, 3, 2, 2, a, b);
};
test();
