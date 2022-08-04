import 'antd/dist/antd.min.css';

const GlobalStyle = () => (
    <style jsx global>{`
        /* 
		font-family: 'Cabin', sans-serif;
		font-family: 'Lora', serif;
		font-family: 'Playfair Display', serif;
		*/

        @font-face {
            font-family: 'ProximaNova';
            src: url('../public/fonts/ProximaNovaRegular.eot');
            src: url('../public/fonts/ProximaNovaRegular.eot') format('embedded-opentype'),
                url('../public/fonts/ProximaNovaRegular.woff2') format('woff2'), url('../public/fonts/ProximaNovaRegular.woff') format('woff'),
                url('../public/fonts/ProximaNovaRegular.ttf') format('truetype'),
                url('../public/fonts/ProximaNovaRegular.svg#ProximaNovaRegular') format('svg');
            font-style: normal;
            font-weight: normal;
        }

        html,
        body {
            padding: 0;
            margin: 0;
            font-family: 'CerebriSans';
            line-height: 1.3;
            font-size: 14px;
            width: 100%;
        }

        #__next {
            overflow-x: hidden;
        }

        * {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -ms-box-sizing: border-box;
            box-sizing: border-box;
        }
        h1,
        h2,
        h3,
        h4,
        h5 {
            padding: 0;
            margin: 0;
            font-weight: normal;
        }

        p {
            padding: 0;
            margin: 0;
        }

        // ul,
        // li {
        // 	padding: 0;
        // 	margin: 0;
        // 	list-style-type: none;
        // 	padding-inline-start: 0px;
        // 	margin-block-start: 0;
        // 	margin-block-end: 0;
        // 	line-height: 1;
        // }

        ol li,
        ul li {
            line-height: 1.5em;
        }

        hr {
            border-top: 1px solid #dadada;
        }

        a,
        a:hover,
        a:active {
            text-decoration: none;
        }

        img {
            max-width: 100%;
            display: block;
        }

        select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: 0;
            background: none;
        }

        main {
        }

        pre {
            margin-bottom: 0;
        }
        code.hljs {
            padding: 0.8rem;
        }

        .red-circle {
            background-color: red;
            border-radius: 50%;
            width: 80px;
            height: 80px;
        }
    `}</style>
);

export default GlobalStyle;
