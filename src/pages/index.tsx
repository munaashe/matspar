import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Search from '@/assets/images/Search.svg';
import { useState, useEffect } from 'react';

import joker from '@/assets/images/joker.jpg';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('cocacola');
  const [searchData, setSearchData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  var myHeaders = new Headers();
  myHeaders.append('content-type', 'application/json');

  var raw = JSON.stringify({
    slug: '/kategori',
    query: {
      q: `${searchQuery}`,
    },
  });

  var requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'manual',
  };

  var requestSuggestionsOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow',
  };

  useEffect(() => {
    if (searchQuery) {
      fetch(
        `https://api.allorigins.win/raw?url=https://api.matspar.se/autocomplete?query=${searchQuery}`,
        requestSuggestionsOptions
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data.suggestions));
    }
  }, [searchQuery]);

  const handleSearch = () => {
    fetch('https://cors-anywhere.herokuapp.com/https://api.matspar.se/slug', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setSearchData(data.payload.products);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleSuggestionClick = (item: string) => {
    setSearchQuery(item);
    handleSearch();
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
          <div className={styles.wrapper}>
            <div className={styles.box}>
              <p className={styles.logoText}>MatSpar</p>
            </div>
            <div className={styles.search}>
              <input
                type="text"
                className={styles.searchBar}
                placeholder="search"
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <button className={styles.searchBtn} onClick={() => handleSearch()}>
                <Image src={Search} alt="search" className={styles.img} />
              </button>
            </div>
            <div className={styles.box}>Quick Link</div>
          </div>
          <div>
            {suggestions?.map((suggestion: any) => (
              <div
                className={styles.suggestions}
                key={suggestion.text}
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                <p>{suggestion.text}</p>
                <Image src={Search} alt="search" className={styles.img} />
              </div>
            ))}
            <br />
          </div>
        </nav>

        <section className={styles.body}>
          <div className={styles.gridContainer}>
            {searchData?.map((product: any) => (
              <div key={product.productid} className={styles.gridItem}>
                <div className={styles.cardImage}>
                  <Image
                    src={
                      product.image
                        ? `https://d1ax460061ulao.cloudfront.net/140x150/${product.image[0]}/${product.image[1]}/${product.image}.jpg`
                        : joker
                    }
                    alt={product.name}
                    className={styles.imageProps}
                    width="100"
                    height="100"
                  />
                </div>

                <div className={styles.cardDetails}>
                  <h5>{product.name}</h5>
                  <p>{product.weight_pretty}</p>
                </div>
                <h6>SEK {product.price}</h6>
                <button>add</button>
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
};

export default Home;
