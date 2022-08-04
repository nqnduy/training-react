import Head from 'next/head';
import Header from 'components/website/elements/Header';
import CONFIG from 'web.config';
import { useRouter } from 'next/router';
import BasicLayout from 'components/diginext/layout/BasicLayout';
import { BS } from 'components/diginext/elements/Splitters';
import asset from 'plugins/assets/asset';
import { NextSeo } from 'next-seo';
import GlobalStyle from 'styles/global';
import { useNextResponsive } from 'plugins/next-reponsive';
import GtagScript from '../tracking/GtagScript';

function MasterPageExample({ pageName, children, header, hidePrevButton = false, hideFooter = false }) {
    const router = useRouter();
    const { device, breakpoint, orientation } = useNextResponsive();

    return (
        <>
            <NextSeo nofollow={CONFIG.environment != 'production'} noindex={CONFIG.environment != 'production'} />
            <Head>
                <title>
                    {CONFIG.site.title} | {pageName || 'Trang chủ'}
                </title>
                <meta name="description" content={CONFIG.site.description}></meta>

                <link rel="shortcut icon" href={`${CONFIG.getBasePath()}/favicon.ico`} />

                <meta property="og:title" content={CONFIG.site.title} />
                <meta property="og:description" content={CONFIG.site.description} />
                <meta property="og:url" content={CONFIG.NEXT_PUBLIC_BASE_URL + router.asPath} />
                <meta property="og:image" content={`${CONFIG.NEXT_PUBLIC_BASE_URL}/share.png`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="fb:app_id" content={CONFIG.NEXT_PUBLIC_FB_APP_ID} />

                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link href={asset('/dashkit/fonts/cerebrisans/cerebrisans.css')} rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.5/styles/foundation.min.css" />
            </Head>

            {/* TRACKING SCRIPTS - CHANGE THE ID TO THE CORRECT ONE*/}
            <GtagScript id="G-EE9VED6EC3" />

            {/* - STYLE OF THE WEBSITE - 
      		USE THIS COMPONENT TO AVOID CSS CONFLICTED WITH ADMIN PANEL */}
            <GlobalStyle />

            <main className={[device, orientation, breakpoint].join(' ')}>
                <BasicLayout padding="50px">
                    <Header hideButtons={hidePrevButton}>{header}</Header>
                    <hr />
                    <BS size={40} />

                    {children}

                    <BS size={40} />
                    <hr />
                </BasicLayout>
            </main>
        </>
    );
}

export default MasterPageExample;
