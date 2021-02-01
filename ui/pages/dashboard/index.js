import axios from "axios";
import Head from "next/head";
import { useEffect } from "react";
import APIService from "../../service/service";

export default function DashBoard(props) {
  console.log(props)
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
    <div className="dashboard-page">
      <Head>
        <title>Dashboard of {props.user.name}</title>
      </Head>
    </div>
  );
}

export async function getServerSideProps(context) {
  console.log(context);
  try {
    const authenticatedUser = await axios.post(
      `http://localhost:3030/auth`,
      {},
      {
        headers: context.req
          ? { cookie: context.req.headers.cookie }
          : undefined,
      }
    );
    console.log(authenticatedUser.data);
    console.log("------------------");
    console.log(authenticatedUser.status);
    console.log("------------------");
    return {
      props: { user: authenticatedUser.data },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
