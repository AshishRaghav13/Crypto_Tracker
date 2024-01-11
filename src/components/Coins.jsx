import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../index"
import { Radio,RadioGroup,Container, HStack, Button } from "@chakra-ui/react";
import Loader from "./Loader";
import ErrorComponent from "./ErrorComponent";
import CoinCard from "./CoinCard";

function Coins() {

  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState('inr');

  const currencySymbol = currency === 'inr' ? '₹' : currency === 'eur' ? '€' : '$'

  const changePage = (page) => {
    setPage(page);
    setLoading(true);
  }

  const btns = new Array(132).fill(1)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
        setCoins(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchCoins();

  }, [currency, page]);
  if (error) {
    return <ErrorComponent message={'Error while fetching Coins'} />
  }

  return (
    <Container maxW={'container.xl'} border={'1px solid black'}>

      {loading ? <Loader /> : (
        <>
        <RadioGroup value={currency} onChange={setCurrency} p={4} m={4}>
          <HStack spacing={4}>
            <Radio value={'inr'}>₹INR</Radio>
            <Radio value={'usd'}>$USD</Radio>
            <Radio value={'eur'}>€EUR</Radio>
          </HStack>
          
          </RadioGroup>  
          <HStack wrap={'wrap'} justifyContent={'space-evenly'}>
            {coins.map((i) => (
              <CoinCard
                id={i.id}
                key={i.id}
                name={i.name}
                price={i.current_price}
                img={i.image}
                symbol={i.symbol}
                currencySymbol={currencySymbol}
              />
            ))}

          </HStack>
          <HStack w={"full"} overflowX={"auto"} padding={'8'}>
            {btns.map((items,index) =>(
            <Button  key={index} bgColor={'blackAlpha.900'} color={"white"} onClick={() => changePage(index + 1)}>{index + 1}
            </Button>
            ))}
          </HStack>

        </>
      )}
    </Container>
  );
};


export default Coins;