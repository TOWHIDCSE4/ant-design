import React, { useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';
import { Helmet, useOutlet } from 'dumi';
import '../../static/style';
import ConfigProvider from 'antd/es/config-provider';
import classNames from 'classnames';
import zhCN from 'antd/es/locale/zh_CN';
import SiteContext from '../../slots/SiteContext';
import Header from '../../slots/Header';
import Footer from '../../slots/Footer';
import useLocale from '../../../hooks/useLocale';
import useLocation from '../../../hooks/useLocation';
import ResourceLayout from '../ResourceLayout';
import GlobalStyles from '../../common/GlobalStyles';
import SidebarLayout from '../SidebarLayout';

const locales = {
  cn: {
    title: 'Ant Design - 一套企业级 UI 设计语言和 React 组件库',
    description: '基于 Ant Design 设计体系的 React UI 组件库，用于研发企业级中后台产品。',
  },
  en: {
    title: "Ant Design - The world's second most popular React UI framework",
    description:
      'An enterprise-class UI design language and React UI library with a set of high-quality React components, one of best React UI library for enterprises',
  },
};

const DocLayout: React.FC = () => {
  const outlet = useOutlet();
  const location = useLocation();
  const { pathname, search } = location;
  const [locale, lang] = useLocale(locales);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { direction } = useContext(SiteContext);

  useLayoutEffect(() => {
    if (lang === 'cn') {
      dayjs.locale('zh-cn');
    } else {
      dayjs.locale('en');
    }
  }, []);

  useEffect(() => {
    const nprogressHiddenStyle = document.getElementById('nprogress-style');
    if (nprogressHiddenStyle) {
      timerRef.current = setTimeout(() => {
        nprogressHiddenStyle.parentNode?.removeChild(nprogressHiddenStyle);
      }, 0);
    }
  }, []);

  React.useEffect(() => {
    if (typeof (window as any).ga !== 'undefined') {
      (window as any).ga('send', 'pageview', pathname + search);
    }
    if (typeof (window as any)._hmt !== 'undefined') {
      (window as any)._hmt.push(['_trackPageview', pathname + search]);
    }
  }, [location]);

  const content = useMemo(() => {
    if (
      ['', '/'].some((path) => path === pathname) ||
      ['/index'].some((path) => pathname.startsWith(path))
    ) {
      return (
        <>
          {outlet}
          <Footer />
        </>
      );
    }
    if (pathname.startsWith('/docs/resource')) {
      return <ResourceLayout>{outlet}</ResourceLayout>;
    }
    if (pathname.startsWith('/theme-editor')) {
      return outlet;
    }
    return <SidebarLayout>{outlet}</SidebarLayout>;
  }, [pathname, outlet]);

  return (
    <>
      <Helmet encodeSpecialCharacters={false}>
        <html
          lang={lang}
          data-direction={direction}
          className={classNames({ [`rtl`]: direction === 'rtl' })}
        />
        <title>{locale?.title}</title>
        <link
          sizes="144x144"
          href="https://gw.alipayobjects.com/zos/antfincdn/UmVnt3t4T0/antd.png"
        />
        <meta name="description" content={locale.description} />
        <meta property="og:title" content={locale?.title} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png"
        />
      </Helmet>
      <ConfigProvider locale={lang === 'cn' ? zhCN : undefined}>
        <GlobalStyles />
        <Header />
        {content}
      </ConfigProvider>
    </>
  );
};

export default DocLayout;
