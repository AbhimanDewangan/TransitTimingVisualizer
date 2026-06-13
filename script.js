const fileInput = document.getElementById("csvFile");

let ocChart = null;
let trendChart = null;

fileInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimiter: "",  // auto-detects CSV or space/tab separated TXT

        complete: function(results) {

            const data = results.data;

            const times = [];
            const dmagValues = [];
            const errors = [];
            const airmass = [];

            for (let i = 0; i < data.length; i++) {

                const row = data[i];

                if (
                    row["BJD_TDB"] === undefined ||
                    row["Dmag"] === undefined
                ) continue;

                times.push(Number(row["BJD_TDB"]));
                dmagValues.push(Number(row["Dmag"]));

                if (row["Error"] !== undefined) {
                    errors.push(Number(row["Error"]));
                }

                if (row["airmass"] !== undefined) {
                    airmass.push(Number(row["airmass"]));
                }
            }

            generateStats(dmagValues, errors);

            drawLightCurve(times, dmagValues);

            drawTrendChart(times, dmagValues);
        }
    });

});

function generateStats(dmag, errors) {

    const n = dmag.length;

    const mean = dmag.reduce((a,b) => a + b, 0) / n;

    const variance = dmag.reduce((a,b) =>
        a + Math.pow(b - mean, 2), 0
    ) / n;

    const stdDev = Math.sqrt(variance);

    const avgError = errors.length > 0
        ? errors.reduce((a,b) => a + b, 0) / errors.length
        : 0;

    const noiseScore = Math.min(100, Math.max(0, 100 - stdDev * 10000));

    const quality =
        noiseScore > 85 ? "A (Excellent)" :
        noiseScore > 70 ? "B (Good)" :
        noiseScore > 50 ? "C (Moderate)" :
        noiseScore > 30 ? "D (Low Quality)" :
        "F (Poor)";

    document.getElementById("stats").innerHTML = `
        <h3>Observation Analysis</h3>

        <strong>Observations:</strong> ${n}<br>
        <strong>Mean Dmag:</strong> ${mean.toFixed(6)}<br>
        <strong>Std Deviation:</strong> ${stdDev.toFixed(6)}<br>
        <strong>Avg Error:</strong> ${avgError.toFixed(6)}<br>
        <strong>Noise Score:</strong> ${noiseScore.toFixed(2)}<br>
        <strong>Quality Grade:</strong> ${quality}
    `;
}

function drawLightCurve(times, dmag) {

    const ctx = document.getElementById("ocChart");

    if (ocChart) ocChart.destroy();

    ocChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [{
                label: "Light Curve (Dmag)",
                data: times.map((t, i) => ({
                    x: t,
                    y: dmag[i]
                })),
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Exoplanet Light Curve"
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

function drawTrendChart(times, dmag) {

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
                        text: "Time (BJD_TDB)"
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
