import axios from "axios";
import Head from "next/head";
import { useEffect } from "react";

export default function Plans() {
  // useEffect(()=> {
  //     APIService.auth()
  //         .then(res=> {
  //           return res.json()
  //         })
  //         .then(json=> {
  //             console.log(json);
  //         })
  //         .catch(err=> {
  //             console.log(err)
  //         })
  // },[])
  return (
    <div className="plans-page">
      <Head>
        <title>Plans for the user</title>
      </Head>
    </div>
  );
}

