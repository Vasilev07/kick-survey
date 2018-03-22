const init = (app, data) => {
    app.get('/', (req, res) => {
        const pieData = [
            {
               value: 25,
               label: 'Java',
               color: '#811BD6',
            },
            {
               value: 10,
               label: 'Scala',
               color: '#9CBABA',
            },
            {
               value: 30,
               label: 'PHP',
               color: '#D18177',
            },
            {
               value: 35,
               label: 'HTML',
               color: '#6AE128',
            },
         ];
        res.render('shared-views/master', pieData);
    });
};

module.exports = {
    init,
};
