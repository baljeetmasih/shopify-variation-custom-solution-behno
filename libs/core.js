import { updateMetaFields } from "./gql_query";


export const gqLQuery = ` mutation metafieldDelete($input: MetafieldDeleteInput!) {
    metafieldDelete(input: $input) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }`;

 export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const mutationGlq = async (query, variables = {}) => {
   
  try {
    let gQyeruy;
    if (Object.keys(variables).length === 0) {
      gQyeruy = JSON.stringify({ content: { query: query } });
    } else {
      gQyeruy = JSON.stringify({ content: { query: query, variables } });
    }
    const postOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ content: { query: query, variables } }),
    };
    // ============== save data in shopify using gra phQl
    let res = await fetch("/api/apps/debug/gql", postOptions);

    let rslt = await res.json();
    if(rslt?.text?.response?.errors[0]?.extensions?.code === "THROTTLED") {
      await mutationGlq(query,variables);
      return;
    }

    if (!res.ok) {
    

      throw new Error({
        status: res.status,
        message: "Opps! something went wrong. Please try again.",
      });
      return;
    }
    var result = await res.json();

    return { status: res.status, text: result?.text };
  } catch (error) {
    return error;
  }
};


function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}
const merge = (first, second) => {
  for (let i = 0; i < second.length; i++) {
    first.push(second[i]);
  }
  return first;
};

export const saveAllrecordOneByOne = async (AllData) => {
  /**************************************************** */
  // multiple request handled
  /**************************************************** */
  let addData = [];
  if (AllData.length / 25 > 1) {
    let totalLength = AllData.length / 25;
    for await (const x of Array(Math.ceil(totalLength)).keys()) {
      let updatedRecord = await saveGqlReq(
        updateMetaFields(),
        paginate(AllData, 25, x + 1)
      );
      let repeatRecord =
        updatedRecord?.text?.body?.data?.metafieldsSet?.metafields;
      merge(addData, repeatRecord);
    }
  } else {
    let updatedRecord = await saveGqlReq(updateMetaFields(), AllData);
    addData = updatedRecord?.text?.body?.data?.metafieldsSet?.metafields;
  }
  return addData;
  /**************************************************** */
  // multiple request handled
  /**************************************************** */
};

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
          query: query,
          variables: {
            metafields: variables,
          },
        },
      }),
    };
    // ============== save data in shopify using gra phQl
    let res = await fetch("/api/apps/debug/gql", postOptions);
    if (!res.ok) {
      throw new Error({
        status: res.status,
        message: "Opps! something went wrong. Please try again.",
      });
      return;
    }
    var result = await res.json();
    return { status: res.status, text: result?.text };
  } catch (error) {
    return error;
  }
};


export const updateRecords = async (data)=>{
    const postOptions = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(data),
    };
    let res =  await fetch('/api/apps/pairs/update-pairs',postOptions)
    let response = await res.json()
    if(res && !res.ok ){
      return {status :res.status, text : response }
    }
    return response
  }


  export const getProductListById =  async(gplQuery) =>{
    // ====================get product list by id=====================
    const postOptions = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ content: gplQuery }),
      };
      // ============== save data in shopify using gra phQl
      let res =  await fetch('/api/apps/debug/gql',postOptions)
      if(!res.ok){
          return {status :res.status, text : result?.text }
      }
      var result = await res.json()
      return {status :res.status, text : result?.text }
  }

