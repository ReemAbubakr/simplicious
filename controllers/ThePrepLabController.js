exports.getHomePage = (req, res) => {
    const features = [{
            title: "Chef It Up",
            path: "/chef-it-up",
            image: "/images/chef-it-up.jpg",
            alt: "Find recipes with your ingredients"
        },
        {
            title: "Feelin' Risky",
            path: "/feelin-risky",
            image: "/images/mystery-dish.jpg",
            alt: "Random recipe generator"
        },
        {
            title: "Mix & Mellow",
            path: "/mix-mellow",
            image: "/images/meal-planner.jpg",
            alt: "Weekly meal planner"
        }
    ];

    res.render('home', {
        title: 'The Prep Lab',
        features
    });
};