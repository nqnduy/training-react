import Head from 'next/head';
import CONFIG from 'web.config';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useNextResponsive } from 'plugins/next-reponsive';
import GtagScript from '../tracking/GtagScript';
import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('components/website/contexts/Providers'));
const GlobalStyle = dynamic(() => import('styles/global'));

const MasterPageBasic = (props) => {
    const router = useRouter();
    const { device, breakpoint, orientation } = useNextResponsive();
    return (
        <>
            <NextSeo nofollow={CONFIG.environment != 'production'} noindex={CONFIG.environment != 'production'} />
            <Head>
                <title>
                    {CONFIG.site.title} | {props.pageName || 'Trang chủ'}
                </title>

                <meta name="description" content={CONFIG.site.description}></meta>

                <link rel="shortcut icon" href={`${CONFIG.getBasePath()}/favicon.ico`} />

                <meta property="og:title" content={CONFIG.site.title} />
                <meta property="og:description" content={CONFIG.site.description} />
                <meta property="og:url" content={CONFIG.getBasePath() + router.asPath} />
                <meta property="og:image" content={`${CONFIG.getBasePath()}/share.png`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="fb:app_id" content={CONFIG.NEXT_PUBLIC_FB_APP_ID} />

                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                {/* Do not add stylesheets using next/head 
				Use Document instead. See more info here: https://nextjs.org/docs/messages/no-stylesheets-in-head-component*/}
            </Head>

            {/* TRACKING SCRIPTS - CHANGE THE ID TO THE CORRECT ONE*/}
            <GtagScript id="G-EE9VED6EC3" />

            {/* - STYLE OF THE WEBSITE */}
            <GlobalStyle />

            {/* - ADD MORE PROVIDER INSIDE THIS COMPONENT */}
            <Providers user={props.user}>
                <main className={[device, orientation, breakpoint].join(' ')} {...props} />
            </Providers>
        </>
    );
};

export default MasterPageBasic;
