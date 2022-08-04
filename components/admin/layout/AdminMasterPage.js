import Head from 'next/head';
import CONFIG from 'web.config';
import { useRouter } from 'next/router';
import Script from 'next/script';
import dynamic from 'next/dynamic';

const AdminGlobalStyle = dynamic(() => import('components/dashkit/style/DashkitGlobalStyle'));

const AdminMasterPage = ({ pageName, children }) => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>
                    {CONFIG.site.title} | {pageName || 'Trang quản trị'}
                </title>

                <link rel="shortcut icon" href={`${CONFIG.getBasePath()}/favicon.ico`} />

                <meta name="description" content={CONFIG.site.description}></meta>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/styles/dracula.min.css" />

                {/* <Script src="https://ckeditor.com/apps/ckfinder/3.5.0/ckfinder.js"></Script> */}
            </Head>

            <Script strategy="afterInteractive" src="https://ckeditor.com/apps/ckfinder/3.5.0/ckfinder.js"></Script>

            <AdminGlobalStyle />

            {/* CUSTOM STYLES  FOR ADMIN ONLY */}
            {/* BETTER TO SPLIT INTO SEPERATED COMPONENT */}
            <style global jsx>
                {`
                    .ant-select.ant-pagination-options-size-changer.ant-select-single.ant-select-show-arrow {
                        margin-top: 0px;
                    }
                `}
            </style>

            {children}
        </>
    );
};

export default AdminMasterPage;
