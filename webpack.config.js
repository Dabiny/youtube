const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

// Entry는 우리가 처리하고자 하는 파일들이다.
// client/js/main을 webpack에 전달해보자.
// main.js를 변환해줄것이다.

// webpackdl js 바벨처리, css처리를해서 내 파일의 head에 코드를 적용시킨다.

// 모든 파일들에는 entry가 필요하고, output(결과뮬)이 필요하다.(필수요건)
// entry는 소스코드를 말한다. 내가 바꾸고싶은 파일
// console.log(__dirname);
// console.log(path.resolve(__dirname, "assets", "js"));
module.exports = {
    // 변경하고자 하는 파일 (우리가 코딩할 client 폴더)
    entry: "./src/client/js/main",

    // 나는 js파일에 css를 넣고싶진 않음..분리된 css파일을 만들고싶어. -> plugin
    // MiniCssExtractPlugin: 해당코드를 다른파일로 분리시키는 애임.
    plugins: [
        new MiniCssExtractPlugin({
            // css파일이랑 js파일 분리시키기 "css/styles.js"
            filename: "css/styles.css",
        }),
    ],

    // Set 'mode' option to 'development' or 'production'
    // mode를 설정안해주면 기본으로 webpack은 production mode로 설정할것.
    // 그렇게되면 코드들은 다 압축되고 기괴해질텐데 개발중에는 기괴하지 않았으면 좋겠음. 설정해줘야함.
    mode: "development",

    // webpack을 자동으로 바꿔치기 해주는 애 nodemon같은 존재
    watch: true,
    output: {
        filename: "js/main.js",
        // 변경될 결과물 저장경로도 설정해줘야한다.

        // configuration.output.path: The provided value "./assets/js" is not an absolute path!
        // path.resoleve -> 절대경로 변경, Dirnmae: 말그래로 파일내임을 그대로 보여주는것.
        // __dirname:/Users/dabinkim/Documents/nomad/youtube
        // asset폴더는 브라우저가 볼 폴더이고 브라우저는 이 파일들을 읽어나갈것임.
        // express에게 asset폴더 경로를 접근할 수 있게 알려주기.

        // css파일이랑 js파일 분리시키기 "js/main.js"
        path: path.resolve(__dirname, "assets"),
        // output 폴더를 빌드하기전에 clean해준다. 
        clean: true,
    },
    module: {
        //rules: 우리가 각각 파일 종류에 따라 어떤 전환을 할건지 결정하는것.
        rules: [
            {
                // js형식 모두 설정
                test: /\.js$/,
                // js를 babel로 변환시키도록 loader를 설정한다. 설치해야됨.
                // webpack은 babel-loader를 찾기위해 node_modules를 찾게된다.
                use: {
                    loader: "babel-loader",
                    // 우리는 몇가지 옵션을 전달하는 것이다.
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }],
                        ],
                    },
                },
            },
            {
                test: /\.scss$/,
                // 여러가지 로더들을 가져다가 한가지 변형으로도 만들 수 있다.
                // 폰트같은걸 불러올때 유용하게 쓰일 loader, 변환한 css를 웹사이트에 적용시키는 loader..
                // style-loader: css를 DOM에 주입시킴.(가장마지막) 이거대신에 MiniCssExtractPlugin의 로더를 쓸거임.

                // 이상하게 생긴 scss를 가져다가 일반적이 css로 바꿀것임. 그 바귄 css를 우리웹사이트로 보낼것임.
                // 중요한건 제일 마지막 loader부터 시작해야한다. (역순) <- webpack은 마지막부터 loader를 실행함.
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },
};
