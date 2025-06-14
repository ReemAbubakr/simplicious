exports.getThePrepLab = async(req, res) => {
    const features = [{
            title: "Chef It Up",
            path: "/chef-it-up"
        },
        {
            title: "Feelin' Risky",
            path: "/feelin-risky"
        },
        {
            title: "Mix & Mellow",
            path: "/mix-and-mellow"
        }
    ];

    res.render('pages/ThePrepLab', {
        features,
        currentPage: 'features'
    });
};