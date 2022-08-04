import asset from '@/plugins/assets/asset';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    // static async getInitialProps(ctx) {
    //   const initialProps = await Document.getInitialProps(ctx)
    //   return { ...initialProps }
    // }

    render() {
        return (
            <Html lang="vi">
                <Head>
                    <link href={asset('/dashkit/fonts/cerebrisans/cerebrisans.css')} rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
