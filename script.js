const fileInput = document.getElementById("csvFile");

let ocChart = null;
let trendChart = null;

fileInput.addEventListener("change", function (event) {

    const file = event.target.files[0];

    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {

            const data = results.data.filter(
                row["BJD_TDB"] !== undefined &&
                row["Dmag"] !== undefined

            );

            const times = [];
            const dmagValues = [];

            data.forEach(row => {

                times.push(Number(row["BJD_TBD"]));
                dmagValues.push(Number(row["Dmag"]));

            });

            generateStats(deviations);

            drawOCChart(transitNumbers, deviations);

            drawTrendChart(transitNumbers, deviations);
        }
    });

});

function generateStats(values) {

    const avg =
        values.reduce((a,b)=>a+b,0) / values.length;

    const variance =
        values.reduce((a,b)=>a + Math.pow(b-avg,2),0)
        / values.length;

    const stdDev = Math.sqrt(variance);

    const anomalies =
        values.filter(v => Math.abs(v-avg) > 2*stdDev).length;

    const confidence =
        Math.max(
            0,
            100 - (stdDev * 10000)
        ).toFixed(2);

    document.getElementById("stats").innerHTML = `
        <h3>Analysis Results</h3>

        <strong>Average Deviation:</strong> ${avg.toFixed(6)}<br>

        <strong>Standard Deviation:</strong> ${stdDev.toFixed(6)}<br>

        <strong>Anomalies Detected:</strong> ${anomalies}<br>

        <strong>Confidence Score:</strong> ${confidence}%<br>
    `;
}

function drawOCChart(labels, data) {

    const ctx = document.getElementById("ocChart");

    if (ocChart) {
        ocChart.destroy();
    }

    ocChart = new Chart(ctx, {

        type: "scatter",

        data: {
            datasets: [{
                label: "Observed - Calculated",
                data: labels.map((label, index) => ({
                    x: label,
                    y: data[index]
                }))
            }]
        },

        options: {
            responsive: true,

            plugins: {
                title: {
                    display: true,
                    text: "O-C Diagram"
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Transit Number"
                    }
                },

                y: {
                    title: {
                        display: true,
                        text: "Timing Difference"
                    }
                }
            }
        }
    });
}

function drawTrendChart(labels, data) {

    const ctx = document.getElementById("trendChart");

    if (trendChart) {
        trendChart.destroy();
    }

    trendChart = new Chart(ctx, {

        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: "Transit Timing Trend",
                data: data,
                fill: false,
                tension: 0.2
            }]
        },

        options: {
            responsive: true,

            plugins: {
                title: {
                    display: true,
                    text: "Transit Timing Variation Trend"
                }
            }
        }
    });
}
