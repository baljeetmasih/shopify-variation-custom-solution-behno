import { Page, Frame, Loading, LegacyCard, EmptyState, Button, Grid, Card, HorizontalGrid, Icon, Text, Tooltip, Form, FormLayout, TextField, PageActions, Spinner } from "@shopify/polaris";
import { EditMajor, DeleteMajor, AddMajor } from "@shopify/polaris-icons";

import { useRouter } from "next/router";
import useFetch from "@/components/hooks/useFetch";
import C_loader from "@/components/common/loader";
import { useEffect, useState } from "react";
import BuildForm from "@/components/common/form";
import SearchProduct from "@/components/common/searchProduct";
import Swal from "sweetalert2";
import * as field from "@/libs/Field";
import { gqLQuery, mutationGlq, saveAllrecordOneByOne, updateRecords, getProductListById } from "@/libs/core";
import { SEARCH_PRODUCTS_BY_IDS } from "@/libs/gql_query";

const useDataFetcher = (initialState, url, options) => {
  
  const [data, setData] = useState(initialState);
  const fetch = useFetch();

  const fetchData = async () => {
    setData("loading...");
    let result = await fetch(url, options)

    result = await result.json()
    setData(result);
  };

  return [data, fetchData];
};


// ======================================================== // 
// loader
// ======================================================== // 

const Loader = () => {
  return (
    <><Frame><C_loader /><Loading /></Frame></>
  )
}

// ======================================================== // 
// pair not found
// ======================================================== // 
let PairNotFound = ({ responseData }) => {
  let router = useRouter();

  return (
    <>
      <Page><LegacyCard sectioned>
        <EmptyState
          heading={responseData.text}
          image="https://brightbird.ca/cdn/shop/articles/Smaller_404_200x200.jpg?v=1650518488"
        >
          <p>This is somewhat embarrassing, isn’t it?</p>
          <p>It looks like nothing was found at this location. Maybe try a search?</p>

          <Button onClick={() => router.push('/debug/data')} color="primary">Go to all Pairs</Button>
        </EmptyState>
      </LegacyCard></Page>
    </>
  )
}



function Singlepair({ message }) {

  let router = useRouter();

  const [selectedThumbs, setSelectedThumbs] = useState([]);


  const [fillEdit, setfillEdit] = useState({});

  //   const [pairInfo, setPairInfo] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState([]);
  const [selectedDiv, setSelectedDiv] = useState("");
  const [loader, setLoader] = useState(false);
  const [finalScreen, setFinalScreen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedRough, setSelectedRough] = useState([]); // product rough

  const [addproductshowArea, setAddProductShowArea] = useState(false);


  // editUpadte
  const [editUpdata, setEditUpdate] = useState(false);
  const [indexUpdata, setIndexUpdate] = useState(-1);

  // new fields
  const [paragraph, setParagraph] = useState("");
  const [reviewText, setreviewText] = useState("");
  const [heading, setHeading] = useState("");
  const [imageRecognition, setRecognition] = useState("");
  const [gridImage, setGridImage] = useState([]);
  const [seenIn, setSeenIn] = useState([]);
  const [seenInpre, setSeenInpre] = useState([]);

  const [selected_for_deletion, setSelected_for_deletion] = useState([])
  const [selected_index_for_deletion, setSelected_index_for_deletion] = useState(0)

  const [responseData, fetchContent] = useDataFetcher("", "/api/apps/pairs/" + router.query.slug);

  useEffect(() => {
    if(router.query.slug) {
      fetchContent();
    }
  }, [router.query.slug])



  //=====================================================//
  //
  //=====================================================//

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

  function hasNumber(myString) {
    const number = parseInt(myString.match(/\d+/g)[0]);
    if (number > 0) { return true }
    return false
  }


  const deleteAction = async (e, index, handle, wholeData) => {
    debugger
    try {
      index = +index
      let deleteRequest = [responseData?.text][0]?.pairdata;
      wholeData = deleteRequest
      let sdfgjsgdgfjhsgd = wholeData
      let deleteActualdata = [responseData?.text][0]?.actualdata;
      if (typeof deleteRequest === "object") {
        setLoader(true);

        let productVariant, productSwatch, productHeading, productParagraph, productGridImage, productSeenIn, productReviewText

        for (let items of deleteActualdata) {
          if (items.key === 'testing_product_variants')
            productVariant = (items.value).split(" ")
          else if (items.key === 'testing_product_swatchs')
            productSwatch = (items.value).split(" ")
          else if (items.key === 'testing_product_grid_heading')
            productHeading = items.value
          else if (items.key === 'testing_product_grid_paragraph')
           productParagraph = items.value
          else if (items.key === 'review_section')
           productReviewText = items.value
          else if (items.key === 'tesing_product_grid_image')
           productGridImage = hasNumber(items.value)  ? items.value : ""
          else if (items.key === 'testing_seen_in')
           productSeenIn =  hasNumber(items.value)  ? items.value : ""
        }

        // let productVariant = (deleteActualdata[0]?.key === 'testing_product_variants') ? deleteActualdata[0]?.value.split(" ") : "";
        // let productSwatch = (deleteActualdata[1]?.key === 'testing_product_swatchs') ? deleteActualdata[1]?.value.split(" ") : "";
        // let productHeading = (deleteActualdata[2]?.key === 'testing_product_grid_heading') ? deleteActualdata[2]?.value : '';
        // let productParagraph = (deleteActualdata[3]?.key === 'testing_product_grid_paragraph') ? deleteActualdata[3]?.value : '';
        // let productReviewText = (deleteActualdata[6]?.key === 'testing_product_grid_paragraph') ? deleteActualdata[6]?.value : '';
        // let productGridImage = hasNumber(deleteActualdata[4]?.value) ? parseInt(deleteActualdata[4]?.value.match(/\d/g).join("")) > 1 ? deleteActualdata[4]?.value : "": "";
        // let productSeenIn = hasNumber(deleteActualdata[5]?.value) ? parseInt(deleteActualdata[5]?.value.match(/\d/g).join("")) > 1 ? deleteActualdata[5]?.value : "" : "";

        //===========================================//
        // delete all pair
        //===========================================//

        let beforeDelete = deleteRequest[index];

        let collectDeleteID = [];
        deleteActualdata?.map((deleteRQ, deleteIndex) => {
          if (beforeDelete.id == deleteRQ.ownerId) {
            collectDeleteID.push(deleteRQ.id);
          }
        });

        productVariant?.splice(index, 1)
        productSwatch?.splice(index, 1)
        deleteRequest?.splice(index, 1)
        wholeData = deleteRequest

        var wholeData = wholeData.filter(function (el) {
          return el != null;
        });


        //===========================================//
        // delete pair
        //===========================================//

        productVariant = productVariant.join(" ").trim();
        productSwatch = productSwatch.join(" ").trim();

        /// collect all data
        let AllData = [], id = []

        deleteRequest.forEach((elem, index) => {
          if (elem === undefined) return;

          id.push(elem.id);

          if (productVariant.replace(/  +/g, " ")) {
            let veriant = field.fieldProductVariant(
              elem.id,
              productVariant.replace(/  +/g, " ")
            );
            AllData.push(veriant);
          }

          if (productSwatch.replace(/  +/g, " ")) {
            let swatches = field.fieldProductSwatch(
              elem.id,
              productSwatch.replace(/  +/g, " ")
            );
            AllData.push(swatches);
          }

          if (productHeading) {
            let pHeding = field.fieldProductHeading(elem.id, productHeading.trim());
            AllData.push(pHeding);
          }

          if (productParagraph) {
            let pParagraph = field.fieldProductParagraph(
              elem.id,
              productParagraph.trim()
            );
            AllData.push(pParagraph);
          }

          if (productGridImage) {
            let gridImg = field.fieldProductGridImage(
              elem.id,
              productGridImage.trim()
            );
            AllData.push(gridImg);
          }

          if (productSeenIn) {
            let seenIns = field.fieldProductSeenIn(elem.id, productSeenIn.trim());
            AllData.push(seenIns);
          }

          // if(productReviewText)
          if (productReviewText) {
            let pRtext = field.fieldReview_Section(elem.id, productReviewText.trim());
            AllData.push(pRtext);
          }
        });

        //=======================================//
        // first update exsting record
        //=======================================//

        /************************************************** */
        // multiple request manage
        /************************************************** */
        let addData = await saveAllrecordOneByOne(AllData);



        /************************************************** */
        //multiple request manage
        /************************************************** */

        AllData.map((mp, keymp) => {
          addData[keymp].ownerId = mp.ownerId;
        });
        // get save data
        let gplQuery = SEARCH_PRODUCTS_BY_IDS(deleteRequest);
        // save data on shopify database
        let getSavedData = await getProductListById(gplQuery)

        collectDeleteID?.map(async (deleteID, deleteIDIndex) => {
          // delete request 
          let deleAprove = await mutationGlq(gqLQuery, { input: { id: deleteID } })
        });
        let response = {};
        response.pairdata = getSavedData?.text?.body?.data?.nodes
        response.actualdata = addData
        response.id = +router.query.slug
        response.ids = id.join(" ")

        // data save in local database
        await updateRecords(response)
        fetchContent()
        setLoader(false);

        Swal.fire({
          title: "Successfully delete..",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Opps! something wen wrong!😊2",
          icon: "warning",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Opps! something wen wrong!😊1",
        icon: "warning",
      });
    }
  };


  const add_product_showArea = () => {
    debugger

    let index = 0
    let wholeData = responseData.text.pairdata

    let gridImage2 = []
    if (
      wholeData[index]?.product_grid_image?.value !== undefined &&
      wholeData[index]?.product_grid_image?.value !== ""
    ) {
      gridImage2.push(wholeData[index]?.product_grid_image?.value)
      setGridImage([{ id: wholeData[index]?.product_grid_image?.value }]);
    } else {
      setGridImage([]);
    }
    let formattoSeenIn = [];

    if (
      wholeData[index]?.seen_in?.value != "" &&
      wholeData[index]?.seen_in?.value != undefined
    ) {
      console.log(
        wholeData[index]?.seen_in?.value,
        " wholeData[index]?.seen_in?.value"
      );

      JSON.parse(wholeData[index]?.seen_in?.value).map(
        (formatSeen, formatSeenIndex) => {
          formattoSeenIn.push({ id: formatSeen });
        }
      );
      setSeenIn(formattoSeenIn);
      setSeenInpre(formattoSeenIn);
    }

    setfillEdit({
      paragraph: [responseData?.text][0]?.paragraph,
      reviewText: [responseData?.text][0]?.reviewText,
      heading: [responseData?.text][0]?.heading,
      formattoSeenIn: formattoSeenIn,
      product_grid_image: gridImage2,
    })


    setAddProductShowArea((prev) => !prev);
    setEditUpdate(false);
    setIndexUpdate(-1);
    setSelectedProduct([]);
    setFinalScreen(false);

    setParagraph("");
    setreviewText("");
    setHeading("");
    setGridImage("");
    setSeenIn([]);
    setSeenInpre([]);
  };

  /********************************************************************/
  /********************************************************************/
  /********************************************************************/

  // const select_product = async (e, Itemdata, id) => {
  //   debugger
  //   id = id.join("");
  //   setSelectedDiv(id);
  //   setSelectedRough(Itemdata);
  //   setSelectedProduct([Itemdata]);

  //   await fetch("/api/existing", {
  //     method: "POST",
  //     body: JSON.stringify(Itemdata),
  //   })
  //     .then((response) => response.json())
  //     .then(async (data) => {
  //       if (data.status === 200) {
  //         if (data.data === null) {
  //           // hide search area
  //           setAddProductShowArea(false);
  //           setFinalScreen(true);
  //         } else {
  //           // duplicate
  //           Swal.fire({
  //             title: "Product already associated with other pair.👻",
  //             text: "Please assign swatches to selected products!",
  //             icon: "warning",
  //           });
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };


  /********************************************************************/
  /********************************************************************/
  /********************************************************************/






  /********************************************************************/
  /************************Save and reset pairs ***********************/
  /********************************************************************/

  const edittmbAction = (e, index, handle, wholeData, alld) => {

    setSelected_for_deletion(alld)
    setSelected_index_for_deletion(index)

    setFinalScreen(true);
    setAddProductShowArea(false);
    setIndexUpdate(index);
    setSelectedProduct([wholeData[index]]);
    setEditUpdate(true);

    // setSelectedThumbs([]);

    setParagraph([responseData?.text][0]?.paragraph);
    setreviewText([responseData?.text][0]?.reviewText);
    setHeading([responseData?.text][0]?.heading);


    if (
      wholeData[index]?.product_grid_image?.value !== undefined &&
      wholeData[index]?.product_grid_image?.value !== ""
    ) {
      setGridImage([{ id: wholeData[index]?.product_grid_image?.value }]);
    } else {
      setGridImage([]);
    }

    let formattoSeenIn = [];
    if (
      wholeData[index]?.seen_in?.value != "" &&
      wholeData[index]?.seen_in?.value != undefined
    ) {
      console.log(
        wholeData[index]?.seen_in?.value,
        " wholeData[index]?.seen_in?.value"
      );


      JSON.parse(wholeData[index]?.seen_in?.value).map(
        (formatSeen, formatSeenIndex) => {
          formattoSeenIn.push({ id: formatSeen });
        }
      );
      setSeenIn(formattoSeenIn);
      setSeenInpre(formattoSeenIn);
    }

    setfillEdit({
      paragraph: [responseData?.text][0]?.paragraph,
      reviewText: [responseData?.text][0]?.reviewText,
      heading: [responseData?.text][0]?.heading,
      formattoSeenIn: formattoSeenIn,
      product_grid_image: gridImage
    })

  };


  const updatePairs = async () => {
    setLoader(true);
    let images = "";
    let pvarient = "";
    let ids = "";

    let existingData = JSON.parse(pairs[0]?.pairdata);

    if (typeof existingData === "object" && Math.sign(indexUpdata) !== -1) {
      let actualData = JSON.parse(pairs[0]?.actualdata);

      let productVr = actualData[0]?.value;
      let sw = actualData[1]?.value;
      productVr = productVr.replace(/\s\s+/g, " ");
      sw = sw.replace(/\s\s+/g, " ");

      //check product length in js
      let checkProductLength = productVr.split(" ");
      let checkImagesLength = sw.split(" ");

      // if product & images mismatch
      if (checkProductLength.length != checkImagesLength.length) {
        let sliceEle =
          parseInt(checkProductLength.length) -
          parseInt(checkImagesLength.length);
        checkImagesLength = checkImagesLength.slice(0, sliceEle);
        sw = checkImagesLength.join(" ");
      }

      if (selectedThumbs.length > 0) {
        selectedThumbs.forEach((Imgelem, index) => {
          images += ` ${Imgelem.image.originalSrc.split("/").pop().split("?")[0]
            }`;
        });

        selectedProduct.forEach((pv, pvindex) => {
          pvarient += `/products/${pv.handle} `;
        });

        productVr = actualData[0]?.value;
        let productSw = sw.split(" ");

        productSw[indexUpdata] = images;
        sw = productSw.join(" ").trim(" ");
      }

      selectedProduct.forEach((pv, pvindex) => {
        ids += `${pv.id} `;
      });

      await updateDataShopifyAndDatabase(existingData, productVr, sw, "");
      // setIndexUpdate(-1)
      setLoader(false);
    } else {
      Swal.fire({
        title: "Opps! something went wrong.👻",
        text: "Please assign swatches to selected products!",
        icon: "warning",
      });
    }
  };

  const updateDataShopifyAndDatabase = async (
    mergeData,
    newVaiant,
    newSwatch,
    ids = ""
  ) => {
    let AllData = [];
    let deleteFieldList = []

    let oldIds = "";
    mergeData.forEach((elem, index) => {
      oldIds += elem.id;

      /************************************/ // variant
      if (newVaiant !== "") {
        let veriant = fieldProductVariant(elem.id, newVaiant.trim());
        AllData.push(veriant);
      }
      /**********************************/ // swatches
      if (newSwatch !== "") {
        let swatches = fieldProductSwatch(elem.id, newSwatch.trim());
        AllData.push(swatches);
      }

      /**********************************/ // heading
      if (heading != "") {
        let pHeding = fieldProductHeading(elem.id, heading.trim());
        AllData.push(pHeding);
      } else {
        setHeading("_")
        let pHeding = fieldProductHeading(elem.id, "_");
        AllData.push(pHeding);
      }
      /**********************************/ // paragraph 

      if (paragraph != "") {
        let pParagraph = fieldProductParagraph(elem.id, paragraph.trim());
        AllData.push(pParagraph);
      } else {
        setParagraph('_');
        let pParagraph = fieldProductParagraph(elem.id, '_');
        AllData.push(pParagraph);
      }
      /**********************************/ // grid images
      if (gridImage.length > 0) {
        let gridImg = fieldProductGridImage(elem.id, gridImage[0]?.id);
        AllData.push(gridImg);
      }
      /**********************************/ // seenIn
      if (seenIn.length > 0) {
        let seenInString = [];
        seenIn.map((sn) => {
          seenInString.push(sn.id);
        });
        let unique = [...new Set(seenInString)];
        let seenIns = fieldProductSeenIn(elem.id, JSON.stringify(unique));
        AllData.push(seenIns);
      }

      /****************************** */ // review text
      if (reviewText != "") {
        let pReviewText = fieldReview_Section(elem.id, '-');
        AllData.push(pReviewText);
      } else {
        setreviewText('_')
        let pReviewText = fieldReview_Section(elem.id, "_");
        AllData.push(pReviewText);
      }
    });


    try {

      // let updatedRecord = await addUpdateMetaFields(AllData)
      // let addData = updatedRecord?.data?.metafieldsSet?.metafields;

      /************************************************** */
      // multiple request manage
      /************************************************** */
      let addData = [];
      if (AllData.length / 25 > 1) {
        let totalLength = AllData.length / 25;
        for await (const x of Array(Math.ceil(totalLength)).keys()) {
          let updatedRecord = await addUpdateMetaFields(
            paginate(AllData, 25, x + 1)
          );
          let repeatRecord = updatedRecord?.data?.metafieldsSet?.metafields;
          0;
          merge(addData, repeatRecord);
        }
      } else {
        let updatedRecord = await addUpdateMetaFields(AllData);
        addData = updatedRecord?.data?.metafieldsSet?.metafields;
      }
      /************************************************** */
      //multiple request manage
      /************************************************** */

      AllData.map((mp, keymp) => {
        addData[keymp].ownerId = mp.ownerId;
      });

      let iii = await getExistingMetaField(
        slug,
        SEARCH_PRODUCTS_BY_IDS(mergeData),
        addData,
        heading,
        paragraph,
        oldIds,
        reviewText
      );

      setPairs([iii?.data]);

      setLoader(false);
      restProduct();

      Swal.fire({
        title: "Good job! 😊",
        text: "Field updated successfully !",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Something went wrong 😊",
        text: "Please recheck and try again!".error,
        icon: "warning",
      });
    }
  };

  const savepairs = async () => {
    if (selectedThumbs.length === selectedProduct.length) {
      setLoader(true);

      let images = "";
      selectedThumbs.forEach((Imgelem, index) => {
        images += ` ${Imgelem.image.originalSrc.split("/").pop().split("?")[0]
          }`;
      });

      let pvarient = "";
      let ids = "";
      selectedProduct.forEach((pv, pvindex) => {
        pvarient += `/products/${pv.handle} `;
        ids += `${pv.id} `;
      });

      let mergeData = JSON.parse(pairs[0]?.pairdata);
      let actualdata = JSON.parse(pairs[0]?.actualdata);

      let newVaiant = actualdata[0]?.value + " " + pvarient;
      let newSwatch = actualdata[1]?.value + "" + images;

      mergeData.push(selectedRough);

      // update data in shopify also database

      await updateDataShopifyAndDatabase(mergeData, newVaiant, newSwatch, ids);
    } else {
      Swal.fire({
        title: "Opps! something went wrong.👻",
        text: "Please assign swatches to selected products!",
        icon: "warning",
      });
    }
  };

  const restProduct = (reload = '') => {

    setAddProductShowArea(true);
    setSelectedProduct([]);
    setSelectedThumbs([]);
    setFinalScreen(false);
    setParagraph("");
    setreviewText("");
    setHeading("");
    setGridImage([]);
    setSeenIn([]);
    setSeenInpre([]);
    if (reload === 'reload') {
      fetchContent()
    }
  };

  return (
    <>
      {loader ? (<> <div className="tmb-full-page-Loder">
        <Spinner />
      </div></>) : ''}


      {/* loading screen */}
      {(typeof responseData == 'string') && <Loader />}
      {/* loading screen */}

      {/* 404 screen */}
      {(responseData.status != 200) && <PairNotFound responseData={responseData} />}
      {/* 404 screen */}

      {/* ========================================================================= */}
      {/* =============================    Inital Screen    ======================= */}
      {/* ========================================================================= */}

      {(typeof responseData == 'object' && responseData.status == 200) && <Page
        title={`${responseData?.text?.title}`}
        backAction={{
          content: "Home",
          onAction: () => { router.push("/debug/data") },
        }}
        fullWidth
      >
        <Grid>
          {[responseData?.text].map((vl, key) => {
            const allP = vl.pairdata;
            const metaFields = vl.actualdata;

            return (
              <Grid.Cell
                key={`${(vl.id + key).toString()}-outer-loop`}
                columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}

              >

                <div className="main-edit-outer">
                  <Card title={vl.title} padding={8}>
                    <HorizontalGrid columns={5} gap={5}>
                      {allP.map((cVL, cKEY) => {
                        return (
                          <Tooltip content={cVL?.handle} key={`${cKEY}--keys`}>
                            <div key={cVL.handle} content={cVL.title}>
                              <Text variant="bodyMd" fontWeight="bold" as="span">
                                <HorizontalGrid columns={2} >
                                  <a
                                    href={"#"}
                                    onClick={(e) =>
                                      deleteAction(e, cKEY, cVL?.handle, allP)
                                    }
                                  >
                                    <Icon source={DeleteMajor} color="base" />
                                  </a>

                                  <a
                                    href={"#"}
                                    onClick={(e) => { edittmbAction(e, cKEY, cVL?.handle, allP, metaFields) }
                                    }
                                  >
                                    <Icon source={EditMajor} color="base" />
                                  </a>
                                </HorizontalGrid>

                                <img
                                  src={cVL?.images?.edges[0]?.node?.originalSrc}
                                  height={100}
                                  width={100}
                                  alt={vl.title}
                                  style={{ marginTop: "10px" }}
                                />
                              </Text>
                            </div>
                          </Tooltip>
                        );
                      })}

                      <div content="">
                        <Text variant="bodyMd" fontWeight="bold" as="span">
                          <Button primary onClick={() => add_product_showArea()}>
                            Add New
                          </Button>

                        </Text>
                      </div>
                    </HorizontalGrid>
                  </Card>
                </div>
              </Grid.Cell>
            );
          })}


          {/* ========================================================================= */}
          {/* =============================== show search area ======================== */}
          {/* ========================================================================= */}

          {addproductshowArea === true && (
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <SearchProduct
                setFinalScreen={setFinalScreen}
                selectedDiv={selectedDiv}
                setSelectedDiv={setSelectedDiv}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                setAddProductShowArea={setAddProductShowArea}
              />
            </Grid.Cell>
          )}


          {/* ========================================================================= */}
          {/* =============================== Show Final step ======================== */}
          {/* ========================================================================= */}
          {(finalScreen == true && selectedProduct.length > 0) &&
            (<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
              <BuildForm
                val={selectedProduct[0]}
                key={selectedProduct.length}
                slp={selectedProduct}
                restProduct={restProduct} editUpdata={editUpdata}
                thumbs={[selectedThumbs, setSelectedThumbs]}
                saveType="add"
                /// slug page 
                editANDupdate={{
                  fillEdit: fillEdit,
                  allPairs: [responseData?.text][0]?.pairdata,
                  actualdata: [responseData?.text][0]?.actualdata,
                  indexUpdata: indexUpdata,
                  pairid: router.query.slug
                }}
              /></Grid.Cell>)

          }







        </Grid>

      </Page>}

    </>
  );
}

export default Singlepair;
