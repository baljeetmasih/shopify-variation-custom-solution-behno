import C_loader from "@/components/common/loader";
import useFetch from "@/components/hooks/useFetch";
import {
  Layout,
  LegacyCard,
  Page,
  Grid,
  Card,
  Icon,
  Text,
  Spinner,
  Loading,
  Divider,
  Frame,
  HorizontalGrid,
  Tooltip,
  AccountConnection
} from "@shopify/polaris";


import { EditMajor, DeleteMajor, RefreshMajor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import Link from 'next/link'
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { gqLQuery, mutationGlq } from "@/libs/core";

const useDataFetcher = (initialState, url, options) => {
  const [data, setData] = useState(initialState);
  const fetch = useFetch();

  const fetchData = async () => {
    setData("loading...");
    const result = await (await fetch(url, options)).json();
    setData(result.text);
  };

  return [data, fetchData];
};

const DataCard = ({ method, url, data, onRefetch }) => (
  <Layout.Section>
    <LegacyCard
      sectioned
      primaryFooterAction={{
        content: "Refetch",
        onAction: onRefetch,
      }}
    >
      <p>
        {method} <code>{url}</code>: {data}
      </p>
    </LegacyCard>
  </Layout.Section>
);


const saveGqlReq = async (query, variables) => {
  try {
    const postOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

      },
      method: "POST",
      body: JSON.stringify({
        content: {
          query: query, variables: {
            "metafields": variables
          }
        }
      }),
    };
    // ============== save data in shopify using gra phQl
    let res = await fetch('/api/apps/debug/gql', postOptions)
    if (!res.ok) {
      throw new Error({ status: res.status, message: 'Opps! something went wrong. Please try again.' })
      return
    }
    var result = await res.json()
    return { status: res.status, text: result?.text }
  } catch (error) {
    return error
  }
}
const GetData = () => {

  const [loader, setLoader] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const router = useRouter();

  const postOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ content: "Body of POST request" }),
  };


  const [responseDataPairs, fetchContentPairs] = useDataFetcher(
    [],
    "/api/apps/pairs"
  );

  useEffect(() => {
    fetchContentPairs();
  }, []);

  const fixBrokenImage = async (id) => { };


  const Loader = () => {
    return (
      <><Frame><C_loader /><Loading /></Frame></>
    )
  }

  //==============================================//
  // pair delete action
  //==============================================//
  const deleteAction = () => {
    alert('deleteAction')
  }

  //==============================================//
  // fix broken images
  //==============================================//
  const brokenImageAction = async (pid) => {
    setRefresh(true)
    let data =  await fetch('/api/apps/pairs/'+pid)
    .then((response) => response.json())
    .then((data) => {return data});
  
    if(data.status == 200 || typeof data.text == "object"){
    // setLoader(false)
    let pairData = data?.text?.pairdata
    let updatedPair = []

    for await (let P_Object of pairData){
      let productId = P_Object?.id
      let ProductQuery = `query {
        product(id: "${productId}") {
          featuredImage {
            url
          }
        }
      }`
      let latestImg = await mutationGlq(ProductQuery)
      if(latestImg?.text?.body?.data?.product != null){
        let img = latestImg?.text?.body?.data?.product?.featuredImage?.url;
        P_Object.images.edges[0].node.originalSrc = img;
        updatedPair.push(P_Object)
      }else{
        updatedPair.push(P_Object)
      }
    }

    // save data 

    if(updatedPair.length > 0) {

      const postOptions = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({pairdata: updatedPair, id :pid}),
      };

      const response = await fetch(`/api/apps/pairs/update-pairs`, postOptions);
      let newData = await response.json(); // parses JSON response into native JavaScript objects

      if(response.status == 200){
        Swal.fire({
          title: 'Good Job 😊!',
          text: 'Latest fetaure images updated..',
          icon: 'success',
        })
        setRefresh(false)
        fetchContentPairs()
      }else{
        setRefresh(false)

        Swal.fire({
          title: 'Opps! 😊',
          text: 'Something went wrong please try again.',
          icon: 'warning',
        })
      }
  }


    
    }
  }

  //==============================================//
  // edit pair
  //==============================================//
  const editAction = () => {
    alert('deleteAction')

  }
  const connected = true
  const terms = (
    <p>
      By clicking <strong>Connect</strong>, you agree to accept Sample App’s{' '}
      <Link href="Example App">terms and conditions</Link>. You’ll pay a
      commission rate of 15% on sales made through Sample App.
    </p>
  );


   


  const deletePairfromData = async (id, pairData, actualdata) => {
    Swal.fire({
      title: 'Do you want to delete?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Don't delete`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        //======================================================================//
        //======================================================================//
        //======================================================================//
        let overAllData = (actualdata)
        if ('object' === typeof overAllData) {
          let allData = [];
          setLoader(true)

          function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
          let availableRateLimit = 50;

          overAllData.forEach(async (i)=>{
            let thortal = await mutationGlq(gqLQuery, { input: { id: i.id } })
          })
        
         
          const postOptions = {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ id: id }),
          };
          await fetch(`/api/apps/pairs/delete-pairs/`, postOptions)
            .then(res => res.json()) // or res.json()
            .then(res => {
              fetchContentPairs()
              setLoader(false)

            })
            .catch(err => console.log(err))
        } else {
          Swal.fire({
            title: 'Opps! 😊',
            text: 'Something went wrong please try again.',
            icon: 'warning',
          })
        }

        //======================================================================//
        //======================================================================//
        //======================================================================//
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }




  return (
    <Page
      title="All Pairs"
      backAction={{ content: "Home", onAction: () => router.push("/debug") }}
      fullWidth
    >

      {loader ? <Loader /> : ''}

      {responseDataPairs.length == 0 || typeof responseDataPairs == "string"
        ? (responseDataPairs.length == 0 ? <AccountConnection
          accountName={'Behno'}
          connected={connected}
          title="No pair found!"
          action={{
            content: "Create pair",
            onAction: () => router.push('/debug/pairs/create'),
          }}
          termsOfService={terms}
        />
          : <Loader />)
        : (<><Grid>
          {responseDataPairs.map((vl, key) => {
            const allP = vl.pairdata;
            let pid = vl?.id
            return (
              <Grid.Cell
                key={vl.id}
                columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
              >
                {allP !== null && (
                  <div className="main-edit-outer">
                    <Card sectioned>

                      <div className="tmb_spacer">
                        <Grid>
                          <Grid.Cell columnSpan={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }} >
                            <Text as="h2" variant="bodyMd">
                              {vl.title}
                            </Text>
                          </Grid.Cell>
                          <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }} >
                            <HorizontalGrid columns={4}  >
                            <a >{refresh ? <Spinner size="small"/> : ''}</a>
                              <a onClick={() => brokenImageAction(vl.id)} className="cursor_pointer">
                    
                                <Icon source={RefreshMajor} color="base" />
                                </a>
                              <Link href={`/debug/pairs/${pid}`} className="cursor_pointer"><Icon source={EditMajor} color="base" /></Link>
                              <a onClick={() => {
                                deletePairfromData(vl.id, vl.pairdata, vl.actualdata)
                              }} className="cursor_pointer"><Icon source={DeleteMajor} color="base" /></a>
                            </HorizontalGrid>
                          </Grid.Cell>
                        </Grid>
                      </div>





                      <HorizontalGrid columns={6}  >

                        {allP.map((cVL, cKEY) => {
                          return (
                            <Tooltip content={`${cVL.title} `} key={`${cKEY}-ee`}>
                              <div key={cKEY.toString()} active='true' content={cVL.title}>
                                <img src={cVL?.images?.edges[0]?.node.originalSrc} height={50} width={50} alt={vl.title} />
                              </div>
                            </Tooltip>
                          )
                        })}
                      </HorizontalGrid>
                    </Card>


                  </div>
                )}
              </Grid.Cell>
            );

          })}</Grid></>)

      }

      {/* <Layout>
        <DataCard
          method="GET"
          url="/api/apps"
          data={responseData}
          onRefetch={fetchContent}
        />
        <DataCard
          method="POST"
          url="/api/apps"
          data={responseDataPost}
          onRefetch={fetchContentPost}
        />
        <DataCard
          method="GET"
          url="/api/apps/debug/gql"
          data={responseDataGQL}
          onRefetch={fetchContentGQL}
        />
      </Layout> */}
    </Page>
  );
};

export default GetData;

