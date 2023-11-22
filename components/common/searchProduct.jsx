import React, { useEffect, useState, useCallback } from "react";
import {
    Card,
    Grid,
    Form,
    TextField,
    Text,
    FormLayout,
    HorizontalGrid,
    Toast,
    Frame,
    Loading
} from "@shopify/polaris";
import Swal from "sweetalert2";

import { SEARCH_PRODUCTS_BY_TITLE } from "@/libs/gql_query";


const SearchProduct = ({ setFinalScreen, setSelectedDiv,selectedDiv,setAddProductShowArea, selectedProduct, setSelectedProduct, multipleSelect = false }) => {
      

    const [search, setSearch] = useState("");
    const [loader, setLoader] = useState(false);
    const [product, setProduct] = useState([]);
    const [active, setActive] = useState(false);
    const [selectedRough, setSelectedRough] = useState([]); // product rough


    useEffect(() => {
        let timerId;
        if (search != '') {
            setLoader(true)
            timerId = setTimeout(() => {
                (async () => {
                    let keyword = SEARCH_PRODUCTS_BY_TITLE().replace("SEARCHTERM", search);
                    const postOptions = {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify({ content: keyword }),
                    };
                    let result = await fetch('/api/apps/debug/gql', postOptions).then(res => res.json())
                    setLoader(false);
                    setProduct(result?.text?.body.data?.products?.edges);
                })()
            }, 800);
            return () => clearTimeout(timerId);

        } else {
            setProduct([]);
            setLoader(false);

        }

    }, [search])

    const select_product = async (e, Itemdata, id) => {
        id = id.join("");
        
        if(!multipleSelect){
            setSelectedDiv(id);
            setSelectedRough(Itemdata);
            setSelectedProduct([Itemdata]);
        }

        setLoader(true)
        await fetch("/api/apps/pairs/existing", {
            method: "POST",
            body: JSON.stringify(Itemdata),
        })
            .then((response) => response.json())
            .then(async (data) => {
                setLoader(false)
                if (data.status === 200 && (data.text).length === 0) {
                    if ((data.text).length === 0) {
                        // hide search area
                        if(multipleSelect){
                               //================== multi Select ====================// 
                               //================== multi Select ====================// 
                             

                               setSelectedProduct((pre) => {
                                return [...pre, Itemdata];
                              });

                              let counter = 1;
                               selectedProduct?.map(async (ele, ind) => {
                                if (ele.id.match(/\d/g).join("") === id) {
                                  counter++;
                                  if (counter > 1) {
                                    let newV = await selectedProduct.filter((e) => {
                                      return e.id.match(/\d/g).join("") !== id;
                                    });
                                    setSelectedProduct(newV);
                                  }
                                }
                              });      
                              
                              setSelectedDiv((pre) => {
                                return [...pre, id];
                              });
                  
                               selectedDiv?.map(async (ele, ind) => {
                                if (ele === id) {
                                  let newD =  selectedDiv.filter((e) => {
                                    return e !== id;
                                  });
                                  setSelectedDiv(newD);
                                }
                              });
  
                         //================== multi Select ====================// 
                         //================== multi Select ====================//

                        }
                        setAddProductShowArea(false);
                        setFinalScreen(true);
                        
                    } else {
                        // duplicate
                        Swal.fire({
                            title: "Product already associated with other pair.👻",
                            text: "Please assign swatches to selected products!",
                            icon: "warning",
                        });
                    }
                }else{
                    Swal.fire({
                        title: "Product already associated with other pair.👻",
                        text: "Please assign swatches to selected products!",
                        icon: "warning",
                    });
                }
            })
            .catch((error) => {
                setLoader(false)

                console.error("Error:", error);
            });
    };

    const toggleActive = useCallback(() => setActive((active) => !active), []);


    return (
        <Frame>


            {loader && <Loading />}

            <Card>
                <Toast content="Message sent" onDismiss={toggleActive} duration={400} />
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Form>
                        <FormLayout>
                            <Text variant="bodyLg" as="h2" >Seach Product</Text>
                            <TextField
                                onChange={(e) => setSearch(e)}
                                label=""
                                type="text"
                                value={search}
                                helpText={<span>&nbsp;</span>}
                            />
                            <HorizontalGrid columns={4} gap={2}>
                                {product.map((elements, index) => {

                                    return (

                                        <div
                                            key={"product-s-" + index}
                                            onClick={(e) =>
                                                select_product(
                                                    e,
                                                    elements.node,
                                                    elements.node?.id.match(/\d/g)
                                                )
                                            }
                                            className={`tmb_grid ${selectedDiv.includes(
                                                elements.node?.id.match(/\d/g).join("")
                                            )
                                                ? "activeClass"
                                                : ""
                                                }`}
                                        >
                                            <Card sectioned >
                                                <img
                                                    src={
                                                        elements.node?.images?.edges[0]?.node.originalSrc
                                                    }
                                                    height="90px"
                                                />
                                                <Text>{elements.node.title}</Text>

                                            </Card>
                                        </div>

                                    );
                                })}
                            </HorizontalGrid>

                            {(product.length === 0 && search.length > 0 || search == "") && (
                                <>
                                    <Grid.Cell
                                        columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                                    >
                                        <Card sectioned>
                                            <Text variant="heading2xl" as="h3" alignment="center">
                                                Search Results for: "{search}"
                                            </Text>
                                            <Text
                                                variant="bodyLg"
                                                alignment="center"
                                                as="p"
                                                style={{ mrginTop: "100px" }}
                                            >
                                                It seems we can't find what you're looking for.
                                            </Text>
                                        </Card>
                                    </Grid.Cell>
                                </>
                            )}
                        </FormLayout>
                    </Form>
                </Grid.Cell>
            </Card>
        </Frame>
    );
};

export default SearchProduct;
