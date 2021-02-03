import axios from "axios";
import Head from "next/head";
import router from 'next/router'
import { useEffect } from "react";
import APIService from "../service/service";

export default function DashBoard() {

  return (
    <div className="about-page">
      <Head>
        <title>About for the user</title>
      </Head>
    </div>
  );
}


export async function getServerSideProps(context){
    console.log(context.req.__NEXT_INIT_QUERY)
    const {key} = context.req.__NEXT_INIT_QUERY;

    const domainPages = await APIService.getDomainPages( key ,{
        headers : context.req.headers
    })

    console.log(`Recived Domain Pages`, domainPages.data);

    return {
        props: {
            domain: domainPages
        }
    }
}

