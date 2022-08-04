import ExpandContainer from 'components/diginext/containers/ExpandContainer';
import BlockSplitter from 'components/diginext/elements/BlockSplitter';
import { VerticalList, VerticalListAlign } from 'components/diginext/layout/ListLayout';
import { DefaultStyles } from 'components/dashkit/style/DashkitGlobalStyle';
import Browser, { BrowserEvent } from 'plugins/utils/Browser';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const Desktop = ({ children }) => {
    const isDesktop = useMediaQuery({ minWidth: 992 });
    return isDesktop ? children : null;
};
const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
    return isTablet ? children : null;
};
const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return isMobile ? children : null;
};
const Default = ({ children }) => {
    const isNotMobile = useMediaQuery({ minWidth: 768 });
    return isNotMobile ? children : null;
};

const LayoutContent = ({ children }) => {
    const [maxWidth, setMaxWidth] = useState(DefaultStyles.container.maxWidthLG);
    const isDesktop = useMediaQuery({ minWidth: 1025 });
    const isDesktopSM = useMediaQuery({ minWidth: 1025, maxWidth: 1279 });
    const isDesktopMD = useMediaQuery({ minWidth: 1280, maxWidth: 1399 });
    const isDesktopHD = useMediaQuery({ minWidth: 1400 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isPortrait = useMediaQuery({ orientation: 'portrait' });

    useEffect(() => {
        // console.group("Responsive");
        // console.log("isDesktopHD:", isDesktopHD);
        // console.log("isDesktopMD:", isDesktopMD);
        // console.log("isDesktopSM:", isDesktopSM);
        // console.log("isTablet:", isTablet);
        // console.log("isMobile:", isMobile);
        // console.log("isPortrait:", isPortrait);
        // console.groupEnd();

        if (!isPortrait) {
            // màn hình ngang
            if (isDesktopHD) {
                setMaxWidth(DefaultStyles.container.maxWidthLG);
            } else if (isDesktopMD || isDesktopSM || isTablet) {
                setMaxWidth(DefaultStyles.container.maxWidthMD);
            } else {
                setMaxWidth(DefaultStyles.container.maxWidthSM);
            }
        } else {
            // màn hình dọc
            if (isDesktop) {
                setMaxWidth(DefaultStyles.container.maxWidthMD);
            } else if (isTablet) {
                setMaxWidth(DefaultStyles.container.maxWidthSM);
            } else {
                setMaxWidth(DefaultStyles.container.maxWidthXS);
            }
        }
    }, [maxWidth, isPortrait]);

    return (
        <VerticalList align={'center'}>
            <ExpandContainer style={{ paddingTop: '65px' }}>
                <div style={{ margin: 'auto', maxWidth: `${maxWidth}px`, paddingBottom: '150px' }}>{children}</div>
            </ExpandContainer>
        </VerticalList>
    );
};

export default LayoutContent;
