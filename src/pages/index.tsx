import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Search from '@/assets/images/Search.svg';
import { useState, useEffect, ReactElement } from 'react';



const Home = () =>  {
  const [searchQuery, setSearchQuery] = useState('cocacola');
  const [searchData, setSearchData]= useState([]);
  const [suggestions, setSuggestions] = useState([]);

  var requestSuggestionsOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://api.matspar.se/autocomplete?query=${searchQuery}`,
        requestSuggestionsOptions
      );
      const newData = await response.json();
      setSuggestions(newData.suggestions);
    };

    fetchSuggestions();
  }, [searchQuery]);

  const handleSearch = () => {
    fetch('https://cors-anywhere.herokuapp.com/https://api.matspar.se/slug', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: '/kategori',
        query: {
          q: `${searchQuery}`,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSearchData(data.payload.products);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  console.log(searchData);

  return (
    <>
      <Head>
        <title>Matspar</title>
        <meta name="description" content="E-commerse shop" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <nav className={styles.navbar}>
          <div className={styles.box}>
            <p className={styles.logoText}>MatSpar</p>
          </div>
          <div className={styles.search}>
            <input
              type="text"
              className={styles.searchBar}
              placeholder="search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.searchBtn} onClick={() => handleSearch()}>
              <Image src={Search} alt="search" className={styles.img} />
            </button>
            {suggestions.length > 0 ? (
              <>
                {suggestions.map((suggestion: any) => {
                  <div>
                    {suggestion.text} <Image src={Search} alt="search" className={styles.img} />
                  </div>;
                })}
              </>
            ) : null}
          </div>
          <div className={styles.box}>Quick Link</div>
        </nav>
        <section className={styles.container}>
          <div className={styles.gridContainer}>
            {searchData?.map((product: any) => (
              <div key={product.productid} className={styles.gridItem}>
                {product.name}
                </div>
            ))}
          </div>
        </section>
        <footer className={styles.footer}>
          <p>All rights reserved</p>
          <a href="https://munashe.co.zw" target="_blank" rel="noreferrer">
            Denis Siduna
          </a>
        </footer>
      </>
    </>
  );
}

export default Home