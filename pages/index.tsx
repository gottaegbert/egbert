/* eslint-disable react/no-children-prop */
import * as React from 'react';
import styles from './index.module.scss';
import cn from 'classnames';
import Layout from '../components/Layout/Layout';
import { gsap } from 'gsap';
import { useEffect, useState } from 'react';
import FloatingLink from '../components/FloatingLink/FloatingLink';
import StaggeredTitle from '../components/StaggeredTitle/StaggeredTitle';
import CaseStudy from '../components/CaseStudy/CaseStudy';
import TagsFilter from '../components/TagsFilter/TagsFilter';
import Work from '../components/Work/Work';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import Cursor from '../components/Cursor/Cursor';
import ReactMarkdown from 'react-markdown';
import { gePageData } from '../utils/pages';
import { StoreProvider } from '../utils/StoreProvider';
import BasicMeta from '../utils/BasicMeta';
import { homePageData } from '../utils/customTypes';
import Preloader from '../components/Preloader';
import { createLocomotive } from '../utils/locomotive';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/Bannas/Bannas'),
  { ssr: false }
);

export function Intro(props) {
  return (
    <div className={cn(styles.heroContainer)}>
      <div className={styles.threegradient} />
      <div className={styles.three}>
        <DynamicComponentWithNoSSR />
      </div>

      <section className={cn('grid')}>
        <div
          className={cn(
            'col-12 col-start-md-2 col-end-md-11 col-start-lg-2 col-end-lg-11'
          )}
        >
          <h2 className={styles.subTitle}>
            <h1 className={styles.name}>
              <span>
                <span className={'hero-text-line'}>Siyu Hu</span>
              </span>
            </h1>
            <span>
              <span className={'hero-text-line'}>UXE-</span>
              <div data-char="DESIGNER" className={'hero-text-line'}>
                DEVELOPER
              </div>
            </span>
          </h2>
        </div>
      </section>
    </div>
  );
}

const floatingLinksData = [
  {
    name: 'Linkedin',
    imgUrl: '../assets/icons/linkedin.svg',
    bgColor: '#E7F1F7',
    url: 'https://www.linkedin.com/in/siyu-hu-838755151/',
  },
  {
    name: 'Gmail',
    imgUrl: '../assets/icons/gmail.svg',
    bgColor: '#FBEDEA',
    url: 'mailto:gottaegbert@gmail.com',
  },
  {
    name: 'Github',
    imgUrl: '../assets/icons/github.svg',
    bgColor: '#E7E7E7',
    url: 'https://github.com/gottaegbert',
  },
];

type Props = {
  data: homePageData;
};

const IndexPage: React.FC<Props> = ({ data }) => {
  const {
    aboutShort,
    selectedProjects,
    moreWorksDesc,
    moreWorks,
    ndaDisclaimer,
  } = data;

  const [selectedTags, setSelectedTags] = useState<string[]>([]); // 选定的标签
  const uniqueTags = Array.from(
    new Set(selectedProjects.flatMap((proj) => proj.tags))
  ); // 获取唯一标签

  const filteredProjects =
    selectedTags.length > 0
      ? selectedProjects.filter((proj) =>
          proj.tags.some((tag) => selectedTags.includes(tag))
        )
      : selectedProjects; // 根据选定的标签过滤项目

  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const onTagSelect = (tags: string[]) => {
    setSelectedTags(tags); // 更新选定的标签
  };

  const handleClearAll = () => {
    onTagSelect([]); // 清空选定的标签
  };
  useEffect(() => {
    const locomotiveScroll = createLocomotive();
    setTimeout(() => {
      setIsLoading(false);
      window.scrollTo(0, 0); // Scroll to start (in case page is reloaded)
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      gsap.set('.hero-text-line', { opacity: 0, yPercent: 103 });
      gsap.to('.hero-text-line', {
        duration: 1,
        yPercent: 0,
        opacity: 1,
        ease: 'power4',
        stagger: 0.5,
      });
    }
  }, [isLoading]);

  useEffect(() => {
    const tl = gsap.timeline({});

    tl.to('h2 div', { duration: 3, yPercent: 0, stagger: 0, ease: 'sine' });
    tl.delay(2);
    tl.to('h2 div', { yPercent: 103, duration: 5, stagger: 0, ease: 'sine' });
    tl.delay(2);
    tl.to('h2 div', { yPercent: 0, duration: 3, stagger: 0, ease: 'sine' });
    // tl.to("h2", { autoAlpha: 1 })

    tl.repeat(-1);
    tl.repeatDelay(2);
  }, []);

  return (
    <StoreProvider>
      <Layout>
        <BasicMeta url={'/'} />
        {/* <AnimatePresence mode="wait">{isLoading && <Preloader />}</AnimatePresence> */}

        <AnimatePresence mode="wait">
          {showPreloader && <Preloader setShowPreloader={setShowPreloader} />}
        </AnimatePresence>
        <Intro />

        <section className={cn('grid sectionSpacing', styles.aboutSection)}>
          <div className={styles.heroLinkContainer}>
            {floatingLinksData.map((link, idx) => (
              <FloatingLink {...link} idx={idx} key={idx} />
            ))}
          </div>
          <div
            className={cn(
              'col-12 col-sm-12 col-md-12 col-lg-12',
              styles.aboutCol
            )}
          >
            <p className={'fade-in-up description'}>{aboutShort}</p>
            <Link legacyBehavior href="/about">
              <a className={'fade-in-up'}>About me</a>
            </Link>
          </div>
        </section>
        <section className={cn('sectionSpacing', styles.selectedWorkContainer)}>
          <div className="grid">
            <div className={'col-9'}>
              <StaggeredTitle
                label1="Selected"
                label2="Projects"
                classname={styles.projTitle}
              />
            </div>

            {/* 添加标签过滤器 */}
            <div className={'col-10'}>
              <TagsFilter
                classname={styles.projTitle}
                tags={uniqueTags}
                selectedTags={selectedTags}
                onTagSelect={setSelectedTags}
                onClearAll={handleClearAll} // 传递 handleClearAll
              />
            </div>
            <div className={'col-2'}>
              <div className={styles.clearallContainer}>
                <button className={styles.clearButton} onClick={handleClearAll}>
                  🔁
                </button>
              </div>
            </div>
            {filteredProjects.map((proj, idx: number) => (
              <div
                key={'proj' + idx}
                className={cn('col-12 col-sm-4', styles.caseStudyCol, {
                  [styles.offsetCol]: idx === 1,
                })}
              >
                <CaseStudy {...proj} />
              </div>
            ))}
            <div className={'col-12 col-sm-6 '}>
              <ReactMarkdown className={cn('fade-in-up', styles.nda)}>
                {ndaDisclaimer}
              </ReactMarkdown>
            </div>
          </div>
        </section>
        <section className={cn('grid sectionSpacing', styles.moreWorksSection)}>
          <div className={'col-12 col-sm-6 col-md-5'}>
            <StaggeredTitle
              label1="Frontend"
              label2="Works"
              classname={styles.projTitle}
            />
          </div>
          <div className={'col-12 col-sm-6 col-md-7'}>
            <ReactMarkdown
              linkTarget="_blank"
              className="description fade-in-up"
            >
              {moreWorksDesc}
            </ReactMarkdown>
            {moreWorks.map((work, idx: number) => (
              <Work {...work} key={'work' + idx} />
            ))}
          </div>
        </section>
      </Layout>
      <Cursor imgArray={moreWorks.map((work) => work.image)} />
    </StoreProvider>
  );
};

export default IndexPage;

export const getStaticProps: GetStaticProps = async () => {
  const data = gePageData('homepage');
  return {
    props: {
      data,
    },
  };
};
