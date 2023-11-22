import {
  Card,
  Grid,
  TextField,
  Button,
  PageActions,
  Text,
  HorizontalGrid,
  Frame,
  Loading
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";

import GalleryModal from "@/components/common/galleryPopup";
import C_loader from "./loader";
import * as field from "@/libs/Field";
import Swal from "sweetalert2";
import { SEARCH_PRODUCTS_BY_IDS, updateMetaFields } from "@/libs/gql_query";
import { saveAllrecordOneByOne, updateRecords,getProductListById } from "@/libs/core";
const BuildForm = ({
   val, key = 0, 
   slp, 
   editUpdata = false,
   multiple = false,
   restProduct,
   thumbs,
   saveType,
   editANDupdate = {
    fillEdit : {},
    allPairs : [],
    actualdata : [],
    indexUpdata : 0,
    pairid : -1
   }
 }) => {
  


  const [loader, setLoader] = useState(false);

  const [paragraph, setParagraph] = useState("");
  const [reviewText, setreviewText] = useState("");
  const [heading, setHeading] = useState("");
  const [imageRecognition, setRecognition] = useState("");
  const [gridImage, setGridImage] = useState([]);
  const [seenIn, setSeenIn] = useState([]);
  const [seenInpre, setSeenInpre] = useState([]);
  const [modalController, setModalController] = useState(false);
  const [imageFor, setImageFor] = useState(-1);
  const [collection_title, setCollection] = useState("");


  const selectedThumbs = thumbs[0]
  const setSelectedThumbs = thumbs[1]
  
  useEffect(()=>{

    if (Object.keys(editANDupdate.fillEdit).length > 0){
      debugger
      for (const [key, value] of Object.entries(editANDupdate.fillEdit)) {
        if(key == 'paragraph')
          setParagraph(value)
        else if(key == 'heading')
          setHeading(value)
        else if(key == 'reviewText')
          setreviewText(value)
        else if(key == 'product_grid_image')
          setGridImage(value)
        else if(key == 'formattoSeenIn'){
          setSeenIn(value)
          setSeenInpre(value)
        }
      }
    }

  },[editANDupdate?.fillEdit])

  const buildField = (images,pvarient,selectedProduct) => {
    debugger
      /// collect all data
      let AllData = [];
      selectedProduct.forEach((elem, index) => {
        /************************************/ // variant
        let veriant = field.fieldProductVariant(elem.id, pvarient.trim());

        /**********************************/ // swatches
        let swatches = field.fieldProductSwatch(elem.id, images.trim());
        AllData.push(veriant, swatches);

        /**********************************/ // heading
        if (heading != "") {
          let hdng = heading.trim()
          if(hdng == '') hdng = '-'
          let pHeding = field.fieldProductHeading(elem.id, hdng);
          AllData.push(pHeding);
        }
        /**********************************/ // paragraph
        if (paragraph != "") {
          let pgrph = paragraph.trim();
          if(pgrph == '') pgrph = '-'
          let pParagraph = field.fieldProductParagraph(elem.id, pgrph);
          AllData.push(pParagraph);
        }

        /**********************************/ // grid images

        if (gridImage !== undefined && gridImage.length > 0) {
          let gridImg;

          if(typeof gridImage[0] === 'string'){
            gridImg = field.fieldProductGridImage(elem.id, gridImage[0]);
          }else{
            gridImg = field.fieldProductGridImage(elem.id, gridImage[0]?.id);
          }
          AllData.push(gridImg);
        }
        /**********************************/ // seenIn
        if (seenIn.length > 0) {
          let seenInString = [];
          seenIn.map((sn) => {
            seenInString.push(sn.id);
          });
          let seenIns = field.fieldProductSeenIn(
            elem.id,
            JSON.stringify(seenInString)
          );
          AllData.push(seenIns);
        }

        /**********************************/ // paragraph
        if (reviewText != "") {
          let rtext = reviewText.trim();
          if(rtext == '') rtext = '-'
          let pReviewText = field.fieldReview_Section(elem.id, rtext);
          AllData.push(pReviewText);
        }
      });

      return {AllData, heading, paragraph, reviewText};
  }


  const updatePairs = async () => {
    let images,pvarient,ids = '';
    let existingData = editANDupdate.allPairs;
    if (typeof existingData === "object" && Math.sign(editANDupdate.indexUpdata) !== -1) {
      let actualData = editANDupdate.actualdata;
      

      let productVr = (actualData[0]?.value)?.replace(/\s\s+/g, " ");
      let sw = (actualData[1]?.value)?.replace(/\s\s+/g, " ");
      let checkProductLength = productVr.split(" ");
      let checkImagesLength = sw.split(" ");


      let selectedProduct = slp
      // if product & images mismatch
      // if product & images mismatch
      if (checkProductLength.length != checkImagesLength.length) {
        let sliceEle =  parseInt(checkProductLength.length) - parseInt(checkImagesLength.length);
        checkImagesLength = checkImagesLength.slice(0, sliceEle);
        sw = checkImagesLength.join(" ");
      }

      if (selectedThumbs.length > 0) {
        let images = '';
        selectedThumbs.forEach((Imgelem, index) => {
          images += `${Imgelem?.image?.originalSrc?.split("/").pop().split("?")[0]}`;
        });

        selectedProduct.forEach((pv, pvindex) => {
          pvarient += `/products/${pv.handle} `;
        });

        productVr = actualData[0]?.value;
        let productSw = sw.split(" ");

        productSw[editANDupdate.indexUpdata] = images;
        sw = productSw.join(" ").trim(" ");
      }

      setLoader(true);
     // build formdata 
     let AllData = buildField(sw,productVr,existingData);

     // save data on shopify by gql
     let  addData = await saveAllrecordOneByOne(AllData.AllData);
         
     AllData?.AllData?.map((mp, keymp) => {
       addData[keymp].ownerId = mp.ownerId;
     });

     // get save data
     let gplQuery =  SEARCH_PRODUCTS_BY_IDS(existingData);
     let getSavedData = await getProductListById(gplQuery)
      
     let response = {};
     response.pairdata = getSavedData?.text?.body?.data?.nodes
     response.actualdata = addData
     response.id = +editANDupdate.pairid
     response.paragraph = AllData?.paragraph ? AllData?.paragraph : ''
     response.heading = AllData?.heading ? AllData?.heading : ''
     response.reviewText = AllData?.reviewText ? AllData?.reviewText : ''

     // save data again in local database 
     await  updateRecords(response)
     restProduct('reload');
     setLoader(false);
     
     Swal.fire({
       title: "Good job! 😊",
       text: "Field updated successfully !",
       icon: "success",
     });

    }

  };


  const addNewItemInPairs = async () =>{
    debugger
    if (selectedThumbs.length === slp.length) {
        setLoader(true);

        // =================== build swatches
        let images = "";
        selectedThumbs.forEach((Imgelem, index) => {
          images += ` ${Imgelem.image.originalSrc.split("/").pop().split("?")[0]}`;
        });
        images = editANDupdate.actualdata[1].value + images
        // =================== build product variant
        let pvarient = "";
        let ids = "";
        let selectedProduct = slp
        let existing = editANDupdate.allPairs
        existing.push(selectedProduct[0])
        existing.forEach((pv, pvindex) => {
          pvarient += `/products/${pv.handle} `;
          ids += `${pv.id} `;
        });


        let AllData = buildField(images.trim(),pvarient.trim(),existing)

        let gplQuery =  SEARCH_PRODUCTS_BY_IDS(existing);

        
        let  addData = await saveAllrecordOneByOne(AllData.AllData);
         
        AllData?.AllData?.map((mp, keymp) => {
          addData[keymp].ownerId = mp?.ownerId;
        }); 


        let getSavedData = await getProductListById(gplQuery)
        let response = {}
        response.pairdata = getSavedData?.text?.body?.data?.nodes
        response.actualdata = addData
        response.id = +editANDupdate.pairid
        response.ids = ids
        
        // save data again in local database 
        await  updateRecords(response)
      
       setLoader(false);
       restProduct('reload')
       Swal.fire({
        title: "Good Job.👻",
        text: "Pair successfully updated",
        icon: "success",
      });
    } else{
      setLoader(false);

      Swal.fire({
        title: "Opps! something went wrong.👻 ",
        text: "Collection Title / Swatches are mandatory...",
        icon: "warning",
      });
    }
  }
 

  const savepairs = async (type = 'new') => {
    if(saveType == 'add'){
      addNewItemInPairs()
      return;
    }
  
    if(collection_title === ''){
      Swal.fire({
        title: "Opps! something went wrong.👻",
        text: "Please fill collection title field..",
        icon: "warning",
      });
      return
    }
    if (selectedThumbs.length === slp.length) {
      setLoader(true);

      // =================== build swatches
      let images = "";
      selectedThumbs.forEach((Imgelem, index) => {
        images += ` ${
          Imgelem.image.originalSrc.split("/").pop().split("?")[0]
        }`;
      });

      // =================== build product variant
      let pvarient = "";
      let ids = "";
      let selectedProduct = slp
      selectedProduct.forEach((pv, pvindex) => {
        pvarient += `/products/${pv.handle} `;
        ids += `${pv.id} `;
      });


      let gplQuery =  SEARCH_PRODUCTS_BY_IDS(selectedProduct);


      let AllData = buildField(images,pvarient,selectedProduct)
      let saveData = {
        ids: ids,
        pairdata: selectedProduct,
        actualdata: AllData.AllData,
        heading: AllData.heading,
        paragraph: AllData.paragraph,
        reviewText: AllData.reviewText,
        pairdata : '',
        title: collection_title ,
      }
      await fetch("/api/apps/pairs/save-pairs", {
        method: "POST",
        body: JSON.stringify(saveData),
      }).then(res => res.json())
      .then(async (response)=>{
         

          let  addData = await saveAllrecordOneByOne(AllData.AllData);
         
          AllData?.AllData?.map((mp, keymp) => {
            addData[keymp].ownerId = mp.ownerId;
          });


          let getSavedData = await getProductListById(gplQuery)
          
          response.text.pairdata = getSavedData?.text?.body?.data?.nodes
          response.text.actualdata = addData
          // save data again in local database 
          await  updateRecords(response.text)
        
         setLoader(false);
         restProduct()

          Swal.fire({
            title: "Good Job.👻",
            text: "Pair created successfully ",
            icon: "success",
          });
          
      })



    }else{
      setLoader(false);

      Swal.fire({
        title: "Opps! something went wrong.👻",
        text: "Collection Title / Swatches are mandatory...",
        icon: "warning",
      });
    }
  };




  

  const handleChange = (event, index) => {
    setRecognition("swatch");
    if (index === undefined)
      //  if index return undefine then set -1
      setImageFor(-1);
    else setImageFor(index);
    setModalController(!modalController);
  };

  const selectGridImage = () => {
    setRecognition("grid");
    setModalController(!modalController);
  };

  const asseenin = () => {
    setRecognition("seen");
    setModalController(!modalController);
  };

  const selectImages = (key, img) => {
    if (imageRecognition == "swatch") {
      selectedThumbs[key] = img;
    } else if (imageRecognition == "grid") {
      setGridImage([img]);
    } else if (imageRecognition == "seen") {
      if (seenInpre.length > 0) {
        setSeenIn([]);
        setSeenInpre([]);
      }
      setSeenIn((old) => [...old, img]);
    }
  };


  return (
    <>
    <Frame>
      { loader === true ? (<><Loading/><C_loader/></>) : ''}

      <Grid.Cell
       
        columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}
      >
        <Card sectioned>
          <Text as="strong" variant="bodyLg">
            {val?.title}
          </Text>
          <br />
          <br />

          <Grid>
            
          { (saveType === 'new') &&
          <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
               <TextField
                      name="collectiontitle"
                      type="text"
                      placeholder="Add title"
                      label="Collection Title"
                      onChange={(e) => setCollection(e)}
                      value={collection_title}
                    />
            </Grid.Cell>
          }
          

            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <TextField
                label="Product Grid Paragraph"
                multiline={4}
                autoComplete="off"
                onChange={(e) => setParagraph(e)}
                value={paragraph}
              />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <TextField
                label="Review Text"
                multiline={4}
                autoComplete="off"
                onChange={(e) => setreviewText(e)}
                value={reviewText}
              />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <TextField
                name="collectiontitle"
                type="text"
                placeholder="Add title"
                label="Product Grid Heading"
                onChange={(e) => setHeading(e)}
                value={heading}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <Button onClick={selectGridImage} primary>
                Product Grid Image
              </Button>
              {gridImage.length > 0 && (
                <>
                  <img src={gridImage[0]?.image?.originalSrc} width={60} />
                </>
              )}
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
              <Button onClick={asseenin} primary>
                Seen in
              </Button>
              {seenIn.length > 0 &&
                seenIn.map((imges, imageKey) => {
                  return (
                    <>
                      <img
                        key={"images-" + imageKey.toString()}
                        src={imges?.image?.originalSrc}
                        width={60}
                      />
                    </>
                  );
                })}
            </Grid.Cell>
          </Grid>

          <div style={{ height: "30px" }}></div>
          {multiple ? (
            <>
              <HorizontalGrid columns={5} gap={2}>
                {" "}
                {slp?.map((val, key) => {
                  return (
                    <>
                      <div className="tmb_img_wrapper">
                        <Card
                          title={val?.title}
                          sectioned
                          key={`sl_-new-entry`}
                        >
                          <img
                            src={val?.images?.edges[0]?.node.originalSrc}
                            height="90px"
                          />
                          {selectedThumbs[key] !== undefined && (
                            <> 
                              <img
                                src={selectedThumbs[key]?.image?.originalSrc}
                                height="90px"
                              />
                            </>
                          )}
                          <Button onClick={(e) => handleChange(e, key)}>
                            {selectedThumbs[key]?.image?.originalSrc !==
                            undefined
                              ? "Change"
                              : "Add"}
                          </Button>
                        </Card>
                      </div>
                    </>
                  );
                })}
              </HorizontalGrid>
            </>
          ) : (
            <>
            
              <img
                src={val?.images?.edges[0]?.node.originalSrc}
                height="90px"
              />

              {selectedThumbs[key] !== undefined && (
                <>
                  <img
                    src={selectedThumbs[key]?.image?.originalSrc}
                    height="90px"
                  />{" "}
                </>
              )}
              <Button onClick={(e) => handleChange(e, key)} primary>
                {selectedThumbs[key]?.image?.originalSrc !== undefined
                  ? "Change"
                  : "Add"}
              </Button>
            </>
          )}

          {slp.length > 0 && (
            <PageActions
              primaryAction={{
                content: editUpdata ? "Update" : "Save",
                onAction: ()=> {editUpdata ? updatePairs() : savepairs()},
              }}
              secondaryActions={[
                {
                  content: "Cancel",
                  destructive: true,
                  onAction: ()=> {restProduct()},
                },
              ]}
            />
          )}
        </Card>
      </Grid.Cell>

      <GalleryModal
        active={modalController}
        handleChange={handleChange}
        selectImages={selectImages}
        imageFor={imageFor}
      />
    </Frame>
    </>
  );
};

export default BuildForm;
