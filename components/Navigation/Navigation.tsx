/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import * as React from 'react';
import styles from './Navigation.module.scss';
import cn from 'classnames';
import { gsap } from 'gsap';
import { useEffect, useState } from 'react';

const Navigation = () => {
  // add type argument

  const navigation = React.createRef<HTMLDivElement>();
  const [darkTheme, setDarkTheme] = useState<boolean | null>(null);

  const handleToggle = (event: { target: { checked: boolean } }) => {
    setDarkTheme(event.target.checked);
  };

  useEffect(() => {
    if (darkTheme !== null) {
      if (darkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        window.localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        window.localStorage.setItem('theme', 'light');
      }
    }
  }, [darkTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      '--initial-color-mode'
    );
    // Set initial darkmode to light
    setDarkTheme(initialColorValue === 'dark');
  }, []);

  useEffect(() => {
    gsap.to('.nav-el', {
      duration: 1,
      opacity: 1,
      yPercent: 100,
      ease: 'power4',
      delay: 0.5,
      stagger: 0.1,
    });
  }, []);
  return (
    <nav className={styles.nav} ref={navigation}>
      <Link legacyBehavior href="/">
        {/* <a className={cn("nav-el")}>Home</a> */}
        <a>
          <img
            src="/assets/icons/logo-m2024.svg"
            className={cn('nav-el')}
            alt=""
          />
        </a>
      </Link>

      <div className={styles.switchinfo}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={darkTheme === true}
            onChange={handleToggle}
          />
          <div className={styles.planet}></div>
        </label>
      </div>
    </nav>
  );
};

export default Navigation;
