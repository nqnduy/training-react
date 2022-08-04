import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import CONFIG from 'web.config';
import { redirect } from 'plugins/next-utils';

const redirectToLogin = () => {
    Router.push(CONFIG.path('/login'));
};
/**
 * @param  {string} redirectTo - The URL you want to redirect to if the authentication is failed
 */
export const useAuth = (redirectTo) => {
    const apiURL = CONFIG.path('/api/session');
    const [user, setUser] = useState({});

    useEffect(() => {
        Axios(apiURL)
            .then(({ data }) => {
                // (data);
                if (data.loggedIn) {
                    setUser(data);
                } else {
                    if (!redirectTo) {
                        redirectToLogin();
                    } else {
                        redirect(redirectTo);
                    }
                }
            })
            .catch((e) => {
                if (!redirectTo) {
                    redirectToLogin();
                } else {
                    redirect(redirectTo);
                }
            });
    }, [JSON.stringify(user)]);

    return { user };
};

/**
 * @param  {React.Component} Element - Next.js Page Component
 * @param  {Object} options - Authentication options
 * @param  {string} options.redirectTo - The URL you want to redirect to if the authentication is failed
 */
export const withAuth = (Element, options) => (props) => {
    const { user } = useAuth(options?.redirectTo);

    let pageProps = { user, ...props };
    // (user);

    return user && user.loggedIn ? <Element {...pageProps} /> : null;
};
