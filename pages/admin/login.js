import { Avatar, notification, Spin } from 'antd';
import CenterContainer from '@/diginext/containers/CenterContainer';
import BlockSplitter from '@/diginext/elements/BlockSplitter';
import InlineSplitter from '@/diginext/elements/InlineSplitter';
import { Input, InputType, ValidationType } from '@/diginext/form/Form';
import BasicLayout from '@/diginext/layout/BasicLayout';
import FullscreenLayout from '@/diginext/layout/FullscreenLayout';
import { HorizontalList, HorizontalListAlign, VerticalList, VerticalListAlign } from '@/diginext/layout/ListLayout';
import AdminButton, { ButtonSize } from 'components/dashkit/Buttons';
import { useRouter } from 'next/router';
import asset from 'plugins/assets/asset';
import CONFIG from 'web.config';
import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import { DefaultStyles } from 'components/admin/layout/AdminGlobalStyle';
import AdminMasterPage from 'components/admin/layout/AdminMasterPage';
import Image from 'next/image';
// import Link from 'next/link';
// import GoogleLogin from 'react-google-login';
// import Config from 'lib/config';

const AdminLogin = () => {

    const router = useRouter();
    const emailRef = useRef();
    const passRef = useRef();

    const isDesktop = useMediaQuery({ minWidth: 1025 });
    const [shouldLayoutDesktop, setShouldLayoutDesktop] = useState(true);
    const [isLogining, setIsLogining] = useState(false);

    useEffect(() => {
        if (isDesktop) {
            setShouldLayoutDesktop(true);
        } else {
            setShouldLayoutDesktop(false);
        }
    });

    const onLogin = () => {
        setIsLogining(true)
    }


    const loginHandler = async () => {
        onLogin();

        if (emailRef.current.isValid && passRef.current.isValid) {
            let body = {
                email: emailRef.current.value,
                password: passRef.current.value,
            };
            let res;
            try {
                res = await Axios({
                    url: `${CONFIG.getBasePath()}/api/login`,
                    method: 'POST',
                    data: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            } catch (e) {
                res = e.response;
            }

            if (res.data.status) {
                localStorage.setItem('permissions', JSON.stringify(res.data.data.role.permissions));
                // router.push("/admin");
                if (router?.query?.re) {
                    router.push(router.query.re)
                } else {
                    router.push("/admin");
                }
            } else {
                if (res.data.message) {
                    if (typeof res.data.message == 'string') res.data.message = [res.data.message];
                    res.data.message.map((msg) => {
                        notification.error({
                            message: msg,
                        });
                    });
                } else {
                    notification.error({
                        message: 'Something wrong, please try again later.',
                    });
                }
                setIsLogining(false);
            }
        }
    };

    const loginGoogleHandler = async (response) => {
        onLogin();

        if (response.error) {
            return;
        }

        let body = {
            accessToken: response.accessToken,
            forceLogin: true
        };
        let res;
        try {
            res = await Axios({
                url: `${CONFIG.getBasePath()}/api/loginGoogle`,
                method: "POST",
                data: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (e) {
            res = e.response;
        }
        if (res.data.status) {
            localStorage.setItem("permissions", JSON.stringify(res.data.data.role.permissions || {}));
            if (router?.query?.re) {
                router.push(router.query.re)
            } else {
                router.push("/admin");
            }
        } else {
            if (res.data.message) {
                if (typeof res.data.message == "string") res.data.message = [res.data.message];
                res.data.message.map((msg) => {
                    notification.error({
                        message: msg,
                    });
                });
            } else {
                notification.error({
                    message: "Something wrong, please try again later.",
                });
            }
            setIsLogining(false);
        }
    }

    const SignInContainer = (
        <BasicLayout className="login-container" minWidth="360px">
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3>Đăng nhập</h3>
            </div>
            {/* <div style={{ marginBottom: "20px" }} >
                <GoogleLogin
                    autoLoad={false}
                    clientId={Config.api.googleClientId}
                    render={renderProps => (
                        <>
                            <AdminButton
                                size={ButtonSize.NORMAL}
                                onClick={renderProps.onClick}
                                style={{ width: "100%", textAlign: "center", backgroundColor: '#fff', color: 'black', border: '1px solid #ccc' }}
                            >
                                <Avatar src={asset("/icons/google.svg")} size={30} style={{ marginRight: 5 }} />
                                Google
                            </AdminButton>
                        </>
                    )}
                    buttonText="Login"
                    onSuccess={loginGoogleHandler}
                    onFailure={loginGoogleHandler}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p style={{ color: DefaultStyles.colors.secondary }}>hoặc đăng nhập bằng Email</p>
            </div> */}
            {/* <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h1>Sign in</h1>
                <p style={{ color: DefaultStyles.colors.secondary }}>Đăng nhập vào trang quản trị.</p>
            </div> */}
            <Input
                ref={emailRef}
                label="Email Address"
                placeholder="name@address.com"
                validateConditions={[{ type: ValidationType.EMAIL, errMessage: 'Không đúng định dạng email.' }]}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        loginHandler();
                    }
                }}
            />
            <Input
                ref={passRef}
                label="Password"
                type={InputType.PASSWORD}
                placeholder="Nhập mật khẩu của bạn"
                validateConditions={[{ type: ValidationType.NOT_EMPTY, errMessage: 'Vui lòng nhập mật khẩu.' }]}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        loginHandler();
                    }
                }}
            />
            <AdminButton
                size={ButtonSize.LARGE}
                onClick={loginHandler}
                style={{ width: '100%', textAlign: 'center' }}
                disabled={isLogining ? true : false}
            >
                Sign in
            </AdminButton>

            <div style={{ textAlign: 'center', marginTop: '20px', display: isLogining ? '' : 'none' }}>
                <Spin tip="Sign in..."></Spin>
            </div>
            {/* <BlockSplitter height={20} />
            <div style={{ marginBottom: "20px" }}>
                <div style={{ width: "50%", float: "left" }}>
                    <Link href={`/admin/forgot-password`}>Forgot password</Link>
                </div>
            </div> */}
        </BasicLayout>
    );

    const SignInVisual = (
        <BasicLayout width={shouldLayoutDesktop ? '500px' : '60%'}>
            <Image alt="login" src={asset('/admin/images/login_visual.png')} width="520" height="400" />
        </BasicLayout>
    );

    const DesktopLayout = (
        <FullscreenLayout backgroundColor="#E5E5E5">
            <CenterContainer>
                <HorizontalList align="middle">
                    {SignInContainer}
                    <InlineSplitter width={60} />
                    {SignInVisual}
                </HorizontalList>
            </CenterContainer>
        </FullscreenLayout>
    );

    const MobileLayout = (
        <VerticalList align={'center'}>
            <BlockSplitter height={50} />
            {SignInVisual}
            <BlockSplitter height={50} />
            {SignInContainer}
        </VerticalList>
    );

    return <AdminMasterPage>{shouldLayoutDesktop ? DesktopLayout : MobileLayout}</AdminMasterPage>;
};

export default AdminLogin;
