import React from 'react'
import { render } from 'react-dom'
import FlexTableExample from '../FlexTable/FlexTable.example'
import VirtualScrollExample from '../VirtualScroll/VirtualScroll.example'
import styles from './demo.css'

render((
    <div className={styles.demo}>
      <div className={styles.headerRow}>
        <div className={styles.headerRow__reactVirtualized}>
          <div className={styles.headerRow__logoColumn}>
            <h1 className={styles.headerTextPrimary}>
              React
            </h1>
            <h2 className={styles.headerTextSecondary}>
              Virtualized
            </h2>
          </div>

          <img
            alt='React virtualized'
            style={{width: 100, height: 100}}
            src='https://cloud.githubusercontent.com/assets/29597/11476962/56723986-973a-11e5-8464-2a2c7528a8cc.png'
          />
        </div>

        <a
          className={styles.headerRow__githubColumn}
          href='https://github.com/bvaughn/react-virtualized'
        >
          <img
            alt='Fork me on GitHub'
            className={styles.headerRow__githubImage}
            style={{width: 50, height: 50}}
            src='https://cloud.githubusercontent.com/assets/29597/11477250/fdcf83d6-973b-11e5-9fe1-5935243d2c02.png'
          />
          Fork me on GitHub
        </a>
      </div>

      <div className={styles.demo__row}>
        <VirtualScrollExample/>
        <FlexTableExample/>
      </div>
    </div>
  ),
  document.getElementById('root')
)
