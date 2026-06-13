const fileInput = document.getElementById("csvFile");

let lightCurveChart = null;
let trendChart = null;

fileInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimiter: "",
        transformHeader: function(header) {
            return header.replace(/"/g, "").trim();
        },

        complete: function(results) {

            const data = results.data;

            console.log("Parsed Data:", data);

            const times = [];
            const dmag = [];
            const errors = [];

            for (let i = 0; i < data.length; i++) {

                const row = data[i];

                if (!row.BJD_TDB || !row.Dmag) continue;

                const t = Number(row.BJD_TDB);
                const m = Number(row.Dmag);

                if (isNaN(t) || isNaN(m)) continue;

                times.push(t);
                dmag.push(m);

                if (row.Error !== undefined) {
                    const e = Number(row.Error);
                    if (!isNaN(e)) errors.push(e);
                }
            }

            if (times.length === 0) {
                alert("No valid data found. Please check file format.");
                return;
            }

            generateStats(dmag, errors);
            drawLightCurve(times, dmag);
            drawTrend(times, dmag);
        }
    });

});

function generateStats(dmag, errors) {

    const n = dmag.length;

    const mean = dmag.reduce((a,b) => a + b, 0) / n;

    const variance = dmag.reduce((a,b) =>
        a + Math.pow(b - mean, 2), 0
    ) / n;

    const std = Math.sqrt(variance);

    const avgError = errors.length
        ? errors.reduce((a,b) => a + b, 0) / errors.length
        : 0;

    const qualityScore = Math.max(0, 100 - std * 10000);

    let grade = "F";
    if (qualityScore > 85) grade = "A";
    else if (qualityScore > 70) grade = "B";
    else if (qualityScore > 50) grade = "C";
    else if (qualityScore > 30) grade = "D";

    document.getElementById("stats").innerHTML = `
        <h3>Observation Summary</h3>
        <b>Observations:</b> ${n}<br>
        <b>Mean Dmag:</b> ${mean.toFixed(6)}<br>
        <b>Std Dev:</b> ${std.toFixed(6)}<br>
        <b>Avg Error:</b> ${avgError.toFixed(6)}<br>
        <b>Quality Score:</b> ${qualityScore.toFixed(2)}<br>
        <b>Grade:</b> ${grade}
    `;
}

function drawLightCurve(times, dmag) {

    const ctx = document.getElementById("ocChart");

    if (lightCurveChart) lightCurveChart.destroy();

    // smoothing (moving average)
    const smooth = [];
    const windowSize = 5;

    for (let i = 0; i < dmag.length; i++) {

        let sum = 0;
        let count = 0;

        for (let j = i - windowSize; j <= i + windowSize; j++) {
            if (j >= 0 && j < dmag.length) {
                sum += dmag[j];
                count++;
            }
        }

        smooth.push(sum / count);
    }

    lightCurveChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Raw Light Curve",
                    data: times.map((t, i) => ({
                        x: t,
                        y: dmag[i]
                    })),
                    pointRadius: 2
                },
                {
                    label: "Smoothed Curve",
                    data: times.map((t, i) => ({
                        x: t,
                        y: smooth[i]
                    })),
                    type: "line",
                    borderWidth: 2,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Exoplanet Light Curve (Raw + Smoothed)"
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "BJD_TDB Time"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Differential Magnitude (Dmag)"
                    }
                }
            }
        }
    });
}

function drawTrend(times, dmag) {

    const ctx = document.getElementById("trendChart");

    if (trendChart) trendChart.destroy();

    trendChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: times,
            datasets: [{
                label: "Brightness Trend",
                data: dmag,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Transit Signal Overview"
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "BJD_TDB Time"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Dmag"
                    }
                }
            }
        }
    });
}
