import React from "react";
import DeskLED from "../pages/DeskLED/DeskLED";
import Home from "../pages/Home/Home";

export default [
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/deskled',
        element: <DeskLED/>
    }
    // {
    //     path: '/',
    //     element: <Login/>
    // },
    // {
    //     path: '/tour',
    //     element: <Tour/>,
    //     children: [
    //         {
    //             path: 'main',
    //             element: <MainPage/>,
    //         },
    //         {
    //             path: 'menu',
    //             element: <Menu/>
    //         },
    //         {
    //             path: 'navigate',
    //             element: <Map/>
    //         },
    //         {
    //             path: 'diary',
    //             element: <Diary/>,
    //         },
    //         {
    //             path: 'result/:title',
    //             element: <DiaryResult/>
    //         },
    //         {
    //             path: 'editor',
    //             element: <Editor/>
    //         },
    //         {
    //             path: 'article/:id',
    //             element: <ArticleDetail/>
    //         },
    //         {
    //             path: 'publish',
    //             element: <Publish/>
    //         }
    //     ]
    // }

]