import React, { use, useEffect, useState } from "react";
import {
  Card,
  Grid,
  Page,
} from "@shopify/polaris";
import { useRouter } from "next/router";
import SearchProduct from "@/components/common/searchProduct";
import BuildForm from "@/components/common/form";



const CreatePair = () => {
  const [product, setProduct] = useState([]);
  const [loader, setLoader] = useState(false);
  const [p_loader, setPLoader] = useState(false);
  const [modalController, setModalController] = useState(false);
  const [imageFor, setImageFor] = useState(-1);
  const [variant, setVariant] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedThumbs, setSelectedThumbs] = useState([]);
  const [finalScreen, setFinalScreen] = useState(false);
  const [selectedDiv, setSelectedDiv] = useState([]);
  const [addproductshowArea, setAddProductShowArea] = useState(false);

  //* metafield value**/

  const [paragraph, setParagraph] = useState("");
  const [heading, setHeading] = useState("");
  const [collection_title, setCollection] = useState("");
  const [imageRecognition, setRecognition] = useState("");
  const [gridImage, setGridImage] = useState([]);
  const [seenIn, setSeenIn] = useState([]);
  const [reviewText, setreviewText] = useState("");


  const restProduct = () => {
    setSelectedDiv([]);
    setSelectedProduct([]);
    setSelectedThumbs([]);
    setParagraph("");
    setHeading("");
    setCollection("");
    setGridImage([]);
    setSeenIn([]);
    setreviewText("");
  };


  const router = useRouter();
  return (
    <Page
      title="Add New"
      backAction={{ content: "Home", onAction: () => router.push("/debug/") }}
      fullWidth
    >
      <Grid>
        <Grid.Cell
       
          columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
        >
         <SearchProduct 
            setFinalScreen={setFinalScreen} 
            selectedDiv={selectedDiv}
            setSelectedDiv={setSelectedDiv}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            setAddProductShowArea={setAddProductShowArea} 
            multipleSelect={true} 
          />
          
        </Grid.Cell>
        <Grid.Cell
          columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
        >
      {/* ========================================================================= */}
      {/* =============================== Show Final step ======================== */}
      {/* ========================================================================= */} 

      {(finalScreen === true &&  selectedProduct.length > 0) &&
           (<BuildForm 
            val={selectedProduct[0]} 
            key={0} 
            slp={selectedProduct} 
            multiple={true} 
            restProduct={restProduct} 
            thumbs={[selectedThumbs,setSelectedThumbs]}
            saveType="new"
            />)
      }
                     

        </Grid.Cell>
      </Grid>
    </Page>
  );
};

export default CreatePair;
