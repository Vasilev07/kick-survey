$(function () {
    var responseResult;
    $.ajax({
        method: 'POST',
        async: false,
        url: '/api/statistics',
        error: function (error) {
            console.log(error);
        },
        success: function (response) {
            responseResult = response;
        },
    });

    const a = new Chart(document.getElementById('pie-chart'), {
        type: 'pie',
        data: {
            labels: responseResult.labelPie,
            datasets: [{
                label: 'Population (millions)',
                backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#c70850'],
                data: responseResult.dataPie,
            }],
        },
        options: {
            title: {
                display: true,
                text: 'MOST USED CATEGORIES FOR SURVEYS',
            },
        },
    });
    const b = new Chart(document.getElementById('chart2'), {
        type: 'doughnut',
        data: {
            labels: responseResult.labelDonut,
            datasets: [{
                label: 'Population (millions)',
                backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850', '#c70850'],
                data: responseResult.dataDonut,
            }],
        },
        options: {
            title: {
                display: true,
                text: 'MOST USED TYPES OF SURVEYS',
            },
        },
    });
    var c = new Chart(document.getElementById("chart3"), {
        type: 'bar',
        data: {
          labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: [2478,5267,734,784,433]
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050'
          }
        }
    });
});
