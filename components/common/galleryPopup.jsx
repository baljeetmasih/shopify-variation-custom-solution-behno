import {
  Button,
  Grid,
  Modal,
  Frame,
  Container,
  TextField,
  Card,
  VerticalStack,
  Thumbnail,
  HorizontalGrid,
  Spinner,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import gql from "graphql-tag";

import { GETMEDIAS } from "@/libs/gql_query";

const GalleryModal = (props) => {
  const [searchTerm, setSearchterm] = useState("");
  const [media, setMedia] = useState([]);
  const [loader, setLoader] = useState(false);
  const [active, setActive] = useState(0);
  const [image, setImage] = useState("");

  useEffect(() => {

    let timerId;

    if (searchTerm !='') {
      timerId = setTimeout(() => {
        
      if (searchTerm !== "") {
        setLoader(true);
        let keyword = GETMEDIAS().replace(
          "first:250",
          `first:250, query: "filename:${searchTerm}*"`
        );
        const postOptions = {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ content: keyword }),
        };
        (async()=>{
            const result = await fetch("/api/apps/debug/gql", postOptions).then(
                (res) => res.json()
                );
        
                let fileList = result?.text?.body?.data?.files?.edges;
        
                if (fileList.length > 0) setMedia(fileList);
                else setMedia([]);
                setLoader(false);
        })()
        
     
      } else {
        setMedia([]);
      }
      }, 1000);
    }
    return () => clearTimeout(timerId);

  }, [searchTerm]);

  const setActiveImage = (key, img) => {
    setActive(key);
    setImage(img);
  };

  return (
    <div style={{ height: "500px" }}>
      <Frame>
        <Modal
          large
          open={props.active}
          onClose={props.handleChange}
          title="Search & select Images....."
          primaryAction={ media.length > 0 &&{
            content: "Select Image",
            onAction: () => {
              props.selectImages(props.imageFor, image);
              props.handleChange();
            },
          }}
        >
          <Modal.Section>
            <VerticalStack>
              <Grid>
                {/* search area */}
                <Grid.Cell
                  columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                >
                  <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchterm(e)}
                    type="text"
                    autoComplete="email"
                    placeholder="Search Image By Name"
                  />
                </Grid.Cell>

                {/* search result area */}
                <Grid.Cell
                  columnSpan={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
                >
                  <HorizontalGrid columns={9} gap={4}>
                    {loader && (
                      <Spinner
                        accessibilityLabel="Spinner example"
                        size="large"
                      />
                    )}
                    {media.map((value, key) => {
                      let imgeUrl = value?.node?.image?.originalSrc?.split("?")[0];
                      if (!imgeUrl){return}
                      imgeUrl = imgeUrl?.split("/")
                        .slice(-1)
                        .pop()
                        .replaceAll("-", " ")
                        .replaceAll("_", " ")
                        .split(".")[0];
                      return (
                        <Grid
                          key={`${value?.node?.id.match(/\d/g).join("").toString()}`}
                        >
                          <Grid.Cell
                            columnSpan={{
                              xs: 12,
                              sm: 12,
                              md: 12,
                              lg: 12,
                              xl: 12,
                            }}
                          >
                            <a
                              href="#"
                              onClick={(e) => setActiveImage(key, value.node)}
                              className={
                                "media_selected_case " +
                                (active === key ? "active" : "")
                              }
                            >
                              <Tooltip content={imgeUrl} hoverDelay={Button}>
                                <Thumbnail
                                  source={value?.node?.image?.originalSrc}
                                  alt="Black choker necklace"
                                  size="large"
                                />
                              </Tooltip>
                            </a>
                          </Grid.Cell>
                        </Grid>
                      );
                    })}
                  </HorizontalGrid>
                  {media.length === 0 && (
                    <>
                      <Card sectioned>
                        <Text variant="heading2xl" as="h3" alignment="center">
                          Search Results for: "{searchTerm}"
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
                    </>
                  )}
                </Grid.Cell>
              </Grid>
            </VerticalStack>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
};

export default GalleryModal;
