import { NextPage } from 'next'
import Head from 'next/head'
import WalletContextProvider from '../components/WalletContextProvider'
import { AppBar } from '../components/AppBar'

import styles from '../styles/Home.module.css'

const Home: NextPage = (props) => {
  return (
    <div className={styles.App}>
      <Head>
        <title>ToDo List</title>
        <meta
          name="description"
          content="ToDo List"
        />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
        </div>
      </WalletContextProvider >
    </div>
  );
}

export default Home